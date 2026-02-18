import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createLayout, createScope } from "animejs";
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
  useAnimeScope,
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

export function useAnimeLayout<T extends HTMLElement = HTMLElement>(
  options: UseAnimeLayoutOptions = {} as UseAnimeLayoutOptions,
): UseAnimeLayoutReturn<T> {
  const rootRef = useRef<T | null>(null);
  const layoutRef = useRef<AutoLayout | null>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  const scopeContext = useAnimeScope();

  const [state, setState] = useState(DEFAULT_ANIMATION_STATE);
  const [isReady, setIsReady] = useState(false);
  const [entering, setEntering] = useState<Element[]>([]);
  const [leaving, setLeaving] = useState<Element[]>([]);
  const [swapping, setSwapping] = useState<Element[]>([]);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const {
    root: externalRoot,
    selector,
    deps = [],
    enabled = true,
    ...layoutParams
  } = options;

  const layoutParamsJson = useMemo(
    () => safeJsonStringify(layoutParams),
    [layoutParams],
  );

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    const resolvedTarget = normalizeSingleElement(
      resolveTarget(externalRoot || rootRef, scopeContext.rootRef.current),
    );

    const resolvedRoot =
      resolvedTarget ||
      (selector && scopeContext.rootRef.current
        ? (scopeContext.rootRef.current.querySelector(
            selector,
          ) as HTMLElement | null)
        : null);

    if (!resolvedRoot) return;

    try {
      scopeRef.current = createScope({
        root: scopeContext.rootRef.current || undefined,
      });

      const layout = createLayout(
        resolvedRoot,
        layoutParams as any,
      ) as AutoLayout;
      layoutRef.current = layout;
      timelineRef.current = null;
      setState(DEFAULT_ANIMATION_STATE);
      setIsReady(true);

      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
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

      try {
        scopeRef.current?.revert();
      } catch {}
      scopeRef.current = null;

      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    externalRoot,
    selector,
    scopeContext,
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

    wrapped.onBegin = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(onBegin as any, "onBegin")?.(tl);
    };

    // Helper to track layout state after animation completes
    const trackLayoutState = () => {
      if (!layoutRef.current) return;
      setEntering((layoutRef.current.entering as Element[]) ?? []);
      setLeaving((layoutRef.current.leaving as Element[]) ?? []);
      setSwapping((layoutRef.current.swapping as Element[]) ?? []);
    };

    wrapped.onComplete = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      trackLayoutState();
      createSafeCallback(onComplete as any, "onComplete")?.(tl);
    };

    wrapped.onUpdate = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(onUpdate as any, "onUpdate")?.(tl);
    };

    wrapped.onRender = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(onRender as any, "onRender")?.(tl);
    };

    wrapped.onBeforeUpdate = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(onBeforeUpdate as any, "onBeforeUpdate")?.(tl);
    };

    wrapped.onLoop = (tl: Timeline) => {
      setState(extractAnimationState(tl));
      createSafeCallback(onLoop as any, "onLoop")?.(tl);
    };

    if (onPause) {
      wrapped.onPause = (tl: Timeline) => {
        setState(extractAnimationState(tl));
        createSafeCallback(onPause as any, "onPause")?.(tl);
      };
    }

    return wrapped as LayoutAnimationParams;
  }, []);

  const controls = useMemo(() => {
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
        setState(extractAnimationState(tl));
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
        setState(extractAnimationState(tl));
        return tl;
      },
      revert: () => {
        try {
          layoutRef.current?.revert();
        } catch {}
        timelineRef.current = null;
        setState(DEFAULT_ANIMATION_STATE);
      },
    };
  }, [wrapParams]);

  // Get element arrays from layout instance - now using state for reactive updates
  return {
    ref: rootRef,
    controls,
    state,
    layout: layoutRef.current,
    timeline: timelineRef.current,
    isReady,
    isAnimating: !state.paused && state.began && !state.completed,
    entering,
    leaving,
    swapping,
  };
}

export default useAnimeLayout;
