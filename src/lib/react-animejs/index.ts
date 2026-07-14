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

export { useAnime } from './hooks/use-anime';
export { useAnimeTimer } from './hooks/use-anime-timer';
export { useAnimeTimeline } from './hooks/use-anime-timeline';
export { useAnimeLayout } from './hooks/use-anime-layout';
export { useAnimeDraggable } from './hooks/use-anime-draggable';
export { useAnimeOnScroll } from './hooks/use-anime-onscroll';
export { useAnimeControls } from './hooks/use-anime-controls';
export { useAnimeWAAPI } from './hooks/use-anime-waapi';
export { useAnimeScope } from './hooks';
export { useAnimatable, useAnimatableEvent } from './hooks/use-animatable';
export type {
  AnimatableConfig,
  AnimatableInstance,
  AnimatablePropertySettings,
  UseAnimatableReturn,
} from './hooks/use-animatable';
export type { AnimeController } from './hooks/use-anime-controls';
export { useAnimeAdapter } from './hooks/use-anime-adapter';
export type { UseAnimeAdapterReturn } from './hooks/use-anime-adapter';
export { useSvgAnimation } from './hooks/use-anime-svg';
export type { SvgComponentRef, SvgAnimationOptions } from './hooks/use-anime-svg';

// =============================================================================
// Components
// =============================================================================

export { AnimeProvider } from './core/scope-context';
export { Anime } from './components/Anime';
export type { AnimeProps } from './components/Anime';
export { AnimeBatch } from './components/AnimeBatch';
export type { AnimeBatchAnimation, AnimeBatchProps } from './components/AnimeBatch';
export { AnimeMorph } from './components/AnimeMorph';
export type { AnimeMorphProps, AnimeMorphRef } from './components/AnimeMorph';
export { AnimeDraw } from './components/AnimeDraw';
export type { AnimeDrawProps, AnimeDrawRef } from './components/AnimeDraw';
export { AnimeMotionPath } from './components/AnimeMotionPath';
export type { AnimeMotionPathProps, AnimeMotionPathRef } from './components/AnimeMotionPath';
export { AnimePresence, AnimePresenceChild } from './components/AnimePresence';
export type { AnimePresenceProps, AnimePresenceChildProps } from './components/AnimePresence';
export { AnimeLayout, AnimeLayoutItem } from './components/AnimeLayout';
export type {
  AnimeLayoutProps,
  AnimeLayoutRef,
  AnimeLayoutItemProps,
  AnimeLayoutMode,
  AnimeLayoutStateParams,
  AnimeLayoutCallbacks,
} from './components/AnimeLayout';
export { AnimeTimeline } from './components/AnimeTimeline';
export type { AnimeTimelineProps, AnimeTimelineRef } from './components/AnimeTimeline';
export { AnimeWAAPI } from './components/AnimeWAAPI';
export type { AnimeWAAPIProps, AnimeWAAPIRef } from './components/AnimeWAAPI';
export { AnimeAdapter } from './components/AnimeAdapter';
export type { AnimeAdapterProps } from './components/AnimeAdapter';


// =============================================================================
// =============================================================================
// Text Scramble
// =============================================================================

export { useAnimeScramble } from './hooks/use-anime-scramble';
export type {
  UseAnimeScrambleOptions,
  UseAnimeScrambleReturn,
} from './types/scramble-text';

// =============================================================================
// Core Utilities
// =============================================================================

export { useScopeContext, useScopedRoot } from './core';

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
} from './utils/presets';
export type { PresetName } from './utils/presets';

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
  stagger,
} from './utils/stagger-helpers';

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
  UseAnimeScrollTriggerOptions,
  UseAnimeOnScrollOptions,
  UseAnimeOnScrollControls,
  UseAnimeOnScrollReturn,

  // ScrambleText types
  ScrambleTextParams,

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

  // Adapter types
  AnimeAdapterConfig,
  AnimeAdapterProperty,
  AnimeAdapterTarget,
  AnimeAdapterInstance,
} from './types';

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
  // Imperative factories that complement the declarative components above
  // (<AnimeDraw>, <AnimeMotionPath>, <AnimeMorph>) for consumers who want the
  // raw anime.js primitives without the React wrapper.
  createDrawable,
  createMotionPath,
  createSpring,
  onScroll,
  morphTo,
  ScrollObserver,
  scrollContainers,
  AutoLayout,
  spring,
  cubicBezier,
  linear,
  steps,
  irregular,
  stagger as animeStagger,
  // `eases` is the full named-easing registry (46 entries); `easings` below is
  // the curve-constructor set (8 entries). Both are kept for distinct uses.
  eases,
  easings,
  svg,
  utils,
  engine,
  waapi,
  globals,
} from 'animejs';

// Text utilities (complement useAnimeScramble / SplitText component)
export { split, splitText, TextSplitter } from 'animejs';

// SplitText component (declarative text splitting + animation)
export { SplitText } from './components/SplitText';
export type { SplitTextProps, SplitTextRef } from './components/SplitText';

export * as events from 'animejs/events';

export { scrambleText } from 'animejs/text';

// Adapter API (anime.js v4.5.0+) — raw imperative form for advanced use cases.
// For the React-friendly version, use useAnimeAdapter / <AnimeAdapter> above.
export { registerAdapter } from 'animejs/adapters';
