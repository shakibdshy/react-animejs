import {
  type MutableRefObject,
  type ReactElement,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate } from "animejs";
import type { AnimationState, JSAnimation, PlaybackControls } from "../types";
import {
  buildCallbackConfig,
  cleanUndefinedValues,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  isRef,
  safeJsonStringify,
  useScopeContext,
} from "../core";

export interface SvgComponentRef {
  controls: PlaybackControls;
  state: AnimationState;
  animation: JSAnimation | null;
  isReady: boolean;
  isPlaying: boolean;
  getAnimation: () => JSAnimation | null;
}

export function useSvgPlaybackControls(
  animationRef: MutableRefObject<JSAnimation | null>,
  setAnimationState: (state: AnimationState) => void,
): PlaybackControls {
  return useMemo(
    () => ({
      play: () => {
        if (!animationRef.current) return;
        animationRef.current.play();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      pause: () => {
        if (!animationRef.current) return;
        animationRef.current.pause();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      resume: () => {
        if (!animationRef.current) return;
        animationRef.current.resume();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      restart: () => {
        if (!animationRef.current) return;
        animationRef.current.restart();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      reverse: () => {
        if (!animationRef.current) return;
        animationRef.current.reverse();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      alternate: () => {
        if (!animationRef.current) return;
        animationRef.current.alternate();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      complete: () => {
        if (!animationRef.current) return;
        animationRef.current.complete();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      reset: () => {
        if (!animationRef.current) return;
        animationRef.current.reset();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      cancel: () => {
        if (!animationRef.current) return;
        animationRef.current.cancel();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      revert: () => {
        if (!animationRef.current) return;
        animationRef.current.revert();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      refresh: () => {
        if (!animationRef.current) return;
        animationRef.current.refresh();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      seek: (time: number | string) => {
        if (!animationRef.current) return;
        animationRef.current.seek(time);
        setAnimationState(extractAnimationState(animationRef.current));
      },
      stretch: (duration: number) => {
        if (!animationRef.current) return;
        animationRef.current.stretch(duration);
        setAnimationState(extractAnimationState(animationRef.current));
      },
      setPlaybackRate: (rate: number) => {
        if (!animationRef.current) return;
        (animationRef.current as JSAnimation & { playbackRate?: number }).playbackRate = rate;
        setAnimationState(extractAnimationState(animationRef.current));
      },
      setFrameRate: (fps: number) => {
        if (!animationRef.current) return;
        (animationRef.current as JSAnimation & { fps?: number }).fps = fps;
        setAnimationState(extractAnimationState(animationRef.current));
      },
    }),
    [animationRef, setAnimationState],
  );
}

export function resolveSvgElement<T extends SVGElement>(
  value?: T | RefObject<T | null> | null | string,
): T | string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (isRef(value)) {
    return value.current as T | null;
  }

  return value as T;
}

export function mergeClassName(
  className: string | undefined,
  childClassName: unknown,
) {
  if (!className) {
    return childClassName as string | undefined;
  }

  return `${(childClassName as string | undefined) || ""} ${className}`.trim();
}

export function mergeChildProps<P extends { className?: string }>(
  child: ReactElement<P>,
  propsToMerge: Partial<P>,
) {
  return {
    ...child.props,
    ...propsToMerge,
    className: mergeClassName(propsToMerge.className, child.props.className),
  };
}

// -----------------------------------------------------------------------------
// Shared SVG Animation Hook
// -----------------------------------------------------------------------------

export interface SvgAnimationOptions<TTarget = any, TConfig = any> {
  enabled: boolean;
  autoplay?: boolean;
  deps: unknown[];
  specificOptions: Record<string, unknown>; // properties specific to the SVG animation type
  callbacks: {
    onBegin?: (anim: any) => void;
    onComplete?: (anim: any) => void;
    onUpdate?: (anim: any) => void;
    onRender?: (anim: any) => void;
    onBeforeUpdate?: (anim: any) => void;
    onLoop?: (anim: any) => void;
    onPause?: (anim: any) => void;
    onReady?: (api: any) => void;
    onControlsReady?: (controls: PlaybackControls) => void;
    onStateChange?: (state: AnimationState) => void;
  };
  animationProps: Record<string, unknown>; // standard anime properties
  createConfig: (source: SVGElement) => { target: TTarget; config: TConfig } | null;
  refValueBuilder: (base: SvgComponentRef) => any;
  forwardedRef: any;
}

export function useSvgAnimation<TSvg extends SVGElement = SVGElement>({
  enabled,
  autoplay = false,
  deps = [],
  specificOptions,
  callbacks,
  animationProps,
  createConfig,
  refValueBuilder,
  forwardedRef,
}: SvgAnimationOptions) {
  const childRef = useRef<TSvg | null>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const scopeContext = useScopeContext();
  const readyNotifiedRef = useRef(false);
  const controlsNotifiedRef = useRef(false);

  const [state, setState] = useState<AnimationState>(DEFAULT_ANIMATION_STATE);
  const [isReady, setIsReady] = useState(false);

  const controls = useSvgPlaybackControls(animationRef, setState);

  const optionsJson = useMemo(
    () =>
      safeJsonStringify({
        ...specificOptions,
        enabled,
        autoplay,
        animationProps,
      }),
    [specificOptions, enabled, autoplay, animationProps],
  );

  const depsHash = useMemo(() => safeJsonStringify(deps), [deps]);

  const baseRefValue: SvgComponentRef = useMemo(
    () => ({
      controls,
      state,
      animation: animationRef.current,
      isReady,
      isPlaying: !state.paused && state.began && !state.completed,
      getAnimation: () => animationRef.current,
    }),
    [controls, state, isReady],
  );

  const refValue = useMemo(() => refValueBuilder(baseRefValue), [refValueBuilder, baseRefValue]);

  useImperativeHandle(forwardedRef, () => refValue, [refValue]);

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      readyNotifiedRef.current = false;
      return;
    }

    const source = childRef.current;
    if (!source) {
      return;
    }

    const compiled = createConfig(source);
    if (!compiled) return;

    const config: Record<string, unknown> = {
      ...compiled.config,
      ...animationProps,
      autoplay,
    };

    Object.assign(
      config,
      buildCallbackConfig(
        setState,
        extractAnimationState,
        callbacks,
        DEFAULT_ANIMATION_STATE,
      ),
    );

    cleanUndefinedValues(config);

    const animation = animate(compiled.target as any, config as any) as unknown as JSAnimation;
    animationRef.current = animation;
    setState(extractAnimationState(animation));
    setIsReady(true);

    if (scopeContext.isScoped && scopeContext.registerCleanup) {
      scopeContext.registerCleanup(() => {
        animationRef.current?.revert();
      });
    }

    return () => {
      animationRef.current?.revert();
      animationRef.current = null;
      setIsReady(false);
    };
  }, [enabled, optionsJson, depsHash, scopeContext.rootRef, scopeContext.isScoped]);

  useEffect(() => {
    if (callbacks.onControlsReady && !controlsNotifiedRef.current) {
      callbacks.onControlsReady(controls);
      controlsNotifiedRef.current = true;
    }
  }, [controls, callbacks.onControlsReady]);

  useEffect(() => {
    if (isReady && callbacks.onReady && !readyNotifiedRef.current) {
      callbacks.onReady(refValue);
      readyNotifiedRef.current = true;
    }
  }, [isReady, callbacks.onReady, refValue]);

  useEffect(() => {
    callbacks.onStateChange?.(state);
  }, [state, callbacks.onStateChange]);

  return { childRef };
}
