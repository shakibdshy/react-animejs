## Scrubbed Bento Gallery — a new react-animejs block

Faithful port of the GSAP "Scrubbed Bento Gallery" (Codepen vYMzKZx): 8 image tiles in a bento grid that **FLIP-morph into a uniform spread** as you scroll, with scroll position **scrubbing** the transition while the gallery is **pinned**. Built only with built-in library primitives — no manual RAF, no GSAP-style FLIP plugin, no per-frame imperative seeking.

### Approach (idiomatic, matches existing `MorphTileDemo` / `DepthStackDemo` / `RevealColumnsDemo`)
Use `useAnimeOnScroll` to get a scrubbed `state.progress` (0→1), then **derive every tile's geometry from progress via `utils.lerp`** in inline styles — the same render-from-progress pattern already used across the scroll-linked demos. This is the library's recommended style and avoids React state churn on every scroll tick.

- **Pinning:** a tall scroll track (`h-[300vh]`) with a `sticky top-0 h-screen` stage — the gallery stays fixed while the track scrolls, exactly like the GSAP ScrollTrigger pin.
- **Two precomputed layouts:** `BENTO` (collapsed, mixed-size 4-col grid → 8 rects) and `SPREAD` (uniform full-bleed grid → 8 rects). Each tile interpolates `x, y, w, h, radius, opacity` between its two rects with `lerp(bento, spread, progress)`. `progress=0` → bento; `progress=1` → spread; reverse scroll unwinds it. This is a clean FLIP morph expressed as continuous interpolation.
- **Shared progress, staggered feel:** all tiles share one observer (one scroll region), but tile index adds a tiny ease-offset so they don't move in lockstep — mirroring the GSAP stagger feel without a separate observer per tile.

### Files

**New — `src/blocks/components/ScrubbedBentoGallery.tsx`** (self-contained block, `memo`-wrapped, named + default export, matches `TiltCard.tsx` conventions):
- `import { useAnimeOnScroll, utils } from '@/lib/react-animejs'`
- `utils.lerp` / `utils.clamp` from the library's anime-utils re-exports (verified exported) for interpolation + progress clamping.
- Data: 8 tiles — local images from existing convention (`/logo512.png`, `/logo192.png`, `/tanstack-circle-logo.png`, reused/cycled), each with a `landing-accent`-tinted gradient frame fallback so it reads as a real gallery and stays on-brand.
- `BENTO` rects: a hand-tuned asymmetric bento (one big hero tile + smaller ones) over a fixed stage box. `SPREAD` rects: a uniform 4×2 grid filling the stage. Same tile count, keyed by index.
- A `<Tile>` subcomponent (memoized) that takes `{ src, progress, from, to }` and renders an absolutely-positioned div whose `left/top/width/height/borderRadius/opacity` are all `lerp(from, to, eased)` inline styles + `transition: 'all 60ms linear'` (smooths between observer ticks, same trick as `RevealColumnsDemo`).
- Outer container: `relative h-[300vh]` track → inner `sticky top-0 h-[calc(100vh-4rem)] flex items-center justify-center` stage; observer `target` = the track, `enter/leave` tuned so progress spans the pinned range.
- Standard block footer hint span: `landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60` → "scroll · bento morphs into a full spread".
- Theme: `landing-*` tokens only (`bg-landing-bg`, `text-landing-fg`, `border-landing-border`, `landing-accent`), serif display/mono fonts, `rounded-2xl` stage, warm editorial neutrals — identical language to `TiltCard`/`MacOSDock`.
- `useAnimeOnScroll({ target: trackRef, enter: 'center center', leave: 'center center' })` (or equivalent band) so progress maps 0→1 across the pinned scroll.

**Edit — `src/blocks/blocks-page.tsx`** (follow the exact existing recipe):
- Import `ScrubbedBentoGallery` and its `?raw` source (`./components/ScrubbedBentoGallery.tsx?raw`).
- Add `'scrubbed-bento': { title: 'ScrubbedBentoGallery.tsx', code: scrubbedBentoSource }` to `SOURCE_BY_KEY` so "View Code" works.
- Add a new `<section className="mb-16">` (placed last, after OrchestratedEaseReverse) with `SectionHeader` (`title="Scrubbed Bento Gallery · Scroll FLIP"`, `chip="useAnimeOnScroll + utils.lerp"`, `codeKey="scrubbed-bento"`), a one-paragraph description in the same voice/style as the others, and `<ErrorBoundary><ScrubbedBentoGallery /></ErrorBoundary>`.

### No new deps, no theme changes, no routing changes
Routing already maps `/blocks` → `BlocksPage`. Everything reuses existing `ErrorBoundary`, `CodeModal`, `SectionHeader`, and library exports.

### Verify after implementation
- `npm run typecheck` passes.
- `npm run dev` → `/blocks` shows the new block last; scrolling the stage pins it and morphs bento↔spread; reverse scroll unwinds; "View Code" shows the real source.