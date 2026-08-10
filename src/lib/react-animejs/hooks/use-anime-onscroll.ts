/**
 * useAnimeOnScroll - React hook for Anime.js ScrollObserver events.
 *
 * Provides a React-friendly wrapper around `onScroll()` with:
 * - Ref-based target/container resolution
 * - Optional linking to animations, timers, timelines, and WAAPI instances
 * - Reactive observer state
 * - Automatic cleanup on unmount and scoped cleanup support
 *
 * Prefer `useAnime({ autoplay: { ...scrollObserverParams } })` when you only
 * need to drive a single animation with the official Anime.js autoplay API.
 * Use this hook when you need standalone observer state, imperative observer
 * controls, or observer callbacks without coupling them to one animation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onScroll } from "animejs";
import type {
  ScrollObserver,
  ScrollObserverParams,
  Tickable,
  WAAPIAnimation,
} from "animejs";
import type {
  ScrollLinkedInstance,
  ScrollLinkedTarget,
  ScrollObserverState,
  UseAnimeOnScrollOptions,
  UseAnimeOnScrollReturn,
} from "../types";
import {
  cleanUndefinedValues,
  createPinEngine,
  createSafeCallback,
  resolveTarget,
  safeJsonStringify,
  useScopeContext,
} from "../core";
import { useDependencySignal } from './use-dependency-signal';
import type {
  PinEngine,
  PinObserverLike,
  ScrollThreshold,
} from "../types";

const DEFAULT_SCROLL_OBSERVER_STATE: ScrollObserverState = {
  id: "",
  progress: 0,
  scroll: 0,
  velocity: 0,
  backward: false,
  isInView: false,
  ready: false,
  began: false,
  completed: false,
  reverted: false,
  offset: 0,
  offsetStart: 0,
  offsetEnd: 0,
  distance: 0,
  isPinned: false,
};

/**
 * Convert a pin engine snapshot into the hook's reactive observer state.
 * Mirrors the observer's state shape so consumers ported from the observer
 * path read the same fields in pin mode.
 */
