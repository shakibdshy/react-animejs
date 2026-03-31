import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type RefObject,
  type SVGProps,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, svg } from "animejs";
import type {
  AnimationState,
  JSAnimation,
  PlaybackControls,
  UseAnimeOptions,
} from "../types";
import {
  buildCallbackConfig,
  cleanUndefinedValues,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  safeJsonStringify,
  useAnimeScope,
} from "../core";
import {
  mergeClassName,
  resolveSvgElement,
  type SvgComponentRef,
  useSvgPlaybackControls,
} from "./svg-component-utils";

export interface AnimeMotionPathRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeMotionPathProps
  extends Omit<
    UseAnimeOptions,
    "targets" | "selector" | "translateX" | "translateY" | "rotate"
  > {
  children: ReactElement;
  path: string | SVGPathElement | RefObject<SVGPathElement | null>;
  offset?: number;
  showPath?: boolean;
  pathProps?: SVGProps<SVGPathElement>;
  onReady?: (api: AnimeMotionPathRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeMotionPath = forwardRef<
  AnimeMotionPathRef,
  AnimeMotionPathProps
>(function AnimeMotionPath(
  {
    children,
    path,
    offset = 0,
    showPath = false,
    pathProps,
    onReady,
    onControlsReady,
    onStateChange,
    className,
    deps = [],
    enabled = true,
    autoplay = false,
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
    ...animationProps
  },
  ref,
) {
  const childRef = useRef<SVGElement | null>(null);
  const internalPathRef = useRef<SVGPathElement | null>(null);
  const animationRef = useRef<JSAnimation | null>(null);
  const internalPathId = useId();
  const scopeContext = useAnimeScope();
  const readyNotifiedRef = useRef(false);
  const controlsNotifiedRef = useRef(false);

  const [state, setState] = useState<AnimationState>(DEFAULT_ANIMATION_STATE);
  const [isReady, setIsReady] = useState(false);

  const controls = useSvgPlaybackControls(animationRef, setState);
  const normalizedPath = typeof path === "string" ? path.trim() : null;

  const optionsJson = useMemo(
    () =>
        safeJsonStringify({
          path: normalizedPath ?? path,
          offset,
          showPath,
          pathProps,
          enabled,
          autoplay,
          animationProps,
        }),
    [normalizedPath, path, offset, showPath, pathProps, enabled, autoplay, animationProps],
  );

  const refValue = useMemo<AnimeMotionPathRef>(
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

  useImperativeHandle(ref, () => refValue, [refValue]);

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      readyNotifiedRef.current = false;
      return;
    }

    const source = childRef.current;
    const motionPath =
      typeof path === "string"
        ? internalPathRef.current
        : resolveSvgElement(path);

    if (!source || !motionPath) {
      return;
    }

    if (typeof path === "string" && !normalizedPath) {
      return;
    }

    const motionPathTagName = motionPath.tagName?.toLowerCase();
    if (
      motionPathTagName === "path" &&
      !((motionPath as SVGElement).getAttribute("d") || "").trim()
    ) {
      return;
    }

    const config: Record<string, unknown> = {
      ...svg.createMotionPath(motionPath, offset),
      ...animationProps,
      autoplay,
    };

    Object.assign(
      config,
      buildCallbackConfig<Record<string, unknown>, AnimationState, Record<string, ((anim: unknown) => void) | undefined>>(
        setState,
        extractAnimationState,
        {
          onBegin,
          onComplete,
          onUpdate,
          onRender,
          onBeforeUpdate,
          onLoop,
          onPause,
        },
        DEFAULT_ANIMATION_STATE,
      ),
    );

    cleanUndefinedValues(config);

    const animation = animate(
      source,
      config as Parameters<typeof animate>[1],
    ) as unknown as JSAnimation;
    animationRef.current = animation;
    setState(extractAnimationState(animation));
    setIsReady(true);

    if (scopeContext.isScoped) {
      scopeContext.registerCleanup(() => {
        animationRef.current?.revert();
      });
    }

    return () => {
      animationRef.current?.revert();
      animationRef.current = null;
      setIsReady(false);
    };
  }, [enabled, normalizedPath, optionsJson, scopeContext.rootRef, scopeContext.isScoped, scopeContext.registerCleanup, ...deps]);

  useEffect(() => {
    if (onControlsReady && !controlsNotifiedRef.current) {
      onControlsReady(controls);
      controlsNotifiedRef.current = true;
    }
  }, [controls, onControlsReady]);

  useEffect(() => {
    if (isReady && onReady && !readyNotifiedRef.current) {
      onReady(refValue);
      readyNotifiedRef.current = true;
    }
  }, [isReady, onReady, refValue]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  if (!isValidElement(children)) {
    console.warn(
      "[react-animejs] AnimeMotionPath requires a single valid SVG element as child",
    );
    return children;
  }

  const childElement = cloneElement(children, {
    ref: childRef,
    className: mergeClassName(
      className,
      (children.props as { className?: string }).className,
    ),
  } as Partial<unknown>);

  if (typeof path !== "string") {
    return childElement;
  }

  const {
    d: _ignoredPathData,
    ref: _ignoredPathRef,
    ...safePathProps
  } = pathProps ?? {};

  return (
    <>
      <path
        ref={internalPathRef}
        id={safePathProps.id ?? internalPathId}
        d={normalizedPath ?? ""}
        fill="none"
        stroke={showPath ? safePathProps.stroke ?? "currentColor" : "none"}
        {...safePathProps}
        opacity={showPath ? safePathProps.opacity : 0}
        aria-hidden={safePathProps["aria-hidden"] ?? true}
        pointerEvents={safePathProps.pointerEvents ?? "none"}
      />
      {childElement}
    </>
  );
});

export default AnimeMotionPath;
