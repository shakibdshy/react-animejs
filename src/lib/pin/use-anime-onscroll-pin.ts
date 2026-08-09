/**
 * useAnimeOnScrollPin - local superset of the published `useAnimeOnScroll`.
 *
 * Adds a `pin` option. When `pin` is falsy, this delegates entirely to the
 * published `useAnimeOnScroll` (zero behaviour change for existing demos).
 * When `pin` is truthy, it bypasses the anime observer and runs the pin
 * engine, which synthesizes an observer-shaped argument for the same
 * callbacks so user code ported from the observer path keeps working.
 *
 * Why bypass the observer in pin mode:
 * The published `useAnimeOnScroll` instantiates `animejs.onScroll()` and
 * synchronously calls `observer.refresh()`; anime.js defers the target
 * assignment to a later `sync()` frame, so `refresh()` reads a null target
 * and throws "Cannot read properties of null (reading
 * 'getBoundingClientRect')". Pin mode never creates that observer, so the
 * error is structurally impossible. (Phase 2 fixes the observer path itself
 * at the source in `react-animejs-package`.)
 *
 * Phase 2: this file folds into the real `useAnimeOnScroll` as a `pin`
 * branch and is then deleted from demo-docs.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useAnimeOnScroll,
  type ScrollObserver,
  type ScrollObserverState,
} from '@shakibdshy/react-animejs';
import { createPinEngine } from './pin-engine';
import type {
  PinEngine,
  PinObserverLike,
  PinState,
  ScrollThreshold,
  UseAnimeScrollPinControls,
  UseAnimeScrollPinOptions,
  UseAnimeScrollPinReturn,
} from './types';

const PIN_DEFAULT_STATE: PinState = {
  id: '',
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

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve a `container` option value into a concrete HTMLElement (or null).
 *
 * Accepts the same shapes the published `useAnimeOnScroll` documents for its
 * `container`/`target` options:
 *  - an HTMLElement,
 *  - a React ref (`{ current: HTMLElement | null }`),
 *  - a CSS selector string,
 *  - null/undefined (falls back to the hook's own containerRef, then window).
 *
 * This must never hand the engine a non-element (e.g. a raw ref object), or
 * `container.addEventListener` throws at attach time.
 */
function resolveContainerOption(
  container: unknown,
  fallback: React.RefObject<HTMLElement | null>,
): HTMLElement | null {
  if (container == null) {
    return fallback.current ?? null;
  }

  // React ref object: { current: HTMLElement | null }
  if (
    typeof container === 'object' &&
    'current' in container &&
    !('addEventListener' in container)
  ) {
    const node = (container as { current: HTMLElement | null }).current;
    return node ?? null;
  }

  if (typeof container === 'string') {
    const found = document.querySelector<HTMLElement>(container);
    return found ?? null;
  }

  // HTMLElement / SVGElement or anything that quacks like an event target.
  if (
    typeof container === 'object' &&
    typeof (container as HTMLElement).addEventListener === 'function'
  ) {
    return container as HTMLElement;
  }

  return fallback.current ?? null;
}

function toScrollObserverState(snap: PinObserverLike): ScrollObserverState {
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
  };
}

