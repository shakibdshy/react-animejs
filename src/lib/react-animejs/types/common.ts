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

  /**
   * Easing function for the playback progress
   * @default 'linear'
   */
  playbackEase?: Easing;

  /**
   * Whether the animation should persist in the engine after completion
   * @default false
   */
  persist?: boolean;
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
   * Executes a function when a timer starts (after any initial delay)
   * @default noop
   */
  onBegin?: (instance: T) => void;

  /**
   * Executes a function when all the iterations (loop) of a timer have finished playing
   * @default noop
   */
  onComplete?: (instance: T) => void;

  /**
   * Executes a function on every frames of a running timer at the specified frameRate
   * @default noop
   */
  onUpdate?: (instance: T) => void;

  /**
   * Executes a function after the values are applied to targets on every frame
   * @default noop
   */
  onRender?: (instance: T) => void;

  /**
   * Executes a function before the values are calculated on every frame
   * @default noop
   */
  onBeforeUpdate?: (instance: T) => void;

  /**
   * Executes a function every time a timer iteration completes
   * @default noop
   */
  onLoop?: (instance: T) => void;

  /**
   * Executes a function when a running timer is paused
   * @default noop
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
   * Starts or resumes the timer.
   */
  play: () => void;

  /**
   * Pauses a running timer.
   */
  pause: () => void;

  /**
   * Resumes a paused timer.
   */
  resume: () => void;

  /**
   * Restarts the timer from its initial position.
   */
  restart: () => void;

  /**
   * Reverses the timer direction.
   */
  reverse: () => void;

  /**
   * Toggles the timer direction.
   */
  alternate: () => void;

  /**
   * Finishes the timer and jumps to its end position.
   */
  complete: () => void;

  /**
   * Resets the timer to its initial position without removing its internal state.
   */
  reset: () => void;

  /**
   * Cancels the timer and resets its progression to 0.
   */
  cancel: () => void;

  /**
   * Reverts the timer to its initial state and removes it from the engine.
   */
  revert: () => void;

  /**
   * Seeks to a specific time or progress.
   * @param time - Time in ms or progress string (e.g., '50%')
   */
  seek: (time: number | string) => void;

  /**
   * Stretches the timer duration.
   * @param duration - New duration in milliseconds
   */
  stretch: (duration: number) => void;

  /**
   * Recalculates the values of the animation.
   */
  refresh: () => void;

  /**
   * Set the playback rate dynamically.
   * @param rate - Speed multiplier (1 = normal, 0.5 = half, 2 = double)
   */
  setPlaybackRate: (rate: number) => void;

  /**
   * Set the frame rate dynamically.
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

  /**
   * Time in ms elapsed between the current and previous frame
   */
  deltaTime: number;

  /**
   * Current iteration time in ms
   */
  iterationCurrentTime: number;

  /**
   * Progress of the current iteration from 0 to 1
   */
  iterationProgress: number;

  /**
   * Current playbackRate multiplier
   */
  speed: number;

  /**
   * Current frameRate of the timer
   */
  fps: number;

  /**
   * Whether the timer is currently playing backwards
   */
  backwards: boolean;
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
  deltaTime: 0,
  iterationCurrentTime: 0,
  iterationProgress: 0,
  speed: 1,
  fps: 0,
  backwards: false,
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
  | object
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
  | "easeInOutBounce"
  | "in-quad"
  | "out-quad"
  | "in-out-quad"
  | "in-cubic"
  | "out-cubic"
  | "in-out-cubic"
  | "in-quart"
  | "out-quart"
  | "in-out-quart"
  | "in-quint"
  | "out-quint"
  | "in-out-quint"
  | "in-sine"
  | "out-sine"
  | "in-out-sine"
  | "in-expo"
  | "out-expo"
  | "in-out-expo"
  | "in-circ"
  | "out-circ"
  | "in-out-circ"
  | "in-back"
  | "out-back"
  | "in-out-back"
  | "in-elastic"
  | "out-elastic"
  | "in-out-elastic"
  | "in-bounce"
  | "out-bounce"
  | "in-out-bounce";

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
export type Easing =
  | EasingName
  | EasingPattern
  | EasingFunction
  | (string & {});

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
