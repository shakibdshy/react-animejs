/**
 * Animation-specific types for useAnime hook
 */

import type { RefObject } from "react";
import type {
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  AnimationTargets,
  Easing,
  PropertyValue,
} from "./common";

// =============================================================================
// Animatable CSS Properties
// =============================================================================

/**
 * CSS Transform properties
 */
export interface TransformProperties {
  translateX?: PropertyValue;
  translateY?: PropertyValue;
  translateZ?: PropertyValue;
  translate?: PropertyValue;
  rotate?: PropertyValue;
  rotateX?: PropertyValue;
  rotateY?: PropertyValue;
  rotateZ?: PropertyValue;
  scale?: PropertyValue;
  scaleX?: PropertyValue;
  scaleY?: PropertyValue;
  scaleZ?: PropertyValue;
  skew?: PropertyValue;
  skewX?: PropertyValue;
  skewY?: PropertyValue;
  perspective?: PropertyValue;
}

/**
 * Common CSS properties that can be animated
 */
export interface CSSAnimatableProperties {
  // Opacity & Visibility
  opacity?: PropertyValue;
  visibility?: PropertyValue;

  // Dimensions
  width?: PropertyValue;
  height?: PropertyValue;
  minWidth?: PropertyValue;
  minHeight?: PropertyValue;
  maxWidth?: PropertyValue;
  maxHeight?: PropertyValue;

  // Spacing
  margin?: PropertyValue;
  marginTop?: PropertyValue;
  marginRight?: PropertyValue;
  marginBottom?: PropertyValue;
  marginLeft?: PropertyValue;
  padding?: PropertyValue;
  paddingTop?: PropertyValue;
  paddingRight?: PropertyValue;
  paddingBottom?: PropertyValue;
  paddingLeft?: PropertyValue;

  // Position
  top?: PropertyValue;
  right?: PropertyValue;
  bottom?: PropertyValue;
  left?: PropertyValue;

  // Colors
  color?: PropertyValue;
  backgroundColor?: PropertyValue;
  borderColor?: PropertyValue;
  outlineColor?: PropertyValue;
  fill?: PropertyValue;
  stroke?: PropertyValue;

  // Border
  borderWidth?: PropertyValue;
  borderRadius?: PropertyValue;
  borderTopLeftRadius?: PropertyValue;
  borderTopRightRadius?: PropertyValue;
  borderBottomLeftRadius?: PropertyValue;
  borderBottomRightRadius?: PropertyValue;

  // Box
  boxShadow?: PropertyValue;
  outline?: PropertyValue;
  outlineOffset?: PropertyValue;

  // Typography
  fontSize?: PropertyValue;
  fontWeight?: PropertyValue;
  letterSpacing?: PropertyValue;
  lineHeight?: PropertyValue;
  textIndent?: PropertyValue;
  wordSpacing?: PropertyValue;

  // Flex/Grid
  flexGrow?: PropertyValue;
  flexShrink?: PropertyValue;
  flexBasis?: PropertyValue;
  gap?: PropertyValue;

  // SVG
  strokeWidth?: PropertyValue;
  strokeDasharray?: PropertyValue;
  strokeDashoffset?: PropertyValue;

  // Filters
  filter?: PropertyValue;
  backdropFilter?: PropertyValue;

  // Clip
  clipPath?: PropertyValue;

  // Z-index
  zIndex?: PropertyValue;
}

/**
 * All animatable properties (CSS + Transform)
 */
export interface AnimatableProperties
  extends TransformProperties, CSSAnimatableProperties {
  /**
   * Custom CSS property or any additional property
   * Allows animating any CSS custom property (--my-prop) or other properties
   */
  [key: string]: any;
}

// =============================================================================
// Animation Options
// =============================================================================

/**
 * Tween-specific parameters
 */
export interface TweenParameters {
  /**
   * Easing function for this animation
   * @default 'outQuad'
   */
  ease?: Easing;

  /**
   * Round values to the nearest integer
   * @default false
   */
  round?: boolean | number;

  /**
   * Modifier function applied to the animated value
   */
  modifier?: (value: number) => number | string;

  /**
   * Composition mode for overlapping animations
   * - 'none' = no composition
   * - 'replace' = replace previous animation value
   * - 'blend' = blend with previous animation
   */
  composition?: "none" | "replace" | "blend";
}

/**
 * Stagger configuration
 */
export interface StaggerOptions {
  /**
   * Starting value for stagger
   * @default 0
   */
  start?: number;

  /**
   * Direction of stagger
   */
  from?: "first" | "last" | "center" | "edges" | number;

  /**
   * Easing for stagger timing
   */
  easing?: Easing;

  /**
   * Grid configuration for 2D stagger [columns, rows]
   */
  grid?: [number, number];

  /**
   * Axis for grid stagger
   */
  axis?: "x" | "y";
}

// =============================================================================
// useAnime Hook Types
// =============================================================================

/**
 * Options for useAnime hook
 */
export type UseAnimeOptions = PlaybackSettings &
  AnimationCallbacks<JSAnimation> &
  TweenParameters &
  Partial<AnimatableProperties> & {
    /**
     * CSS selector to target elements within the scoped root
     * Use this instead of ref when targeting multiple elements
     */
    selector?: string;

    /**
     * External targets to animate (alternative to ref)
     */
    targets?: AnimationTargets;

    /**
     * Delay each target's animation
     */
    stagger?: number | StaggerOptions;

    /**
     * Keyframes for the animation
     */
    keyframes?: Partial<AnimatableProperties>[];

    /**
     * Dependencies that should trigger animation re-initialization
     * Similar to useEffect dependencies
     */
    deps?: unknown[];

    /**
     * Whether the animation should be enabled
     * @default true
     */
    enabled?: boolean;

    /**
     * Shared controller from useAnimeControls
     * When provided, the animation will be registered with this controller
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controller?: {
      register: (animation: any) => () => void;
    };
  };

/**
 * Return type for useAnime hook
 */
export interface UseAnimeReturn<
  T extends HTMLElement | SVGElement = HTMLElement,
> {
  /**
   * Ref to attach to the target element
   */
  ref: RefObject<T | null>;

  /**
   * Playback control methods
   */
  controls: PlaybackControls;

  /**
   * Current animation state (reactive)
   */
  state: AnimationState;

  /**
   * Raw animation instance (escape hatch for advanced usage)
   * May be null if animation hasn't been created yet
   */
  animation: unknown | null;

  /**
   * Whether the animation is currently playing
   */
  isPlaying: boolean;

  /**
   * Whether the animation is ready (created and initialized)
   */
  isReady: boolean;
}

// =============================================================================
// Animation Instance Types (from Anime.js)
// =============================================================================

/**
 * Internal Anime.js JSAnimation type representation
 * This mirrors the actual Anime.js API for type safety
 */
export interface JSAnimation {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  began: boolean;
  completed: boolean;
  reversed: boolean;
  persist: boolean;
  _currentIteration: number;

  // Methods
  play(): this;
  pause(): this;
  resume(): this;
  restart(): this;
  reverse(): this;
  alternate(): this;
  complete(): this;
  reset(): this;
  cancel(): this;
  revert(): this;
  refresh(): this;
  seek(time: number | string): this;
  stretch(duration: number): this;
  then(callback: (anim: this) => void): Promise<this>;
}
