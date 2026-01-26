/**
 * Timer-specific types for useAnimeTimer hook
 */

import type {
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
} from "./common";

// =============================================================================
// Timer Options
// =============================================================================

/**
 * Options for useAnimeTimer hook
 */
export interface UseAnimeTimerOptions
  extends PlaybackSettings, AnimationCallbacks {
  /**
   * Dependencies that should trigger timer re-initialization
   */
  deps?: unknown[];

  /**
   * Whether the timer should be enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useAnimeTimer hook
 */
export interface UseAnimeTimerReturn {
  /**
   * Playback control methods
   */
  controls: PlaybackControls;

  /**
   * Current timer state (reactive)
   */
  state: AnimationState;

  /**
   * Raw timer instance (escape hatch)
   */
  timer: Timer | null;

  /**
   * Whether the timer is currently running
   */
  isRunning: boolean;

  /**
   * Whether the timer is ready
   */
  isReady: boolean;
}

// =============================================================================
// Timer Instance Types (from Anime.js)
// =============================================================================

/**
 * Internal Anime.js Timer type representation
 */
export interface Timer {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  began: boolean;
  completed: boolean;
  reversed: boolean;
  iterationTime: number;
  iterationDuration: number;
  iterationCurrentTime: number;
  iterationProgress: number;
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
  seek(time: number | string): this;
  stretch(duration: number): this;
  then(callback: (timer: this) => void): Promise<this>;
}
