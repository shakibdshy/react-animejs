/**
 * React Anime.js - A comprehensive React wrapper for Anime.js
 *
 * This library provides React-friendly hooks and components for creating
 * animations using the powerful Anime.js animation engine.
 *
 * @packageDocumentation
 */

// =============================================================================
// Hooks
// =============================================================================

export { useAnime } from "./hooks/use-anime";
export { useAnimeTimer } from "./hooks/use-anime-timer";
export { useAnimeTimeline } from "./hooks/use-anime-timeline";
export { useAnimeLayout } from "./hooks/use-anime-layout";
export { useAnimeDraggable } from "./hooks/use-anime-draggable";
export { useAnimeOnScroll } from "./hooks/use-anime-onscroll";
export { useAnimeControls } from "./hooks/use-anime-controls";
export { useAnimeWAAPI } from "./hooks/use-anime-waapi";
export { useAnimatable, useAnimatableEvent } from "./hooks/use-animatable";
export { useAnimeScope as useCreateScope } from "./hooks/use-anime-scope";
export type {
  AnimatableConfig,
  AnimatableInstance,
  AnimatablePropertySettings,
  UseAnimatableReturn,
} from "./hooks/use-animatable";
export type { AnimeController } from "./hooks/use-anime-controls";

// =============================================================================
// Components
// =============================================================================

export { AnimeProvider } from "./core/scope-context";
export { Animate } from "./components/Animate";
export type { AnimateProps } from "./components/Animate";
export { AnimeMorph } from "./components/AnimeMorph";
export type { AnimeMorphProps, AnimeMorphRef } from "./components/AnimeMorph";
export { AnimeDraw } from "./components/AnimeDraw";
export type { AnimeDrawProps, AnimeDrawRef } from "./components/AnimeDraw";
export { AnimeMotionPath } from "./components/AnimeMotionPath";
export type {
  AnimeMotionPathProps,
  AnimeMotionPathRef,
} from "./components/AnimeMotionPath";
export {
  AnimatePresence,
  AnimatePresenceChild,
} from "./components/AnimatePresence";
export type {
  AnimatePresenceProps,
  AnimatePresenceChildProps,
} from "./components/AnimatePresence";
export { AnimeLayout, AnimeLayoutItem } from "./components/AnimeLayout";
export type {
  AnimeLayoutProps,
  AnimeLayoutRef,
  AnimeLayoutItemProps,
  AnimeLayoutMode,
  AnimeLayoutStateParams,
  AnimeLayoutCallbacks,
} from "./components/AnimeLayout";
export { AnimeTimeline } from "./components/AnimeTimeline";
export type {
  AnimeTimelineProps,
  AnimeTimelineRef,
} from "./components/AnimeTimeline";
export { AnimeWAAPI } from "./components/AnimeWAAPI";
export type {
  AnimeWAAPIProps,
  AnimeWAAPIRef,
} from "./components/AnimeWAAPI";
export { ToggleSwitch } from "./components/ToggleSwitch";
export type { ToggleSwitchProps } from "./components/ToggleSwitch";
export { Counter } from "./components/Counter";
export type { CounterProps } from "./components/Counter";
export { Countdown } from "./components/Countdown";
export type { CountdownProps } from "./components/Countdown";
export { SpinningCube } from "./components/SpinningCube";
export type { SpinningCubeProps } from "./components/SpinningCube";
export { ClipPathReveal } from "./components/ClipPathReveal";
export type { ClipPathRevealProps, ClipPathShape } from "./components/ClipPathReveal";
export { AnimatedSlider } from "./components/AnimatedSlider";
export type {
  AnimatedSliderProps,
  SlideDirection,
  SlideTransition,
} from "./components/AnimatedSlider";

// =============================================================================
// Core Utilities
// =============================================================================

export { useAnimeScope, useScopedRoot, stagger } from "./core";

// =============================================================================
// Presets & Helpers
// =============================================================================

// Animation presets
export {
  fadeIn,
  fadeOut,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleOut,
  popIn,
  slideInTop,
  slideInBottom,
  slideInLeft,
  slideInRight,
  pulse,
  bounce,
  shake,
  wiggle,
  heartbeat,
  flipInX,
  flipInY,
  rotateIn,
  spin,
  presets,
  getPreset,
} from "./utils/presets";
export type { PresetName } from "./utils/presets";

// Stagger helpers
export {
  simpleStagger,
  staggerFromCenter,
  staggerFromLast,
  staggerFromEdges,
  staggerFromIndex,
  gridStagger,
  gridStaggerX,
  gridStaggerY,
  rippleStagger,
  easedStagger,
  inOutStagger,
  outStagger,
  randomStagger,
  createStagger,
} from "./utils/stagger-helpers";

// =============================================================================
// Types
// =============================================================================

export type {
  // Common types
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  AnimationTarget,
  AnimationTargets,
  Easing,
  EasingName,
  EasingPattern,
  EasingFunction,
  SpringParams,
  PropertyKeyframe,
  PropertyValue,

  // Animation types
  TransformProperties,
  CSSAnimatableProperties,
  AnimatableProperties,
  TweenParameters,
  StaggerOptions,
  UseAnimeOptions,
  UseAnimeReturn,
  JSAnimation,

  // Timer types
  UseAnimeTimerOptions,
  UseAnimeTimerReturn,
  Timer,

  // Timeline types
  TimelineEntry,
  TimelineLabel,
  TimelineChild,
  TimelineDefaults,
  UseAnimeTimelineOptions,
  UseAnimeTimelineReturn,
  Timeline,

  // Layout types
  AutoLayoutParams,
  LayoutAnimationParams,
  UseAnimeLayoutControls,
  UseAnimeLayoutOptions,
  UseAnimeLayoutReturn,

  // Draggable types
  DraggableBounds,
  DraggableAxis,
  DraggableSnap,
  DraggableCallbacks,
  UseAnimeDraggableOptions,
  DraggableState,
  UseAnimeDraggableReturn,
  Draggable,

  // Events types
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

  // Scope types
  ScopeMediaQueries,
  ScopeMediaMatches,
  ScopeDefaults,
  ScopeParameters,
  ScopeSelf,
  ScopeCleanupFunction,
  ScopeConstructorFunction,
  ScopeMethods,
  AnimeJsScope,
  AnimeScope,
  UseAnimeScopeOptions,
  UseAnimeScopeReturn,
  AnimeScopeContext,
  AnimeProviderProps,
} from "./types";

// =============================================================================
// Re-exports from Anime.js (for convenience)
// =============================================================================

export {
  animate,
  createTimer,
  createTimeline,
  createLayout,
  createAnimatable,
  createScope,
  createDraggable,
  onScroll,
  ScrollObserver,
  scrollContainers,
  AutoLayout,
  spring,
  cubicBezier,
  linear,
  steps,
  irregular,
  stagger as animeStagger,
  easings,
  svg,
  utils,
  engine,
  waapi,
} from "animejs";

export * as events from "animejs/events";
