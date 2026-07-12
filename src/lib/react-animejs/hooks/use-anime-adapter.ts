/**
 * useAnimeAdapter - Register a custom adapter idempotently
 *
 * Lets `useAnime` / `<Anime>` animate non-DOM objects (Three.js, PixiJS,
 * Canvas, custom class instances) by registering an anime.js v4.5.0 adapter.
 *
 * Registration is keyed by `config.id` and deduped across React lifecycle,
 * so the same adapter is never registered twice (mount/unmount/StrictMode).
 *
 * @example
 * ```tsx
 * function PixiStage() {
 *   // Register once; useAnime can now animate Pixi display objects
 *   useAnimeAdapter({
 *     id: 'pixi',
 *     detect: (t) => t?.isPixiDisplayObject,
 *     targets: [{
 *       detect: (t) => t.isSprite,
 *       properties: {
 *         x: { get: (t) => t.x, set: (t, v) => { t.x = v; } },
 *         y: { get: (t) => t.y, set: (t, v) => { t.y = v; } },
 *       },
 *     }],
 *   });
 *
 *   const { targets: sprite } = useRef({ x: 0, y: 0, isSprite: true, isPixiDisplayObject: true });
 *   const { controls } = useAnime({ targets: sprite.current, x: 100, duration: 1000 });
 *
 *   return <button onClick={controls.play}>Animate sprite</button>;
 * }
 * ```
 *
 * @see https://animejs.com/documentation/adapters/
 */

import { useEffect, useState } from 'react';
import { registerAnimeAdapter } from '../core/adapter-registry';
import type {
  AnimeAdapterConfig,
  AnimeAdapterInstance,
} from '../types/adapter';

export interface UseAnimeAdapterReturn {
  /** The registered adapter instance, or null before registration completes. */
  adapter: AnimeAdapterInstance | null;
  /** Whether the adapter has been registered. */
  isReady: boolean;
}

export function useAnimeAdapter(
  config: AnimeAdapterConfig,
): UseAnimeAdapterReturn {
  const [adapter, setAdapter] = useState<AnimeAdapterInstance | null>(null);

  // Register idempotently. `config.id` is the key — the same id always
  // returns the existing adapter, never a duplicate. We register in an effect
  // (not during render) to keep side effects out of the render phase, and
  // because adapter registration touches a module-level singleton.
  useEffect(() => {
    const instance = registerAnimeAdapter(config);
    setAdapter(instance);
  }, [config.id]); // intentionally only re-run on id change; config is stable per id

  return {
    adapter,
    isReady: adapter !== null,
  };
}
