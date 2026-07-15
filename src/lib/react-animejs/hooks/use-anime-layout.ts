import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createLayout } from "animejs";
import type { AutoLayout, LayoutAnimationParams } from "animejs";
import type {
  Timeline,
  UseAnimeLayoutOptions,
  UseAnimeLayoutReturn,
} from "../types";
import {
  createSafeCallback,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveTarget,
  safeJsonStringify,
  useScopeContext,
} from "../core";

function normalizeSingleElement(
  target:
    | HTMLElement
    | SVGElement
    | NodeList
    | (HTMLElement | SVGElement)[]
    | null,
): HTMLElement | SVGElement | null {
  if (!target) return null;
  if (Array.isArray(target))
    return (target[0] as HTMLElement | SVGElement) || null;
  if (typeof NodeList !== "undefined" && target instanceof NodeList) {
    return (target[0] as HTMLElement | SVGElement) || null;
  }
  return target as HTMLElement | SVGElement;
}

// The 7 lifecycle callbacks anime.js's layout system accepts. These are
// intentionally NOT part of the serialized layout params — the AutoLayout
// constructor ignores tick callbacks (they're only read per-animation inside
// animate()/update()). Baking them into layoutParamsJson would (a) tear down
// and rebuild the whole layout whenever a callback is added/removed, and (b)
// always serialize to "[Function]" so swapping implementations wouldn't
// re-init anyway. Instead we hold the latest callbacks in a ref and merge them
// in wrapParams(), so callers can pass fresh inline closures freely.
const LAYOUT_CALLBACKS = [
  "onBegin",
  "onComplete",
  "onUpdate",
  "onRender",
  "onBeforeUpdate",
  "onLoop",
  "onPause",
];