export function useAnimeOnScrollPin<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(options: UseAnimeScrollPinOptions = {}): UseAnimeScrollPinReturn<T, C> {
  const {
    pin,
    pinSpacing = true,
    endSpacing = 0,
    enabled = true,
    start,
    end,
    container,
    axis,
    deps = [],
    onPin,
    onUnpin,
    onUpdate,
    onEnter,
    onLeave,
    ...observerOptions
  } = options;

  // Callbacks are read through refs so the engine isn't rebuilt when they
  // change identity (matches the published hook's pattern).
  const callbacksRef = useRef({ onPin, onUnpin, onUpdate, onEnter, onLeave });
  callbacksRef.current = { onPin, onUnpin, onUpdate, onEnter, onLeave };

  const targetRef = useRef<T | null>(null);
  const containerRef = useRef<C | null>(null);
  const engineRef = useRef<PinEngine | null>(null);

  const [state, setState] = useState<PinState>(PIN_DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  // Stable options signature so the effect re-runs only on meaningful change.
  const optionsKey = useMemo(
    () => JSON.stringify({ pin, pinSpacing, endSpacing, enabled, start, end, axis }),
    [pin, pinSpacing, endSpacing, enabled, start, end, axis],
  );

  // ----- Delegation path: pin falsy → use the published hook verbatim -----
  const delegated = useAnimeOnScroll<T, C>({
    ...(observerOptions as UseAnimeScrollPinOptions),
    enabled: pin ? false : enabled,
    container,
    onEnter,
    onLeave,
    deps,
  });

  // Always expose a stable ref so consumers can attach it in either mode.
  // In delegation mode we forward the published ref; in pin mode we override.
  const ref = pin ? targetRef : delegated.ref;

  // ----- Pin path -----
  useEffect(() => {
    if (!pin) {
      // Delegation handles everything; just keep local state idle.
      setIsReady(false);
      return;
    }
    if (!enabled) {
      engineRef.current?.revert();
      engineRef.current = null;
      setState(PIN_DEFAULT_STATE);
      setIsReady(false);
      return;
    }

    const target = targetRef.current;
    if (!target) return;

    const resolvedContainer = resolveContainerOption(container, containerRef);

    const reducedMotion = prefersReducedMotion();

    const syncState = (snap: PinObserverLike) => {
      setState((prev) => {
        if (
          prev.progress === snap.progress &&
          prev.scroll === snap.scroll &&
          prev.isInView === snap.isInView &&
          prev.isPinned === snap.isInView &&
          prev.velocity === snap.velocity
        ) {
          return prev;
        }
        return { ...toScrollObserverState(snap), isPinned: snap.isInView };
      });
    };

    // The published options expose `axis` as anime.js' rich observer type
    // (which may be a callback); the pin engine only understands the plain
    // axis form. Coerce when possible, otherwise default to vertical.
    const plainAxis: 'x' | 'y' | undefined =
      axis === 'x' || axis === 'y' ? axis : undefined;

    const engine = createPinEngine({
      target,
      container: resolvedContainer,
      start: start as ScrollThreshold | undefined,
      end: end as ScrollThreshold | undefined,
      pinSpacing,
      endSpacing,
      axis: plainAxis,
      reducedMotion,
      onPin: (instance) => {
        syncState(instance);
        callbacksRef.current.onPin?.(instance);
      },
      onUnpin: (instance) => {
        syncState(instance);
        callbacksRef.current.onUnpin?.(instance);
      },
      onUpdate: (instance) => {
        syncState(instance);
        // Mirror the observer's enter/leave semantics so existing handlers
        // keep firing: onEnter when crossing into the pinned range, onLeave
        // when crossing out. The pin instance is observer-shaped, so cast to
        // the observer type the user callbacks expect.
        const asObserver = instance as unknown as ScrollObserver;
        if (instance.isInView) {
          callbacksRef.current.onEnter?.(asObserver);
        } else {
          callbacksRef.current.onLeave?.(asObserver);
        }
        callbacksRef.current.onUpdate?.(asObserver);
      },
    });

    engineRef.current = engine;
    const initial = engine.getState();
    setState({ ...toScrollObserverState(initial), isPinned: initial.isInView });
    setIsReady(true);

    return () => {
      engine.revert();
      if (engineRef.current === engine) engineRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, container, ...deps]);

  const controls = useMemo<UseAnimeScrollPinControls>(
    () => ({
      refresh: () => engineRef.current?.refresh() ?? null,
      revert: () => {
        engineRef.current?.revert();
        engineRef.current = null;
        setState(PIN_DEFAULT_STATE);
        setIsReady(false);
      },
      pin: () => engineRef.current?.pin(),
      unpin: () => engineRef.current?.unpin(),
      link: () => null,
    }),
    [],
  );

  if (!pin) {
    // Pass-through: surface the delegated observer API in the same shape.
    return {
      ref: delegated.ref,
      targetRef: delegated.targetRef,
      containerRef: delegated.containerRef,
      controls: {
        refresh: () => delegated.controls.refresh(),
        revert: () => delegated.controls.revert(),
        pin: () => {},
        unpin: () => {},
        link: (linked) => delegated.controls.link(linked),
      },
      observer: delegated.observer,
      state: { ...delegated.state, isPinned: false },
      isReady: delegated.isReady,
      isInView: delegated.isInView,
      isPinned: false,
      progress: delegated.progress,
      scroll: delegated.scroll,
      velocity: delegated.velocity,
      backward: delegated.backward,
    };
  }

  return {
    ref,
    targetRef,
    containerRef,
    controls,
    observer: null,
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

export default useAnimeOnScrollPin;
