/**
 * Core module exports
 */

export { AnimeProvider, useAnimeScope, useScopedRoot } from "./scope-context";
export {
  TimelineContext,
  useTimelineContext,
  useTimelineContextSafe,
} from "./timeline-context";
export type { TimelineContextValue } from "./timeline-context";
export {
  DEFAULT_PLAYBACK_SETTINGS,
  DEFAULT_ANIMATION_STATE,
  RESERVED_KEYS,
} from "./constants";
export {
  resolveTarget,
  isRef,
  parseAnimeOptions,
  extractAnimationState,
  createSafeCallback,
  mergeRefs,
  depsChanged,
  isPlainObject,
  isFunction,
  safeJsonStringify,
  buildCallbackConfig,
  cleanUndefinedValues,
} from "./helpers";
