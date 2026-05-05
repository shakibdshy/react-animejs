import type { RefObject } from "react";
import type { ScrambleTextParams } from "animejs";
import type { Easing, PlaybackControls } from "./common";
import type { JSAnimation } from "./animation";

export type { ScrambleTextParams };

export interface UseAnimeScrambleOptions {
  /**
   * Ref to the target element containing text
   */
  target: RefObject<Element | null>;

  /**
   * ScrambleText parameters
   */
  params?: ScrambleTextParams;

  /**
   * Animation duration in milliseconds.
   * If set, overrides ScrambleTextParams.duration.
   * @default undefined (uses scrambleText's computed duration)
   */
  duration?: number;

  /**
   * Animation delay in milliseconds
   * @default 0
   */
  delay?: number;

  /**
   * Easing function for the animation
   * @default 'outQuad'
   */
  ease?: Easing;

  /**
   * Whether to autoplay the animation
   * @default true
   */
  autoplay?: boolean;

  /**
   * Number of times to loop
   * @default false
   */
  loop?: boolean | number;

  /**
   * Whether to scramble on mount
   * @default true
   */
  scrambleOnMount?: boolean;

  /**
   * Dependencies to trigger re-scramble when they change
   * Similar to useEffect dependencies
   */
  deps?: unknown[];

  /**
   * Callback when animation is ready
   */
  onReady?: (animation: JSAnimation) => void;

  /**
   * Callback when animation begins
   */
  onBegin?: (anim: JSAnimation) => void;

  /**
   * Callback when animation completes
   */
  onComplete?: (anim: JSAnimation) => void;

  /**
   * Callback on each animation update
   */
  onUpdate?: (anim: JSAnimation) => void;
}

export interface UseAnimeScrambleReturn {
  /**
   * Ref to attach to the target element
   */
  ref: RefObject<Element | null>;

  /**
   * The JSAnimation instance
   */
  animation: JSAnimation | null;

  /**
   * Whether the scramble animation is ready
   */
  isReady: boolean;

  /**
   * Whether the animation is currently playing
   */
  isPlaying: boolean;

  /**
   * Playback control methods
   */
  controls: PlaybackControls;

  /**
   * Re-run the scrambleText animation
   */
  rescramble: () => void;

  /**
   * Revert to original text and clean up
   */
  revert: () => void;
}
