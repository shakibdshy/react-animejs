/**
 * useAnimeWAAPI - WAAPI animation hook for React
 *
 * Provides a declarative way to create WAAPI animations in React components.
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { waapi } from "animejs";
import type {
  UseAnimeWAAPIOptions,
  UseAnimeWAAPIReturn,
  AnimationState,
  PlaybackControls,
  WAAPIAnimation,
} from "../types";
import {
  useAnimeScope,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveTarget,
  createSafeCallback,
  safeJsonStringify,
} from "../core";

/**
 * useAnimeWAAPI - Create and control WAAPI animations declaratively
 *
 * @param options - Animation options including properties and playback settings
 * @returns Object containing ref, controls, state, and animation instance
 */
export function useAnimeWAAPI<T extends HTMLElement | SVGElement = HTMLElement>(
  options: UseAnimeWAAPIOptions = {},
): UseAnimeWAAPIReturn<T> {
  const targetRef = useRef<T | null>(null);
  const animationRef = useRef<WAAPIAnimation | null>(null);
  const scopeContext = useAnimeScope();

  const [animationState, setAnimationState] = useState<AnimationState>(
    DEFAULT_ANIMATION_STATE,
  );
  const [isReady, setIsReady] = useState(false);

  const {
    targets: externalTargets,
    deps = [],
    enabled = true,
    autoplay = false,
    stagger,
    ...restOptions
  } = options;

  // Stability for animatable props
  const optionsJson = useMemo(() => {
    const { onBegin, onComplete, onUpdate, onRender, onLoop, ...serializable } = options;
    return safeJsonStringify(serializable);
  }, [options]);

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    // Resolve target
    const target = resolveTarget(externalTargets || targetRef);

    if (!target) return;

    try {
      const config: Record<string, unknown> = {
        ...restOptions,
        autoplay,
      };

      if (stagger !== undefined) {
        config.stagger = stagger;
      }

      // Wrap callbacks
      const wrapCallback = (cb: ((anim: WAAPIAnimation) => void) | undefined, name: string) => 
        (anim: WAAPIAnimation) => {
          setAnimationState(extractAnimationState(anim));
          createSafeCallback(cb, name)?.(anim);
        };

      config.onBegin = wrapCallback(options.onBegin, "onBegin");
      config.onComplete = wrapCallback(options.onComplete, "onComplete");
      config.onUpdate = wrapCallback(options.onUpdate, "onUpdate");
      config.onRender = wrapCallback(options.onRender, "onRender");
      config.onLoop = wrapCallback(options.onLoop, "onLoop");

      const anim = waapi.animate(target as any, config as any) as unknown as WAAPIAnimation;
      animationRef.current = anim;

      setAnimationState(extractAnimationState(anim));
      setIsReady(true);

      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          animationRef.current?.revert();
        });
      }
    } catch (error) {
      console.error("[react-animejs] WAAPI animation creation error:", error);
      setIsReady(false);
    }

    return () => {
      animationRef.current?.revert();
      animationRef.current = null;
      setIsReady(false);
    };
  }, [enabled, optionsJson, scopeContext, ...deps]);

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => animationRef.current?.play(),
      pause: () => animationRef.current?.pause(),
      resume: () => animationRef.current?.resume(),
      restart: () => animationRef.current?.restart(),
      reverse: () => animationRef.current?.reverse(),
      alternate: () => animationRef.current?.alternate(),
      complete: () => animationRef.current?.complete(),
      reset: () => animationRef.current?.reset(),
      cancel: () => animationRef.current?.cancel(),
      revert: () => animationRef.current?.revert(),
      refresh: () => animationRef.current?.refresh(),
      seek: (time: number | string) => animationRef.current?.seek(time),
      stretch: (dur: number) => animationRef.current?.stretch(dur),
      setPlaybackRate: (rate: number) => {
        if (animationRef.current) {
          (animationRef.current as any).playbackRate = rate;
        }
      },
      setFrameRate: (fps: number) => {
        if (animationRef.current) {
          (animationRef.current as any).fps = fps;
        }
      },
    }),
    [],
  );

  return {
    ref: targetRef,
    controls,
    state: animationState,
    animation: animationRef.current,
    isPlaying: !animationState.paused && animationState.began && !animationState.completed,
    isReady,
  };
}

export default useAnimeWAAPI;
