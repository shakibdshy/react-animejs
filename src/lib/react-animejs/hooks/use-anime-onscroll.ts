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
  createSafeCallback,
  resolveTarget,
  safeJsonStringify,
  useScopeContext,
} from "../core";

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
};

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
    enabled = true,
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

  // Keep prop-driven and imperative linking separate so a manual `controls.link()`
  // survives observer recreation unless the caller provides a new controlled link.
  const resolvedPropLinked = resolveLinkedInstance(linked);
  const [imperativeLinked, setImperativeLinked] =
    useState<ScrollLinkedInstance>(null);
  const linkedInstance = resolvedPropLinked ?? imperativeLinked;

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
    if (!enabled) {
      observerRef.current?.revert();
      observerRef.current = null;
      syncObserverState(null);
      setIsReady(false);
      return;
    }

    const resolvedTarget = target
      ? normalizeSingleElement(resolveTarget(target, scopeContext.rootRef.current))
      : targetRef.current;

    const resolvedContainer = container
      ? normalizeSingleElement(resolveTarget(container, scopeContext.rootRef.current))
      : containerRef.current;

    if (!resolvedTarget && !controlledLinkedReady && !imperativeLinked) {
      return;
    }

    try {
      const config = {
        id,
        sync,
        container: resolvedContainer ?? undefined,
        target: resolvedTarget ?? undefined,
        axis,
        enter,
        leave,
        repeat,
        debug,
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

      if (linkedInstance) {
        observer.link(toAnimeScrollLinked(linkedInstance)!);
      }

      observer.refresh();

      syncObserverState(observer);
      setIsReady(true);

      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          try {
            observer.revert();
          } catch {}
        });
      }

      return () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, resolvedPropLinked, configJson, scopeContext, ...deps]);

  useEffect(() => {
    if (!observerRef.current || !linkedInstance) return;

    observerRef.current.link(toAnimeScrollLinked(linkedInstance)!);
    syncObserverState(observerRef.current);
  }, [linkedInstance, syncObserverState]);

  const controls = useMemo(
    () => ({
      refresh: () => {
        if (!observerRef.current) return null;
        observerRef.current.refresh();
        syncObserverState(observerRef.current);
        return observerRef.current;
      },
      revert: () => {
        try {
          observerRef.current?.revert();
        } catch {}
        observerRef.current = null;
        syncObserverState(null);
        setIsReady(false);
      },
      link: (value: ScrollLinkedTarget) => {
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
    progress: state.progress,
    scroll: state.scroll,
    velocity: state.velocity,
    backward: state.backward,
  };
}

export default useAnimeOnScroll;