function pinStateToObserverState(snap: PinObserverLike): ScrollObserverState {
  return {
    id: snap.id,
    progress: snap.progress,
    scroll: snap.scroll,
    velocity: snap.velocity,
    backward: snap.backward,
    isInView: snap.isInView,
    ready: snap.ready,
    began: snap.began,
    completed: snap.completed,
    reverted: snap.reverted,
    offset: snap.offset,
    offsetStart: snap.offsetStart,
    offsetEnd: snap.offsetEnd,
    distance: snap.distance,
    isPinned: snap.isInView,
  };
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveLinkedInstance(
  linked: ScrollLinkedTarget | undefined,
): ScrollLinkedInstance {
  if (!linked) return null;

  // Handle React ref objects: { current: value }
  if (
    typeof linked === "object" &&
    "current" in linked &&
    !("targets" in linked) &&
    !("duration" in linked)
  ) {
    return (linked as { current?: ScrollLinkedInstance }).current ?? null;
  }

  return linked as ScrollLinkedInstance;
}

function toAnimeScrollLinked(
  linked: ScrollLinkedInstance,
): Tickable | WAAPIAnimation | null {
  return linked as unknown as Tickable | WAAPIAnimation | null;
}

function normalizeSingleElement(
  target:
    | HTMLElement
    | SVGElement
    | NodeList
    | (HTMLElement | SVGElement)[]
    | null,
): HTMLElement | SVGElement | null {
  if (!target) return null;

  if (Array.isArray(target)) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  if (typeof NodeList !== "undefined" && target instanceof NodeList) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  return target as HTMLElement | SVGElement;
}

function extractScrollObserverState(
  observer: ScrollObserver | null,
): ScrollObserverState {
  if (!observer) {
    return DEFAULT_SCROLL_OBSERVER_STATE;
  }

  return {
    id: observer.id ?? "",
    progress: observer.progress ?? 0,
    scroll: observer.scroll ?? 0,
    velocity: observer.velocity ?? 0,
    backward: observer.backward ?? false,
    isInView: observer.isInView ?? false,
    ready: observer.ready ?? false,
    began: observer.began ?? false,
    completed: observer.completed ?? false,
    reverted: observer.reverted ?? false,
    offset: observer.offset ?? 0,
    offsetStart: observer.offsetStart ?? 0,
    offsetEnd: observer.offsetEnd ?? 0,
    distance: observer.distance ?? 0,
    // The observer path never pins.
    isPinned: false,
  };
}

export function useAnimeOnScroll<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(options: UseAnimeOnScrollOptions = {}): UseAnimeOnScrollReturn<T, C> {
  const targetRef = useRef<T | null>(null);
  const containerRef = useRef<C | null>(null);
  const observerRef = useRef<ScrollObserver | null>(null);

  const scopeContext = useScopeContext();
  const { rootRef: scopeRootRef, isScoped, registerCleanup } = scopeContext;

  const [state, setState] = useState<ScrollObserverState>(
    DEFAULT_SCROLL_OBSERVER_STATE,
  );
  const [isReady, setIsReady] = useState(false);

  const {
    id,
    sync,
    container,
    target,
    axis,
    enter,
    leave,
    repeat,
    debug,
    linked,
    deps = [],
    // Pin-mode options (no-op unless `pin` is true).
    pin = false,
    pinStart,
    pinEnd,
    pinSpacing = true,
    endSpacing = 0,
    anticipatePin = 0,
    pinType = "auto",
    invalidateOnRefresh = false,
    scrub = false,
    snap,
    snapDuration = 0.3,
    onPin,
    onUnpin,
    onRefresh,
    onEnter,
    onLeave,
    onEnterForward,
    onLeaveForward,
    onEnterBackward,
    onLeaveBackward,
    onSyncEnter,
    onSyncLeave,
    onUpdate,
    onResize,
    onSyncComplete,
  } = options;

  const depsSignal = useDependencySignal(deps);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const callbackRefs = useRef({
    onEnter,
    onLeave,
    onEnterForward,
    onLeaveForward,
    onEnterBackward,
    onLeaveBackward,
    onSyncEnter,
    onSyncLeave,
    onUpdate,
    onResize,
    onSyncComplete,
  });
  callbackRefs.current = {
    onEnter,
    onLeave,
    onEnterForward,
    onLeaveForward,
    onEnterBackward,
    onLeaveBackward,
    onSyncEnter,
    onSyncLeave,
    onUpdate,
    onResize,
    onSyncComplete,
  };

  // Pin callbacks are read through a ref so the engine isn't rebuilt when they
  // change identity (matches the observer-callback pattern above).
  const pinCallbacksRef = useRef({ onPin, onUnpin, onEnter, onLeave, onUpdate, onRefresh });
  pinCallbacksRef.current = { onPin, onUnpin, onEnter, onLeave, onUpdate, onRefresh };

  // Stable signature so the pin effect re-runs only on meaningful change.
  const pinConfigJson = useMemo(
    () =>
      safeJsonStringify({
        pin,
        pinSpacing,
        endSpacing,
        pinStart,
        pinEnd,
        axis,
        anticipatePin,
        pinType,
        invalidateOnRefresh,
        scrub,
        snap,
        snapDuration,
      }),
      [
        pin,
        pinSpacing,
        endSpacing,
        pinStart,
        pinEnd,
        axis,
        anticipatePin,
        pinType,
        invalidateOnRefresh,
        scrub,
        snap,
        snapDuration,
      ],
  );

  const engineRef = useRef<PinEngine | null>(null);

  // Keep prop-driven and imperative linking separate so a manual `controls.link()`
  // survives observer recreation unless the caller provides a new controlled link.
  const resolvedPropLinked = resolveLinkedInstance(linked);
  const [imperativeLinked, setImperativeLinked] =
    useState<ScrollLinkedInstance>(null);
  const linkedInstance = resolvedPropLinked ?? imperativeLinked;
  const linkedInstanceRef = useRef(linkedInstance);
  linkedInstanceRef.current = linkedInstance;

  const controlledLinkedReady = Boolean(resolvedPropLinked);

  const configJson = useMemo(
    () =>
      safeJsonStringify({
        id,
        sync,
        container,
        target,
        axis,
        enter,
        leave,
        repeat,
        debug,
      }),
    [id, sync, container, target, axis, enter, leave, repeat, debug],
  );

  const syncObserverState = useCallback((observer: ScrollObserver | null) => {
    setState(extractScrollObserverState(observer));
  }, []);

  const createWrappedCallback = useCallback(
    (
      key:
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
        | "onSyncComplete",
    ) => {
      return (observer: ScrollObserver) => {
        syncObserverState(observer);
        createSafeCallback(callbackRefs.current[key], key)?.(observer);
      };
    },
    [syncObserverState],
  );

  useEffect(() => {
    let unregisterScopedCleanup: (() => void) | undefined;
    const currentOptions = optionsRef.current;
    const {
      id: currentId,
      sync: currentSync,
      container: currentContainer,
      target: currentTarget,
      axis: currentAxis,
      enter: currentEnter,
      leave: currentLeave,
      repeat: currentRepeat,
      debug: currentDebug,
      enabled: currentEnabled = true,
      pin: currentPin = false,
    } = currentOptions;

    // Pin mode owns its own engine and never creates an anime observer, so
    // skip this effect entirely when pin is enabled (handled below).
    if (currentPin) {
      return;
    }

    if (!currentEnabled) {
      observerRef.current?.revert();
      observerRef.current = null;
      syncObserverState(null);
      setIsReady(false);
      return;
    }

    const resolvedTarget = currentTarget
      ? normalizeSingleElement(resolveTarget(currentTarget, scopeRootRef.current))
      : targetRef.current;

    const resolvedContainer = currentContainer
      ? normalizeSingleElement(resolveTarget(currentContainer, scopeRootRef.current))
      : containerRef.current;

    if (
      !resolvedTarget &&
      !controlledLinkedReady &&
      !linkedInstanceRef.current
    ) {
      return;
    }

    try {
      const config = {
        id: currentId,
        sync: currentSync,
        container: resolvedContainer ?? undefined,
        target: resolvedTarget ?? undefined,
        axis: currentAxis,
        enter: currentEnter,
        leave: currentLeave,
        repeat: currentRepeat,
        debug: currentDebug,
        onEnter: createWrappedCallback("onEnter"),
        onLeave: createWrappedCallback("onLeave"),
        onEnterForward: createWrappedCallback("onEnterForward"),
        onLeaveForward: createWrappedCallback("onLeaveForward"),
        onEnterBackward: createWrappedCallback("onEnterBackward"),
        onLeaveBackward: createWrappedCallback("onLeaveBackward"),
        onSyncEnter: createWrappedCallback("onSyncEnter"),
        onSyncLeave: createWrappedCallback("onSyncLeave"),
        onUpdate: createWrappedCallback("onUpdate"),
        onResize: createWrappedCallback("onResize"),
        onSyncComplete: createWrappedCallback("onSyncComplete"),
      } as ScrollObserverParams & Record<string, unknown>;

      cleanUndefinedValues(config);

      const observer = onScroll(config as ScrollObserverParams);
      observerRef.current = observer;

      const currentLinkedInstance = linkedInstanceRef.current;
      if (currentLinkedInstance) {
        observer.link(toAnimeScrollLinked(currentLinkedInstance)!);
      }

      observer.refresh();

      syncObserverState(observer);
      setIsReady(true);

      if (isScoped) {
        unregisterScopedCleanup = registerCleanup(() => {
          try {
            observer.revert();
          } catch {}
        });
      }

      return () => {
        unregisterScopedCleanup?.();
        try {
          observer.revert();
        } catch {}

        if (observerRef.current === observer) {
          observerRef.current = null;
        }

        syncObserverState(null);
        setIsReady(false);
      };
    } catch (error) {
      console.error("[react-animejs] ScrollObserver creation error:", error);
      observerRef.current = null;
      syncObserverState(null);
      setIsReady(false);
    }
  }, [
    resolvedPropLinked,
    configJson,
    scopeRootRef,
    isScoped,
    registerCleanup,
    controlledLinkedReady,
    depsSignal,
    createWrappedCallback,
    syncObserverState,
  ]);

  useEffect(() => {
    if (!observerRef.current || !linkedInstance) return;

    observerRef.current.link(toAnimeScrollLinked(linkedInstance)!);
    syncObserverState(observerRef.current);
  }, [linkedInstance, syncObserverState]);

  // ----- Pin mode -----
  // When `pin` is enabled, bypass the anime observer entirely and run the pin
  // engine. The engine synthesizes an observer-shaped argument for the same
  // callbacks so user handlers ported from the observer path keep working.
  // Because no observer is created, the null-target getBoundingClientRect bug
  // is structurally impossible in pin mode.
  useEffect(() => {
    if (!pin) return;

    const currentOptions = optionsRef.current;
    const { enabled: currentEnabled = true } = currentOptions;

    if (!currentEnabled) {
      engineRef.current?.revert();
      engineRef.current = null;
      setState(DEFAULT_SCROLL_OBSERVER_STATE);
      setIsReady(false);
      return;
    }

    const resolvedTarget = targetRef.current;
    if (!resolvedTarget) return;

    // Resolve the container via the same helpers the observer path uses so
    // refs / selectors / elements all work. The engine must never receive a
    // non-element (e.g. a raw ref object), or addEventListener throws.
    const resolvedContainer = container
      ? (normalizeSingleElement(
          resolveTarget(container, scopeRootRef.current),
        ) as HTMLElement | null)
      : (normalizeSingleElement(
          resolveTarget(containerRef.current as unknown as HTMLElement, scopeRootRef.current),
        ) as HTMLElement | null);

    const reducedMotion = prefersReducedMotion();
    // Coerce the rich axis option (which may be a callback) to the plain form
    // the engine understands.
    const plainAxis: "y" | "x" | undefined =
      axis === "x" || axis === "y" ? axis : undefined;

    const engine = createPinEngine({
      target: resolvedTarget as HTMLElement,
      container: resolvedContainer ?? null,
      start: pinStart as ScrollThreshold | undefined,
      end: pinEnd as ScrollThreshold | undefined,
      pinSpacing,
      endSpacing,
      axis: plainAxis,
      anticipatePin,
      pinType,
      invalidateOnRefresh,
      scrub,
      linked: (resolveLinkedInstance(linkedInstance) ?? null) as any,
      snap,
      snapDuration,
      reducedMotion,
      onPin: (instance) => {
        setState(pinStateToObserverState(instance));
        pinCallbacksRef.current.onPin?.(instance);
      },
      onUnpin: (instance) => {
        setState(pinStateToObserverState(instance));
        pinCallbacksRef.current.onUnpin?.(instance);
      },
      onRefresh: (instance) => {
        pinCallbacksRef.current.onRefresh?.(instance);
      },
      onUpdate: (instance) => {
        setState(pinStateToObserverState(instance));
        // Mirror the observer's enter/leave semantics: onEnter when crossing
        // into the pinned range, onLeave when crossing out. The instance is
        // observer-shaped, so cast to the observer type the callbacks expect.
        const asObserver = instance as unknown as ScrollObserver;
        if (instance.isInView) {
          pinCallbacksRef.current.onEnter?.(asObserver);
        } else {
          pinCallbacksRef.current.onLeave?.(asObserver);
        }
        pinCallbacksRef.current.onUpdate?.(asObserver);
      },
    });

    engineRef.current = engine;
    const initial = engine.getState();
    setState(pinStateToObserverState(initial));
    setIsReady(true);

    let unregisterScopedCleanup: (() => void) | undefined;
    if (isScoped) {
      unregisterScopedCleanup = registerCleanup(() => {
        try {
          engine.revert();
        } catch {}
      });
    }

    return () => {
      unregisterScopedCleanup?.();
      try {
        engine.revert();
      } catch {}
      if (engineRef.current === engine) engineRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, pinConfigJson, scopeRootRef, isScoped, registerCleanup, depsSignal]);

  const controls = useMemo(
    () => ({
      refresh: () => {
        // Pin mode: delegate to the engine.
        if (engineRef.current) {
          const snap = engineRef.current.refresh();
          setState(pinStateToObserverState(snap));
          return null;
        }
        if (!observerRef.current) return null;
        observerRef.current.refresh();
        syncObserverState(observerRef.current);
        return observerRef.current;
      },
      revert: () => {
        if (engineRef.current) {
          try {
            engineRef.current.revert();
          } catch {}
          engineRef.current = null;
          setState(DEFAULT_SCROLL_OBSERVER_STATE);
          setIsReady(false);
          return;
        }
        try {
          observerRef.current?.revert();
        } catch {}
        observerRef.current = null;
        syncObserverState(null);
        setIsReady(false);
      },
      link: (value: ScrollLinkedTarget) => {
        // Pin mode has no observer to link to.
        if (engineRef.current) return null;
        const resolvedLinked = resolveLinkedInstance(value);

        if (!observerRef.current || !resolvedLinked) return null;

        setImperativeLinked(resolvedLinked);
        observerRef.current.link(toAnimeScrollLinked(resolvedLinked)!);
        syncObserverState(observerRef.current);
        return observerRef.current;
      },
    }),
    [syncObserverState],
  );

  return {
    ref: targetRef,
    targetRef,
    containerRef,
    controls,
    observer: observerRef.current,
    state,
    isReady,
    isInView: state.isInView,
    isPinned: state.isPinned,
    progress: state.progress,
    scroll: state.scroll,
    velocity: state.velocity,
    backward: state.backward,
  };
}

export default useAnimeOnScroll;
