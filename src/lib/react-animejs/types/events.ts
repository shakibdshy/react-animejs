/**
 * Event-specific types for scroll-driven Anime.js integrations.
 */

import type { RefObject } from "react";
import type {
  ScrollObserver,
  ScrollObserverParams,
  Tickable,
  WAAPIAnimation,
} from "animejs";
import type { AnimationTarget } from "./common";
import type { JSAnimation } from "./animation";
import type { Timer } from "./timer";
import type { Timeline } from "./timeline";

export type {
  ScrollObserver,
  ScrollObserverParams,
  ScrollThresholdCallback,
  ScrollThresholdParam,
  ScrollThresholdValue,
} from "animejs";

/**
 * Scroll-linked instance types supported by Anime.js.
 */
export type ScrollLinkedInstance =
  | JSAnimation
  | Timer
  | Timeline
  | Tickable
  | WAAPIAnimation
  | null;

/**
 * React-friendly linked target type.
 */
export type ScrollLinkedTarget =
  | ScrollLinkedInstance
  | RefObject<ScrollLinkedInstance>;

/**
 * Reactive observer state exposed by the hook.
 */
export interface ScrollObserverState {
  id: string | number;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
  isInView: boolean;
  ready: boolean;
  began: boolean;
  completed: boolean;
  reverted: boolean;
  offset: number;
  offsetStart: number;
  offsetEnd: number;
  distance: number;
}

/**
 * Callback set supported by the React wrapper.
 */
export interface ScrollObserverCallbacks {
  onEnter?: (observer: ScrollObserver) => void;
  onLeave?: (observer: ScrollObserver) => void;
  onEnterForward?: (observer: ScrollObserver) => void;
  onLeaveForward?: (observer: ScrollObserver) => void;
  onEnterBackward?: (observer: ScrollObserver) => void;
  onLeaveBackward?: (observer: ScrollObserver) => void;
  onUpdate?: (observer: ScrollObserver) => void;
  onResize?: (observer: ScrollObserver) => void;
  onSyncComplete?: (observer: ScrollObserver) => void;
}

/**
 * React-friendly options for `useAnimeOnScroll`.
 */
export interface UseAnimeOnScrollOptions
  extends Omit<
      ScrollObserverParams,
      | "container"
      | "target"
      | "onEnter"
      | "onLeave"
      | "onEnterForward"
      | "onLeaveForward"
      | "onEnterBackward"
      | "onLeaveBackward"
      | "onUpdate"
      | "onResize"
      | "onSyncComplete"
    >,
    ScrollObserverCallbacks {
  /**
   * Optional scroll container target. If omitted, Anime.js uses the window.
   */
  container?: AnimationTarget;

  /**
   * Optional observed element target. If omitted, use the returned `ref`,
   * or let Anime.js infer the target from a linked animation.
   */
  target?: AnimationTarget;

  /**
   * Optional animation/timer/timeline/WAAPI instance to link.
   */
  linked?: ScrollLinkedTarget;

  /**
   * Additional dependencies that should recreate the observer.
   */
  deps?: unknown[];

  /**
   * Whether the observer should be created.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Imperative controls returned by `useAnimeOnScroll`.
 */
export interface UseAnimeOnScrollControls {
  refresh: () => ScrollObserver | null;
  revert: () => void;
  link: (linked: ScrollLinkedTarget) => ScrollObserver | null;
}

/**
 * Return value for the scroll observer hook.
 */
export interface UseAnimeOnScrollReturn<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> {
  ref: RefObject<T | null>;
  targetRef: RefObject<T | null>;
  containerRef: RefObject<C | null>;
  controls: UseAnimeOnScrollControls;
  observer: ScrollObserver | null;
  state: ScrollObserverState;
  isReady: boolean;
  isInView: boolean;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
}
