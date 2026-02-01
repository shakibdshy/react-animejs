/**
 * Timeline-specific types for useAnimeTimeline hook
 */

import type {
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  AnimationTargets,
  Easing,
} from "./common";
import type { AnimatableProperties, TweenParameters } from "./animation";
import type { UseAnimeTimerOptions } from "./timer";

// =============================================================================
// Timeline Entry Types
// =============================================================================

/**
 * Single timeline animation segment
 */
export interface TimelineAnimationEntry
  extends
    Partial<AnimatableProperties>,
    TweenParameters,
    Omit<PlaybackSettings, "autoplay"> {
  /**
   * Target element(s) for this animation segment
   */
  targets: AnimationTargets;

  /**
   * Position in the timeline
   * - number: absolute time in ms
   * - '+=100': 100ms after previous ends
   * - '-=100': 100ms before previous ends
   * - '<': start of previous
   * - '>': end of previous
   * - string: percentage or label
   */
  position?: number | string;
}

/**
 * Timeline timer segment
 */
export interface TimelineTimerEntry extends UseAnimeTimerOptions {
  /**
   * Position in the timeline
   */
  position?: number | string;
}

/**
 * Timeline function call
 */
export interface TimelineCallEntry {
  /**
   * Function to call
   */
  callback: (tl: Timeline) => void;

  /**
   * Position in the timeline
   */
  position?: number | string;
}

/**
 * Timeline sync entry
 */
export interface TimelineSyncEntry {
  /**
   * Timeline or WAAPI animation to sync
   */
  target: Timeline | unknown;

  /**
   * Position in the timeline
   */
  position?: number | string;
}

/**
 * All possible timeline entries
 */
export type TimelineEntry =
  | TimelineAnimationEntry
  | TimelineTimerEntry
  | TimelineCallEntry
  | TimelineSyncEntry
  | TimelineLabel;

/**
 * Timeline label for marking positions
 */
export interface TimelineLabel {
  label: string;
  position?: number | string;
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
export type TimelineDefaults = Omit<PlaybackSettings, "autoplay"> &
  Partial<AnimatableProperties> & {
    ease?: Easing;
  };

/**
 * Options for useAnimeTimeline hook
 */
export type UseAnimeTimelineOptions = PlaybackSettings &
  AnimationCallbacks<Timeline> & {
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
  };

/**
 * Timeline-specific control methods
 */
export interface TimelineControls extends PlaybackControls {
  /**
   * Add a new animation to the timeline
   */
  add: (entry: TimelineEntry, position?: number | string) => void;

  /**
   * Sync another timeline or WAAPI animation
   */
  sync: (target: Timeline | unknown, position?: number | string) => void;

  /**
   * Call a function at a specific position
   */
  call: (callback: (tl: Timeline) => void, position?: number | string) => void;

  /**
   * Add a label to the timeline
   */
  label: (name: string, position?: number | string) => void;

  /**
   * Set values of targets at a specific position
   */
  set: (
    targets: AnimationTargets,
    parameters: Partial<AnimatableProperties>,
    position?: number | string,
  ) => void;

  /**
   * Remove targets or instances from the timeline
   */
  remove: (
    targetsOrInstance: AnimationTargets | Timeline | unknown,
    propertyOrPosition?: string | number,
  ) => void;

  /**
   * Initialize/Render the timeline state immediately
   */
  init: () => void;
}

/**
 * Return type for useAnimeTimeline hook
 */
export interface UseAnimeTimelineReturn {
  /**
   * Timeline-specific playback control methods
   */
  controls: TimelineControls;

  /**
   * Current timeline state (reactive)
   */
  state: AnimationState;

  /**
   * Raw timeline instance (escape hatch)
   */
  timeline: Timeline | null;

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
  persist: boolean;
  _currentIteration: number;

  // Methods
  add(
    targets: AnimationTargets,
    parameters: Partial<AnimatableProperties> &
      TweenParameters &
      PlaybackSettings,
    position?: number | string,
  ): this;
  add(parameters: UseAnimeTimerOptions, position?: number | string): this;
  set(
    targets: AnimationTargets,
    parameters: Partial<AnimatableProperties>,
    position?: number | string,
  ): this;
  remove(
    targetsOrInstance: AnimationTargets | Timeline | unknown,
    propertyOrPosition?: string | number,
  ): this;
  sync(timeline: Timeline | unknown, position?: number | string): this;
  call(callback: (tl: Timeline) => void, position?: number | string): this;
  label(name: string, position?: number | string): this;
  init(): this;
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
  then(callback: (timeline: this) => void): Promise<this>;
}
