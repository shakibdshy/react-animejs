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
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onLoop,
    onPause,
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
    const target = resolveTarget(
      externalTargets || targetRef,
      scopeContext.rootRef.current,
    );

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

      config.onBegin = wrapCallback(onBegin, "onBegin");
      config.onComplete = wrapCallback(onComplete, "onComplete");
      config.onUpdate = wrapCallback(onUpdate, "onUpdate");
      config.onRender = wrapCallback(onRender, "onRender");
      config.onLoop = wrapCallback(onLoop, "onLoop");
      config.onPause = wrapCallback(onPause, "onPause");

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
      stretch: (dur: number) => {
        if (!animationRef.current) return;
        animationRef.current.stretch(dur);
        setAnimationState(extractAnimationState(animationRef.current));
      },
      setPlaybackRate: (rate: number) => {
        if (animationRef.current) {
          (animationRef.current as any).playbackRate = rate;
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      setFrameRate: (fps: number) => {
        if (animationRef.current) {
          (animationRef.current as any).fps = fps;
          setAnimationState(extractAnimationState(animationRef.current));
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
