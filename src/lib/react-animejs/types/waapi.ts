/**
 * WAAPI-specific types for useAnimeWAAPI hook
 */

import type { RefObject } from "react";
import type {
  AnimationCallbacks,
  AnimationState,
  AnimationTargets,
  PlaybackControls,
  PlaybackSettings,
} from "./common";
import type {
  AnimatableProperties,
  StaggerOptions,
  TweenParameters,
} from "./animation";

/**
 * Options for useAnimeWAAPI hook
 */
export type UseAnimeWAAPIOptions = PlaybackSettings &
  AnimationCallbacks<WAAPIAnimation> &
  TweenParameters &
  Partial<AnimatableProperties> & {
    /**
     * External targets to animate (alternative to ref)
     */
    targets?: AnimationTargets;

    /**
     * Delay each target's animation
     */
    stagger?: number | StaggerOptions;

    /**
     * Dependencies that should trigger animation re-initialization
     */
    deps?: unknown[];

    /**
     * Whether the animation should be enabled
     * @default true
     */
    enabled?: boolean;
  };

/**
 * Return type for useAnimeWAAPI hook
 */
export interface UseAnimeWAAPIReturn<
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
   * Raw WAAPI animation instance
   */
  animation: WAAPIAnimation | null;

  /**
   * Whether the animation is currently playing
   */
  isPlaying: boolean;

  /**
   * Whether the animation is ready
   */
  isReady: boolean;
}

/**
 * Internal Anime.js WAAPIAnimation type representation
 */
export interface WAAPIAnimation {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  began: boolean;
  completed: boolean;
  reversed: boolean;
  persist: boolean;
  targets: (HTMLElement | SVGElement)[];
  animations: Animation[];
  controlAnimation: Animation;

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
  seek(time: number | string, muteCallbacks?: boolean): this;
  stretch(duration: number): this;
  forEach(callback: (animation: Animation) => void): this;
  then(callback?: (anim: this & { then: null }) => void): Promise<this>;
}

/**
 * Converts an easing function into a valid CSS linear() timing function string
 */
export type ConvertEase = (fn: (...args: any[]) => number, samples?: number) => string;
