/**
 * Scroll-pinning types for the local `@/lib/pin` superset module.
 *
 * Phase 1: lives in demo-docs because this project consumes the published
 * `@shakibdshy/react-animejs` from the npm registry, not a workspace link.
 * Phase 2 ports these (plus the pin engine) into `react-animejs-package` and
 * folds `pin` directly into the real `useAnimeOnScroll` / `<AnimeScroll>`.
 *
 * Design rule: pin mode reuses the published `ScrollObserverState` /
 * `UseAnimeOnScrollReturn` contract so user code written for the observer
 * path keeps working. Pin-specific fields are layered on top.
 */

import type {
  ScrollLinkedTarget,
  ScrollObserver,
  ScrollObserverState,
  ScrollThresholdParam,
  ScrollThresholdValue,
  UseAnimeOnScrollOptions,
} from '@shakibdshy/react-animejs';
import type { ReactElement, ReactNode, RefAttributes, RefObject } from 'react';

/** Re-export so consumers can import thresholds from one place. */
export type ScrollThreshold = ScrollThresholdValue | ScrollThresholdParam;

/**
 * Observer-shaped argument passed to `onEnter/onLeave/onUpdate/onPin/onUnpin`
 * while pinned. Mirrors the subset of `ScrollObserver` fields that the
 * published `useAnimeOnScroll` exposes through its wrapped callbacks, so user
 * handlers ported from the observer path read the same properties.
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
  /** When pinning begins. Default `'top top'` (target top meets viewport top). */
  start?: ScrollThreshold;
  /** When pinning ends. Default `'top bottom'` (container top meets target bottom). */
  end?: ScrollThreshold;
  /** Reserve layout space while pinned (GSAP `pinSpacing`). Default `true`. */
  pinSpacing?: boolean;
  /** Extra space added below the spacer, in px. Default `0`. */
  endSpacing?: number;
  /** Accept `axis` for API parity with the observer; vertical-only for now. */
  axis?: 'y' | 'x';
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
 * `useAnimeOnScroll` options extended with pin fields.
 *
 * The published `UseAnimeOnScrollOptions` is not generic (its generics live on
 * the hook function), so this superset is non-generic too. `start` / `end`
 * are pin-specific threshold names; in non-pin mode the observer is driven by
 * the inherited `enter` / `leave` fields as usual.
 */
export interface UseAnimeScrollPinOptions extends UseAnimeOnScrollOptions {
  /** Pin range start. Default `'top top'` (container top meets target top). */
  start?: ScrollThreshold;
  /** Pin range end. Default `'top bottom'` (container top meets target bottom). */
  end?: ScrollThreshold;
  /** Enable pin mode. When truthy, the anime observer is bypassed entirely. */
  pin?: boolean;
  /** Reserve layout space while pinned (GSAP `pinSpacing`). Default `true`. */
  pinSpacing?: boolean;
  /** Extra trailing space inside the pin range, in px. */
  endSpacing?: number;
  /** Fired once when the element enters the pinned state. */
  onPin?: (instance: PinObserverLike) => void;
  /** Fired once when the element leaves the pinned state. */
  onUnpin?: (instance: PinObserverLike) => void;
}

/** The pin engine's published state, layered onto the observer state. */
export interface PinState extends ScrollObserverState {
  /** True while the element is actively pinned. */
  isPinned: boolean;
}

/**
 * Controls for the pin-enabled hook. `link()` is a no-op in pin mode (there is
 * no observer to link to) and returns null, matching the published contract
 * where `link` yields null when there is no observer.
 */
export interface UseAnimeScrollPinControls {
  refresh: () => PinObserverLike | null;
  revert: () => void;
  pin: () => void;
  unpin: () => void;
  link: (linked: ScrollLinkedTarget) => ScrollObserver | null;
}

/** Return value of `useAnimeOnScrollPin`. */
export interface UseAnimeScrollPinReturn<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> {
  ref: RefObject<T | null>;
  targetRef: RefObject<T | null>;
  containerRef: RefObject<C | null>;
  controls: UseAnimeScrollPinControls;
  observer: ScrollObserver | null;
  state: PinState;
  isReady: boolean;
  isInView: boolean;
  isPinned: boolean;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
}

/** The ref API exposed by `<AnimeScrollPin>`. */
export interface AnimeScrollPinRef<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> {
  ref: RefObject<T | null>;
  targetRef: RefObject<T | null>;
  containerRef: RefObject<C | null>;
  controls: UseAnimeScrollPinControls;
  state: PinState;
  observer: ScrollObserver | null;
  isReady: boolean;
  isInView: boolean;
  isPinned: boolean;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
  getObserver: () => ScrollObserver | null;
}

export interface AnimeScrollPinProps<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> extends UseAnimeScrollPinOptions {
  /** The single element to observe/pin. */
  children?: ReactNode | ((api: AnimeScrollPinRef<T, C>) => ReactNode);
  className?: string;
  onReady?: (api: AnimeScrollPinRef<T, C>) => void;
  onStateChange?: (state: PinState) => void;
  onControlsReady?: (controls: UseAnimeScrollPinControls) => void;
}

/** Re-exported so consumers don't need a second import for the observer type. */
export type { RefAttributes, ReactElement };
