/**
 * Core module exports
 */

export { AnimeProvider, useScopeContext, useScopedRoot } from './scope-context';
export {
  TimelineContext,
  useTimelineContext,
  useTimelineContextSafe,
} from './timeline-context';
export type { TimelineContextValue } from './timeline-context';
export {
  DEFAULT_PLAYBACK_SETTINGS,
  DEFAULT_ANIMATION_STATE,
  RESERVED_KEYS,
} from './constants';
export { resolveTarget, isRef } from './targets';
export { parseAnimeOptions } from './props';
export { extractAnimationState, buildCallbackConfig } from './state';
export { createSafeCallback, cleanUndefinedValues } from './callbacks';
export { mergeRefs } from './refs';
export { depsChanged, isPlainObject, isFunction, safeJsonStringify } from './utilities';
