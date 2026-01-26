/**
 * Timeline-specific types for useAnimeTimeline hook
 */

import type { RefObject } from "react";
import type {
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  AnimationTarget,
  Easing,
} from "./common";
import type { AnimatableProperties, TweenParameters } from "./animation";

// =============================================================================
// Timeline Entry Types
// =============================================================================

/**
 * Single timeline entry/segment
 */
export interface TimelineEntry
  extends
    Partial<AnimatableProperties>,
    TweenParameters,
    Omit<PlaybackSettings, "autoplay"> {
  /**
   * Target element(s) for this animation segment
   */
  targets: AnimationTarget | RefObject<HTMLElement | SVGElement | null>;

  /**
   * Offset from the previous animation
   * - number: absolute time in ms
   * - '+=100': 100ms after previous ends
   * - '-=100': 100ms before previous ends
   * - string: percentage or label
   */
  offset?: number | string;
}

/**
 * Timeline label for marking positions
 */
export interface TimelineLabel {
  label: string;
  offset?: number | string;
}

/**
 * Timeline child can be an entry or a label
 */
export type TimelineChild = TimelineEntry | TimelineLabel;

// =============================================================================
// Timeline Options
// =============================================================================

/**
 * Timeline defaults that apply to all children
 */
export interface TimelineDefaults extends Omit<PlaybackSettings, "autoplay"> {
  ease?: Easing;
}

/**
 * Options for useAnimeTimeline hook
 */
export interface UseAnimeTimelineOptions
  extends PlaybackSettings, AnimationCallbacks {
  /**
   * Default settings for all timeline children
   */
  defaults?: TimelineDefaults;

  /**
   * Dependencies that should trigger timeline re-initialization
   */
  deps?: unknown[];

  /**
   * Whether the timeline should be enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useAnimeTimeline hook
 */
export interface UseAnimeTimelineReturn {
  /**
   * Playback control methods
   */
  controls: PlaybackControls;

  /**
   * Current timeline state (reactive)
   */
  state: AnimationState;

  /**
   * Raw timeline instance (escape hatch)
   */
  timeline: Timeline | null;

  /**
   * Add a new animation to the timeline dynamically
   */
  add: (entry: TimelineEntry, offset?: number | string) => void;

  /**
   * Add a label to the timeline
   */
  addLabel: (label: string, offset?: number | string) => void;

  /**
   * Whether the timeline is currently playing
   */
  isPlaying: boolean;

  /**
   * Whether the timeline is ready
   */
  isReady: boolean;
}

// =============================================================================
// Timeline Instance Types (from Anime.js)
// =============================================================================

/**
 * Internal Anime.js Timeline type representation
 */
export interface Timeline {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  began: boolean;
  completed: boolean;
  reversed: boolean;
  _currentIteration: number;

  // Methods
  add(
    targets: AnimationTarget,
    parameters: Partial<AnimatableProperties> &
      TweenParameters &
      PlaybackSettings,
    offset?: number | string,
  ): this;
  set(
    targets: AnimationTarget,
    parameters: Partial<AnimatableProperties>,
    offset?: number | string,
  ): this;
  label(name: string, offset?: number | string): this;
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
  then(callback: (timeline: this) => void): Promise<this>;
}
