/**
 * Local scroll-pinning superset module (phase 1).
 *
 * Adds `pin` / `pinSpacing` / `onPin` / `onUnpin` on top of the published
 * `useAnimeOnScroll` / `<AnimeScroll>`. When `pin` is falsy these delegate to
 * the published APIs unchanged. Phase 2 ports the engine into
 * `react-animejs-package` and folds the `pin` branch into the real
 * `useAnimeOnScroll` / `<AnimeScroll>`; this barrel is then deleted.
 */

export { createPinEngine, PIN_DEFAULT_STATE } from './pin-engine';
export { useAnimeOnScrollPin, default as useAnimeOnScrollPinDefault } from './use-anime-onscroll-pin';
export { AnimeScrollPin, default as AnimeScrollPinDefault } from './AnimeScrollPin';
export type {
  AnimeScrollPinProps,
  AnimeScrollPinRef,
  PinEngine,
  PinEngineOptions,
  PinObserverLike,
  PinState,
  ScrollThreshold,
  UseAnimeScrollPinControls,
  UseAnimeScrollPinOptions,
  UseAnimeScrollPinReturn,
} from './types';
