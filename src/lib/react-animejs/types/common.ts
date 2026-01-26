/**
 * Common types shared across all animation primitives (Timer, Animation, Timeline)
 */

import type { RefObject } from "react";

// =============================================================================
// Playback Settings
// =============================================================================

/**
 * Playback settings shared by Timer, Animation, and Timeline
 */
export interface PlaybackSettings {
  /**
   * Delay before the animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;

  /**
   * Duration of the animation (in milliseconds)
   * @default 1000
   */
  duration?: number;

  /**
   * Number of times to loop the animation
   * - `true` = infinite loop
   * - `number` = specific number of loops
   * @default false
   */
  loop?: boolean | number;

  /**
   * Delay between each loop iteration (in milliseconds)
   * @default 0
   */
  loopDelay?: number;

  /**
   * Whether to alternate direction on each loop
   * @default false
   */
  alternate?: boolean;

  /**
   * Whether to play the animation in reverse
   * @default false
   */
  reversed?: boolean;

  /**
   * Whether to automatically start the animation
   * @default false (for React hooks, we default to false for better control)
   */
  autoplay?: boolean;

  /**
   * Target frame rate for the animation
   * @default null (uses default engine frame rate)
   */
  frameRate?: number | null;

  /**
   * Playback speed multiplier
   * - 1 = normal speed
   * - 0.5 = half speed
   * - 2 = double speed
   * @default 1
   */
  playbackRate?: number;
}

// =============================================================================
// Callbacks
// =============================================================================

/**
 * Animation lifecycle callbacks
 * @template T - The animation instance type
 */
export interface AnimationCallbacks<T = unknown> {
  /**
   * Called when the animation begins (after any initial delay)
   */
  onBegin?: (instance: T) => void;

  /**
   * Called when the animation completes
   */
  onComplete?: (instance: T) => void;

  /**
   * Called on every animation frame update
   * ⚠️ Use sparingly as this can impact performance if triggering React state updates
   */
  onUpdate?: (instance: T) => void;

  /**
   * Called at the end of each loop iteration
   */
  onLoop?: (instance: T) => void;

  /**
   * Called when the animation is paused
   */
  onPause?: (instance: T) => void;
}

// =============================================================================
// Playback Controls
// =============================================================================

/**
 * Playback control methods returned by animation hooks
 */
export interface PlaybackControls {
  /**
   * Start or resume the animation
   */
  play: () => void;

  /**
   * Pause the animation
   */
  pause: () => void;

  /**
   * Resume a paused animation
   */
  resume: () => void;

  /**
   * Restart the animation from the beginning
   */
  restart: () => void;

  /**
   * Reverse the animation direction
   */
  reverse: () => void;

  /**
   * Toggle the animation direction
   */
  alternate: () => void;

  /**
   * Jump to the end of the animation
   */
  complete: () => void;

  /**
   * Reset the animation to its initial state
   */
  reset: () => void;

  /**
   * Cancel the animation and reset to initial state
   */
  cancel: () => void;

  /**
   * Seek to a specific time or progress
   * @param time - Time in ms or progress string (e.g., '50%')
   */
  seek: (time: number | string) => void;

  /**
   * Change the animation duration dynamically
   * @param duration - New duration in milliseconds
   */
  stretch: (duration: number) => void;

  /**
   * Set the playback rate
   * @param rate - Speed multiplier (1 = normal, 0.5 = half, 2 = double)
   */
  setPlaybackRate: (rate: number) => void;

  /**
   * Set the frame rate dynamically
   * @param fps - Target frames per second
   */
  setFrameRate: (fps: number) => void;
}

// =============================================================================
// Animation State
// =============================================================================

/**
 * Reactive animation state
 */
export interface AnimationState {
  /**
   * Unique identifier for the animation
   */
  id: string;

  /**
   * Current progress (0 to 1)
   */
  progress: number;

  /**
   * Current time in milliseconds
   */
  currentTime: number;

  /**
   * Total duration in milliseconds
   */
  duration: number;

  /**
   * Whether the animation is currently paused
   */
  paused: boolean;

  /**
   * Whether the animation has begun playing
   */
  began: boolean;

  /**
   * Whether the animation has completed
   */
  completed: boolean;

  /**
   * Whether the animation is playing in reverse
   */
  reversed: boolean;

  /**
   * Current loop iteration (0-indexed)
   */
  currentIteration: number;
}

/**
 * Initial/default animation state
 */
export const INITIAL_ANIMATION_STATE: AnimationState = {
  id: "",
  progress: 0,
  currentTime: 0,
  duration: 0,
  paused: true,
  began: false,
  completed: false,
  reversed: false,
  currentIteration: 0,
};

// =============================================================================
// Target Types
// =============================================================================

/**
 * Valid animation target types
 */
export type AnimationTarget =
  | string // CSS selector
  | HTMLElement
  | SVGElement
  | NodeList
  | HTMLElement[]
  | SVGElement[]
  | RefObject<HTMLElement | SVGElement | null>
  | null;

/**
 * Multiple targets
 */
export type AnimationTargets = AnimationTarget | AnimationTarget[];

// =============================================================================
// Easing Types
// =============================================================================

/**
 * Built-in easing function names
 */
export type EasingName =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint"
  | "easeInSine"
  | "easeOutSine"
  | "easeInOutSine"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo"
  | "easeInCirc"
  | "easeOutCirc"
  | "easeInOutCirc"
  | "easeInBack"
  | "easeOutBack"
  | "easeInOutBack"
  | "easeInElastic"
  | "easeOutElastic"
  | "easeInOutElastic"
  | "easeInBounce"
  | "easeOutBounce"
  | "easeInOutBounce";

/**
 * Anime.js 4.x easing string patterns
 */
export type EasingPattern =
  | `in(${number})`
  | `out(${number})`
  | `inOut(${number})`
  | `outIn(${number})`
  | `spring(${number})`
  | `spring(${number}, ${number})`
  | `steps(${number})`;

/**
 * Custom easing function
 */
export type EasingFunction = (t: number) => number;

/**
 * All valid easing types
 */
export type Easing = EasingName | EasingPattern | EasingFunction | string;

// =============================================================================
// Value Types
// =============================================================================

/**
 * Animatable property value with optional from/to
 */
export interface PropertyKeyframe {
  from?: string | number;
  to?: string | number;
  duration?: number;
  delay?: number;
  ease?: Easing;
}

/**
 * A single property value or keyframe array
 */
export type PropertyValue =
  | string
  | number
  | PropertyKeyframe
  | PropertyKeyframe[]
  | (string | number)[] // Keyframe values array (any length)
  | ((target: Element, index: number, total: number) => string | number);

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Make all properties optional and allow undefined
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract the element type from a ref
 */
export type RefElement<T> = T extends RefObject<infer E> ? E : never;
