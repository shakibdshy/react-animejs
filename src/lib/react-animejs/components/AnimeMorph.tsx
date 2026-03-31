import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from "react";
import { animate, svg } from "animejs";
import type {
  UseAnimeOptions,
  PlaybackControls,
  AnimationState,
  JSAnimation,
} from "../types";
import {
  DEFAULT_ANIMATION_STATE,
  buildCallbackConfig,
  cleanUndefinedValues,
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

type MorphableShape =
  | SVGPathElement
  | SVGPolygonElement
  | SVGPolylineElement;

export interface AnimeMorphRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeMorphProps
  extends Omit<UseAnimeOptions, "targets" | "selector" | "d" | "points"> {
  children: ReactElement;
  to?: string | MorphableShape | RefObject<MorphableShape | null>;
  target?: MorphableShape | RefObject<MorphableShape | null>;
  precision?: number;
  attribute?: "d" | "points";
  onReady?: (api: AnimeMorphRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeMorph = forwardRef<AnimeMorphRef, AnimeMorphProps>(
  function AnimeMorph(
    {
      children,
      to,
      target,
      precision = 0.33,
      attribute,
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
    const childRef = useRef<MorphableShape | null>(null);
    const animationRef = useRef<JSAnimation | null>(null);
    const scopeContext = useAnimeScope();
    const readyNotifiedRef = useRef(false);
    const controlsNotifiedRef = useRef(false);

    const [state, setState] = useState<AnimationState>(DEFAULT_ANIMATION_STATE);
    const [isReady, setIsReady] = useState(false);

    const controls = useSvgPlaybackControls(animationRef, setState);

    const optionsJson = useMemo(
      () =>
        safeJsonStringify({
          to,
          target,
          precision,
          attribute,
          enabled,
          autoplay,
          animationProps,
        }),
      [to, target, precision, attribute, enabled, autoplay, animationProps],
    );

    const refValue = useMemo<AnimeMorphRef>(
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
      const morphTarget = resolveSvgElement(to ?? target);

      if (!source || (!morphTarget && typeof to !== "string")) {
        return;
      }

      const morphAttribute =
        attribute ?? (source.tagName.toLowerCase() === "path" ? "d" : "points");

      const morphValue =
        typeof to === "string"
          ? [getCurrentSvgAttribute(source, morphAttribute), to]
          : svg.morphTo(morphTarget as MorphableShape, precision);

      const config: Record<string, unknown> = {
        ...animationProps,
        autoplay,
        [morphAttribute]: morphValue,
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
    }, [enabled, optionsJson, scopeContext.rootRef, scopeContext.isScoped, scopeContext.registerCleanup, ...deps]);

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
        "[react-animejs] AnimeMorph requires a single valid SVG element as child",
      );
      return children;
    }

    return cloneElement(children, {
      ref: childRef,
      className: mergeClassName(
        className,
        (children.props as { className?: string }).className,
      ),
    } as Partial<unknown>);
  },
);

export default AnimeMorph;

function getCurrentSvgAttribute(
  source: MorphableShape,
  attribute: "d" | "points",
) {
  return source.getAttribute(attribute) ?? "";
}