export function useAnimeLayout<T extends HTMLElement = HTMLElement>(
  options: UseAnimeLayoutOptions = {} as UseAnimeLayoutOptions,
): UseAnimeLayoutReturn<T> {
  const rootRef = useRef<T | null>(null);
  const layoutRef = useRef<AutoLayout | null>(null);
  const timelineRef = useRef<Timeline | null>(null);

  const scopeContext = useScopeContext();

  const [state, setState] = useState(DEFAULT_ANIMATION_STATE);
  const [isReady, setIsReady] = useState(false);
  // Mirror the refs to state so consumers reading the hook's return value
  // (and the AnimeLayout ref) see the current instance after creation, instead
  // of a stale `null` captured at render time before the effect ran.
  const [layoutInstance, setLayoutInstance] = useState<AutoLayout | null>(null);
  const [timelineInstance, setTimelineInstance] = useState<Timeline | null>(
    null,
  );
  const [entering, setEntering] = useState<Element[]>([]);
  const [leaving, setLeaving] = useState<Element[]>([]);
  const [swapping, setSwapping] = useState<Element[]>([]);
  const [animating, setAnimating] = useState<Element[]>([]);

  const callbacksRef = useRef<Record<string, ((tl: Timeline) => void) | undefined>>({});

  const {
    root: externalRoot,
    selector,
    deps = [],
    enabled = true,
    ...restOptions
  } = options;

  // Split callbacks (→ ref, latest wins) from layout params (→ serialized).
  const { layoutParams } = useMemo(() => {
    const params: Record<string, unknown> = {};
    const cbs: Record<string, ((tl: Timeline) => void) | undefined> = {};
    for (const [key, value] of Object.entries(restOptions)) {
      if (LAYOUT_CALLBACKS.includes(key)) {
        cbs[key] = value as ((tl: Timeline) => void) | undefined;
      } else {
        params[key] = value;
      }
    }
    callbacksRef.current = cbs;
    return { layoutParams: params };
  }, [restOptions]);

  const layoutParamsJson = useMemo(
    () => safeJsonStringify(layoutParams),
    [layoutParams],
  );

  // Destructure to stable primitives for the dep array. Using the `scopeContext`
  // object directly would re-init the layout whenever the provider's context
  // value changes identity (e.g. when `scope` resolves null → instance on
  // mount), tearing down and rebuilding the layout for no reason.
  const { rootRef: scopeRootRef, isScoped, registerCleanup } = scopeContext;

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    const resolvedTarget = normalizeSingleElement(
      resolveTarget(externalRoot || rootRef, scopeRootRef.current),
    );

    const resolvedRoot =
      resolvedTarget ||
      (selector && scopeRootRef.current
        ? (scopeRootRef.current.querySelector(
          selector,
        ) as HTMLElement | null)
        : null);

    if (!resolvedRoot) return;

    try {
      // No manual createScope here: createLayout only registers with an anime.js
      // scope when called inside scope.execute(), which we don't run. The
      // explicit revert below (plus registerCleanup when scoped) already covers
      // lifecycle cleanup — a detached scope was dead code that registered the
      // layout with nothing.
      const layout = createLayout(
        resolvedRoot,
        layoutParams as any,
      ) as AutoLayout;
      layoutRef.current = layout;
      timelineRef.current = null;
      setState(DEFAULT_ANIMATION_STATE);
      setIsReady(true);
      setLayoutInstance(layout);
      setTimelineInstance(null);

      if (isScoped) {
        registerCleanup(() => {
          try {
            layoutRef.current?.revert();
          } catch {}
        });
      }
    } catch (error) {
      console.error("[react-animejs] Layout creation error:", error);
      setIsReady(false);
    }

    return () => {
      try {
        layoutRef.current?.revert();
      } catch {}
      layoutRef.current = null;
      timelineRef.current = null;

      setIsReady(false);
      setLayoutInstance(null);
      setTimelineInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    externalRoot,
    selector,
    scopeRootRef,
    isScoped,
    registerCleanup,
    layoutParamsJson,
    ...deps,
  ]);

  const wrapParams = useCallback((params?: LayoutAnimationParams) => {
    const p = (params || {}) as LayoutAnimationParams;
    const {
      onBegin,
      onComplete,
      onUpdate,
      onRender,
      onBeforeUpdate,
      onLoop,
      onPause,
      ...rest
    } = p as unknown as Record<string, unknown>;

    const wrapped: Record<string, unknown> = { ...rest };

    // Resolve a per-call callback, falling back to the hook-level callback held
    // in the ref (latest identity). Per-call always wins so callers can override
    // on a specific .animate()/.update() without replacing the hook default.
    const resolve = (name: string, perCall: unknown) =>
      (perCall as ((tl: Timeline) => void) | undefined) ??
      callbacksRef.current[name];

    const hookOnBegin = resolve("onBegin", onBegin);
    const hookOnComplete = resolve("onComplete", onComplete);
    const hookOnLoop = resolve("onLoop", onLoop);
    const hookOnPause = resolve("onPause", onPause);
    const hookOnUpdate = resolve("onUpdate", onUpdate);
    const hookOnRender = resolve("onRender", onRender);
    const hookOnBeforeUpdate = resolve("onBeforeUpdate", onBeforeUpdate);

    // Discrete callbacks (fire once per transition): sync React state so
    // consumers see isAnimating / progress milestones update.
    wrapped.onBegin = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(hookOnBegin as any, "onBegin")?.(tl);
    };

    wrapped.onComplete = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(hookOnComplete as any, "onComplete")?.(tl);
    };

    wrapped.onLoop = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(hookOnLoop as any, "onLoop")?.(tl);
    };

    if (hookOnPause) {
      wrapped.onPause = (tl: Timeline) => {
        setState(extractAnimationState(tl));
        createSafeCallback(hookOnPause as any, "onPause")?.(tl);
      };
    }

    // Per-frame callbacks (fire every animation tick, ~60fps): forward to the
    // user callback WITHOUT setState. A layout animation runs for <1s, but
    // setState-on-every-frame would trigger ~180 re-renders/sec and thrash
    // useImperativeHandle. Nothing in the layout API consumes live progress —
    // isAnimating derives from began/completed, already captured above.
    if (hookOnUpdate) {
      wrapped.onUpdate = (tl: Timeline) => {
        createSafeCallback(hookOnUpdate as any, "onUpdate")?.(tl);
      };
    }

    if (hookOnRender) {
      wrapped.onRender = (tl: Timeline) => {
        createSafeCallback(hookOnRender as any, "onRender")?.(tl);
      };
    }

    if (hookOnBeforeUpdate) {
      wrapped.onBeforeUpdate = (tl: Timeline) => {
        createSafeCallback(hookOnBeforeUpdate as any, "onBeforeUpdate")?.(tl);
      };
    }

    return wrapped as LayoutAnimationParams;
  }, []);

  const controls = useMemo(() => {
    // Helper to track layout state immediately after initialization
    const trackLayoutStateSync = () => {
      if (!layoutRef.current) return;
      setEntering((layoutRef.current.entering as Element[]) ?? []);
      setLeaving((layoutRef.current.leaving as Element[]) ?? []);
      setSwapping((layoutRef.current.swapping as Element[]) ?? []);
      setAnimating((layoutRef.current.animating as Element[]) ?? []);
    };

    return {
      record: () => {
        if (!layoutRef.current) return null;
        layoutRef.current.record();
        return layoutRef.current;
      },
      animate: (params?: LayoutAnimationParams) => {
        if (!layoutRef.current) return null;
        const tl = layoutRef.current.animate(
          wrapParams(params) as any,
        ) as unknown as Timeline;
        timelineRef.current = tl;
        setTimelineInstance(tl);
        setState(extractAnimationState(tl));
        trackLayoutStateSync();
        return tl;
      },
      update: (
        callback: (layout: AutoLayout) => void,
        params?: LayoutAnimationParams,
      ) => {
        if (!layoutRef.current) return null;
        const tl = layoutRef.current.update(
          callback,
          wrapParams(params) as any,
        ) as unknown as Timeline;
        timelineRef.current = tl;
        setTimelineInstance(tl);
        setState(extractAnimationState(tl));
        trackLayoutStateSync();
        return tl;
      },
      revert: () => {
        try {
          layoutRef.current?.revert();
        } catch {}
        timelineRef.current = null;
        setTimelineInstance(null);
        setState(DEFAULT_ANIMATION_STATE);
      },
    };
  }, [wrapParams]);

  // Get element arrays from layout instance - now using state for reactive updates
  return {
    ref: rootRef,
    controls,
    state,
    layout: layoutInstance,
    timeline: timelineInstance,
    isReady,
    isAnimating: !state.paused && state.began && !state.completed,
    entering,
    leaving,
    swapping,
    animating,
  };
}

export default useAnimeLayout;
