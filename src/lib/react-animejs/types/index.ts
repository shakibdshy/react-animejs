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
  SpringParams,
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
  // Scope parameter types
  ScopeMediaQueries,
  ScopeMediaMatches,
  ScopeDefaults,
  ScopeParameters,
  // Scope self types (passed to constructors)
  ScopeSelf,
  ScopeCleanupFunction,
  ScopeConstructorFunction,
  ScopeMethods,
  // Anime.js Scope instance
  AnimeJsScope,
  AnimeScope, // Legacy alias
  // React hook types
  UseAnimeScopeOptions,
  UseAnimeScopeReturn,
  // Context types
  AnimeScopeContext,
  AnimeProviderProps,
} from "./scope";

export type {
  AutoLayout,
  AutoLayoutParams,
  LayoutAnimationParams,
  UseAnimeLayoutControls,
  UseAnimeLayoutOptions,
  UseAnimeLayoutReturn,
} from "./layout";

// Event types
export type {
  ScrollObserver,
  ScrollObserverParams,
  ScrollThresholdCallback,
  ScrollThresholdParam,
  ScrollThresholdValue,
  ScrollLinkedInstance,
  ScrollLinkedTarget,
  ScrollObserverState,
  ScrollObserverCallbacks,
  UseAnimeOnScrollOptions,
  UseAnimeOnScrollControls,
  UseAnimeOnScrollReturn,
} from "./events";
