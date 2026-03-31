import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  useEffect,
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
  type SvgComponentRef,
  useSvgPlaybackControls,
} from "./svg-component-utils";

type DrawableShape =
  | SVGPathElement
  | SVGCircleElement
  | SVGRectElement
  | SVGLineElement
  | SVGPolylineElement
  | SVGPolygonElement
  | SVGEllipseElement;

export interface AnimeDrawRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeDrawProps extends Omit<
  UseAnimeOptions,
  "targets" | "selector"
> {
  children: ReactElement;
  draw?: string | string[];
  onReady?: (api: AnimeDrawRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeDraw = forwardRef<AnimeDrawRef, AnimeDrawProps>(
  function AnimeDraw(
    {
      children,
      draw = ["0 0", "0 1"],
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
    const childRef = useRef<DrawableShape | null>(null);
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
          draw,
          enabled,
          autoplay,
          animationProps,
        }),
      [draw, enabled, autoplay, animationProps],
    );

    const refValue = useMemo<AnimeDrawRef>(
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

      if (!source) {
        return;
      }

      const config: Record<string, unknown> = {
        ...animationProps,
        autoplay,
        draw,
      };

      Object.assign(
        config,
        buildCallbackConfig<
          Record<string, unknown>,
          AnimationState,
          Record<string, ((anim: unknown) => void) | undefined>
        >(
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
        svg.createDrawable(source) as unknown as Parameters<typeof animate>[0],
        config as unknown as Parameters<typeof animate>[1],
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
    }, [
      enabled,
      optionsJson,
      scopeContext.rootRef,
      scopeContext.isScoped,
      scopeContext.registerCleanup,
      ...deps,
    ]);

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
        "[react-animejs] AnimeDraw requires a single valid SVG element as child",
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

export default AnimeDraw;
