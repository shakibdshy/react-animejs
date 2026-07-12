## Adapter Support for react-animejs

### Goal
Add React-idiomatic adapter support so consumers can animate non-DOM objects (Three.js, PixiJS, Canvas, custom class instances) through `useAnime`/`<Anime>` — the same way they animate DOM elements. This wraps anime.js v4.5.0's `registerAdapter` API (from `animejs/adapters`) with proper React lifecycle handling.

### Key architectural finding
- **Target pipeline already works**: `resolveTarget` passes non-DOM objects through untouched, and `AnimationTarget` already includes `| object`. No changes needed to `useAnime`/`resolveTarget` — once an adapter is registered, `animate(threeObject, {...})` works through the existing hook.
- **The gap is registration**: anime.js v4.5.0 exposes `registerAdapter` via the `animejs/adapters` subpath, but it's imperative, global, and **has no unregister**. A React hook that calls it on every mount would leak duplicate adapters. The wrapper's job is idempotent registration.

### Design: idempotent registration keyed by stable `id`

A module-level `Map<string, Adapter>` singleton in `core/adapter-registry.ts`:
- On first registration for an `id`: call `registerAdapter()`, wire target adapters + properties, store in map.
- On subsequent calls with the same `id`: return the existing adapter (no-op).
- Since anime.js has no unregister, registration is permanent/global — this is correct for "register once per app" semantics. The hook just guarantees no duplicates across React lifecycle (mount/unmount/StrictMode).

### Files to create

1. **`types/adapter.ts`** — Type definitions
   - `AnimeAdapterConfig`: mirrors anime.js's 3-level structure (`detect` → `targets[]` → `properties{}`)
   - `AnimeAdapterProperty`: `{ get, set, gate? }` matching `TargetAdapterEntry`
   - Re-export `Adapter`, `TargetAdapter` types from `animejs/adapters`

2. **`core/adapter-registry.ts`** — Idempotent registration singleton
   - `registerAnimeAdapter(config: AnimeAdapterConfig): Adapter` — checks module-level `Map` by `id`, registers if new, returns existing if duplicate
   - `getRegisteredAdapter(id: string): Adapter | undefined` — lookup without registering
   - `clearAdapterRegistryForTesting()` — test-only helper (since anime.js itself can't unregister)

3. **`hooks/use-anime-adapter.ts`** — React hook
   ```tsx
   const adapter = useAnimeAdapter({
     id: 'pixi',
     detect: (t) => t?.isPixiDisplayObject,
     targets: [{
       detect: (t) => t.isSprite,
       properties: {
         x: { get: (t) => t.x, set: (t, v) => { t.x = v; } },
         y: { get: (t) => t.y, set: (t, v) => { t.y = v; } },
       },
     }],
   });
   // Then: useAnime({ targets: pixiSprite, x: 100, duration: 1000 }) just works
   ```
   - Memoizes config, calls `registerAnimeAdapter` idempotently
   - Returns the `Adapter` instance (or null if not ready)
   - No cleanup effect (registration is intentionally permanent)

4. **`components/AnimeAdapter.tsx`** — Declarative component
   ```tsx
   <AnimeAdapter id="pixi" detect={...} targets={[...]}>
     <PixiStage />
   </AnimeAdapter>
   ```
   - Wraps the hook, renders children (no DOM node — like `<AnimeTimeline>`)
   - Optional `onReady?: (adapter) => void`

5. **`hooks/__tests__/use-anime-adapter.test.ts`** — Tests
   - Idempotency: same `id` registered twice returns same adapter, doesn't duplicate
   - Different `id`s create separate adapters
   - Adapter actually works: register a mock adapter, verify `useAnime` can animate a fake target through it

### Files to modify

6. **`index.ts`** — Add exports:
   - `export { useAnimeAdapter } from './hooks/use-anime-adapter'`
   - `export { AnimeAdapter } from './components/AnimeAdapter'`
   - `export { registerAdapter } from 'animejs/adapters'` (raw API for advanced users)
   - `export type { AnimeAdapterConfig, AnimeAdapterProperty } from './types/adapter'`

7. **`types/index.ts`** — Re-export adapter types

### What I'm NOT doing (and why)
- **Not re-exporting the three.js adapter.** `animejs/adapters/three` imports from `three`, which would force `three` as a dependency. Users who want three.js just do `import 'animejs/adapters/three'` for side effects — the wrapper's target pipeline already handles non-DOM objects.
- **Not modifying `resolveTarget` or `AnimationTarget`.** They already accept non-DOM objects; no widening needed.
- **Not adding an unregister mechanism to the hook.** anime.js itself can't unregister adapters, so the hook registers once-permanent (idempotent by `id`). This matches the underlying library's semantics.

### Verification plan
- `tsc --noEmit`: 0 new errors (baseline 29 pre-existing)
- `vitest run`: new adapter tests pass + existing 83 tests still pass
- Manual smoke check: register a mock adapter in a test, confirm `useAnime` routes through it