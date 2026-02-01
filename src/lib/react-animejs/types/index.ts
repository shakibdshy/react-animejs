/**
 * React Anime.js Type Definitions
 *
 * Re-exports all types for convenient importing
 */

// Common types
export type {
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  AnimationTarget,
  AnimationTargets,
  EasingName,
  EasingPattern,
  EasingFunction,
  Easing,
  PropertyKeyframe,
  PropertyValue,
  DeepPartial,
  RefElement,
} from "./common";

export { INITIAL_ANIMATION_STATE } from "./common";

// Animation types
export type {
  TransformProperties,
  CSSAnimatableProperties,
  AnimatableProperties,
  TweenParameters,
  StaggerOptions,
  UseAnimeOptions,
  UseAnimeReturn,
  JSAnimation,
} from "./animation";

// Timer types
export type { UseAnimeTimerOptions, UseAnimeTimerReturn, Timer } from "./timer";

// Timeline types
export type {
  TimelineEntry,
  TimelineLabel,
  TimelineChild,
  TimelineDefaults,
  TimelineControls,
  UseAnimeTimelineOptions,
  UseAnimeTimelineReturn,
  Timeline,
} from "./timeline";

// Draggable types
export type {
  DraggableModifier,
  DraggableAxisParams,
  DraggableMapToConfig,
  DraggableBounds,
  DraggableAxis,
  DraggableSnap,
  DraggableCursorParams,
  DraggableCallbacks,
  UseAnimeDraggableOptions,
  DraggableState,
  UseAnimeDraggableReturn,
  Draggable,
} from "./draggable";

// WAAPI types
export type {
  UseAnimeWAAPIOptions,
  UseAnimeWAAPIReturn,
  WAAPIAnimation,
} from "./waapi";

// Scope types
export type {
  AnimeScope,
  ScopeSelf,
  AnimeScopeContext,
  AnimeProviderProps,
} from "./scope";
