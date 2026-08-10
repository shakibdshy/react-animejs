/**
 * Event-specific types for scroll-driven Anime.js integrations.
 */

import type { RefObject } from "react";
import type {
  ScrollObserver,
  ScrollObserverParams,
  ScrollThresholdParam,
  ScrollThresholdValue,
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
 * A scroll threshold, expressed either as a value or a `{ target, container }`
 * pair. Convenience alias over anime.js' threshold types for the pin engine.
 */
export type ScrollThreshold = ScrollThresholdValue | ScrollThresholdParam;

/**
 * Observer-shaped argument passed to `onEnter`/`onLeave`/`onUpdate`/`onPin`/
 * `onUnpin` while pinned. Mirrors the subset of `ScrollObserver` fields the
 * React wrapper exposes through its wrapped callbacks, so handlers ported from
 * the observer path read the same properties in pin mode.
 */
export interface PinObserverLike {
  /** Stable id for the pinned instance. */
  id: string | number;
  /** 0 → 1 progress across the [start, end] pin range. */
  progress: number;
  /** Raw scroll position driving the pin (window or container). */
  scroll: number;
  /** Pixels scrolled since the previous frame (signed). */
  velocity: number;
  /** True when scrolling upward (toward smaller scroll values). */
  backward: boolean;
  /** True while the element is actively pinned. */
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

/** Options for the framework-agnostic pin engine. */
export interface PinEngineOptions {
  /** Element to pin. */
  target: HTMLElement;
  /** Scroll container; `null`/`undefined` means window/document. */
  container?: HTMLElement | null;
  /** When pinning begins. Default `'top top'` (container top meets target top). */
  start?: ScrollThreshold;
  /** When pinning ends. Default `'top bottom'` (container top meets target bottom). */
  end?: ScrollThreshold;
  /** Reserve layout space while pinned (GSAP `pinSpacing`). Default `true`. */
  pinSpacing?: boolean;
  /** Extra space added below the spacer, in px. Default `0`. */
  endSpacing?: number;
  /** Accept `axis` for API parity with the observer; vertical-only for now. */
  axis?: "y" | "x";
  /** Pre-pin by this many seconds of anticipated scroll on fast forward entry,
   *  smoothing the 1-frame flash where the element jumps before locking.
   *  Forward-only (does not affect reverse/unpin). 0 disables. @default 0 */
  anticipatePin?: number;
  /** Pin positioning strategy. 'auto' detects hostile ancestors (transform/
   *  perspective → sticky; overflow-clip → fixed). 'fixed' = position:fixed +
   *  spacer (the robust default). 'sticky' = wrapper + position:sticky.
   *  @default 'auto' */
  pinType?: "auto" | "fixed" | "sticky";
  /** Fired after every bounds recomputation (resize, manual refresh, or
   *  ResizeObserver-triggered re-capture when invalidateOnRefresh is true). */
  onRefresh?: (state: PinObserverLike) => void;
  /** When true, attaches a ResizeObserver on the target and re-captures its
   *  geometry on size change (dynamic content). Default false to avoid observer
   *  overhead in the common case. @default false */
  invalidateOnRefresh?: boolean;
  /** Link an anime.js animation's playhead to pin progress (GSAP scrub).
   *  `true` or `1` = 1:1 (direct seek each tick); a number in (0,1) = smoothing
   *  factor (lerp toward scroll progress). The `linked` object must expose
   *  `duration: number` and `seek(timeMs): this` (anime.js Timer/JSAnimation). */
  scrub?: boolean | number;
  /** The anime.js instance driven by `scrub`. Duck-typed: needs seek + duration. */
  linked?: { duration: number; seek: (time: number) => unknown } | null;
  /** Snap progress to the nearest point on scroll-end. A number = increment
   *  (e.g. 0.25 → [0, 0.25, 0.5, 0.75, 1]); an array = explicit points. */
  snap?: number | number[];
  /** Duration of the snap settle tween in seconds. @default 0.3 */
  snapDuration?: number;
  /** When true, render in natural flow with no pinning. */
  reducedMotion?: boolean;
  /** Callbacks fired from the engine's own scroll math. */
  onPin?: (instance: PinObserverLike) => void;
  onUnpin?: (instance: PinObserverLike) => void;
  onUpdate?: (instance: PinObserverLike) => void;
}

/** Imperative handle returned by `createPinEngine`. */
export interface PinEngine {
  /** Recompute bounds (call on resize / container change / manual refresh). */
  refresh: () => PinObserverLike;
  /** Tear down: unpin, remove spacer, restore styles, detach listeners. */
  revert: () => void;
  /** Force the element into the pinned state. */
  pin: () => void;
  /** Force the element out of the pinned state. */
  unpin: () => void;
  /** Read-only snapshot of the current observer-like state. */
  getState: () => PinObserverLike;
}

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
  /** True while the element is actively pinned (pin mode only). @default false */
  isPinned: boolean;
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
  onSyncEnter?: (observer: ScrollObserver) => void;
  onSyncLeave?: (observer: ScrollObserver) => void;
  onUpdate?: (observer: ScrollObserver) => void;
  onResize?: (observer: ScrollObserver) => void;
  onSyncComplete?: (observer: ScrollObserver) => void;
}

/**
 * React-friendly options for configuring `onScroll()`.
 * Matches the official Anime.js parameter object while allowing React refs.
 */
export interface UseAnimeScrollTriggerOptions
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
      | "onSyncEnter"
      | "onSyncLeave"
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
   * Lock the element to the viewport across a scroll range (GSAP
   * `ScrollTrigger.create({ pin: true })` equivalent). When truthy, the anime
   * observer is bypassed entirely and the dedicated pin engine drives progress,
   * so the effect survives `overflow`-clipped ancestors that break sticky.
   * @default false
   */
  pin?: boolean;

  /**
   * Pin range start threshold. Default `'top top'` (container top meets target
   * top). Only consulted when `pin` is enabled.
   */
  pinStart?: ScrollThreshold;

  /**
   * Pin range end threshold. Default `'top bottom'` (container top meets target
   * bottom). Only consulted when `pin` is enabled.
   */
  pinEnd?: ScrollThreshold;

  /**
   * Reserve layout space while pinned so downstream content does not jump
   * (GSAP `pinSpacing`). When `false`, subsequent content overlaps the pinned
   * element. Only consulted when `pin` is enabled.
   * @default true
   */
  pinSpacing?: boolean;

  /**
   * Extra trailing space added below the spacer, in px. Useful for pinning a
   * container across more than one viewport of scroll (e.g. stacked cards).
   * Only consulted when `pin` is enabled.
   * @default 0
   */
  endSpacing?: number;

  /**
   * Pre-pin by this many seconds of anticipated scroll on fast forward entry,
   * smoothing the 1-frame flash where the element jumps before locking.
   * Forward-only (does not affect reverse/unpin). Only consulted when `pin`
   * is enabled.
   * @default 0
   */
  anticipatePin?: number;

  /**
   * Pin positioning strategy. 'auto' ancestor-walks at setup (transform/
   * perspective ancestor → sticky; overflow-clip ancestor → fixed; neither →
   * fixed). 'fixed' = position:fixed + spacer. 'sticky' = wrapper +
   * position:sticky. Only consulted when `pin` is enabled.
   * @default 'auto'
   */
  pinType?: "auto" | "fixed" | "sticky";

  /**
   * Fired after every pin bounds recomputation (resize, manual refresh, or
   * ResizeObserver-triggered re-capture when `invalidateOnRefresh` is true).
   * Only consulted when `pin` is enabled.
   */
  onRefresh?: (state: PinObserverLike) => void;

  /**
   * Re-captures target geometry on size change (dynamic content like
   * accordions, lazy images, font swaps). Attaches a `ResizeObserver` on the
   * target. Only consulted when `pin` is enabled.
   * @default false
   */
  invalidateOnRefresh?: boolean;

  /**
   * Link an anime.js animation's playhead to pin progress (GSAP scrub). `true`
   * or `1` = 1:1; a number in (0,1) = smoothing factor. Only consulted when
   * `pin` is enabled; the linked instance is provided via `linked`.
   * @default false
   */
  scrub?: boolean | number;

  /**
   * Snap progress to the nearest point on scroll-end. A number = increment
   * (e.g. 0.25); an array = explicit points. Only consulted when `pin` is
   * enabled.
   */
  snap?: number | number[];

  /**
   * Duration of the snap settle tween in seconds. Only consulted when `snap`
   * is set.
   * @default 0.3
   */
  snapDuration?: number;

  /**
   * Fired once when the element enters the pinned state. Receives the pin
   * engine's observer-shaped instance.
   */
  onPin?: (instance: PinObserverLike) => void;

  /**
   * Fired once when the element leaves the pinned state. Receives the pin
   * engine's observer-shaped instance.
   */
  onUnpin?: (instance: PinObserverLike) => void;
}

/**
 * React-friendly options for `useAnimeOnScroll`.
 */
export interface UseAnimeOnScrollOptions
  extends UseAnimeScrollTriggerOptions {

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

  /**
   * Portal pinned children to `document.body` to escape transformed/perspective
   * ancestors that break `position: fixed`. Only honored by `<AnimeScroll>` at
   * the component layer (the hook ignores it). Subtree re-mounts at body during
   * pin; use `pinType="sticky"` instead if ephemeral DOM state (focus, scroll
   * position) must be preserved. Only consulted when `pin` is enabled.
   * @default false
   */
  pinReparent?: boolean;
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
  /** True while the element is actively pinned (pin mode only). */
  isPinned: boolean;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
}
