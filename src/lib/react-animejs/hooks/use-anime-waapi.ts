/**
 * useAnimeWAAPI - WAAPI animation hook for React
 *
 * Provides a declarative way to create WAAPI animations in React components.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { waapi } from "animejs";
import type {
  AnimationState,
  PlaybackControls,
  UseAnimeWAAPIOptions,
  UseAnimeWAAPIReturn,
  WAAPIAnimation,
} from "../types";
import {
  createSafeCallback,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveTarget,
  safeJsonStringify,
  useScopeContext,
} from "../core";
import { useDependencySignal } from './use-dependency-signal';
import { useLatestRef } from './use-latest-ref';

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
  const scopeContext = useScopeContext();

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

  const depsSignal = useDependencySignal(deps);
  const latestCallbacksRef = useLatestRef({
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onLoop,
    onPause,
  });
  const latestOptionsRef = useLatestRef({
    externalTargets,
    autoplay,
    stagger,
    restOptions,
  });
  const { rootRef: scopeRootRef, isScoped, registerCleanup } = scopeContext;

  // Stability for animatable props
  const optionsJson = useMemo(() => {
    const {
      onBegin: _onBegin,
      onComplete: _onComplete,
      onUpdate: _onUpdate,
      onRender: _onRender,
      onLoop: _onLoop,
      onPause: _onPause,
      ...serializable
    } = options;
    return safeJsonStringify(serializable);
  }, [options]);

  useEffect(() => {
    let unregisterScopedCleanup: (() => void) | undefined;

    if (!enabled) {
      setIsReady(false);
      return;
    }

    const currentOptions = latestOptionsRef.current;
    // Resolve target
    const target = resolveTarget(
      currentOptions.externalTargets || targetRef,
      scopeRootRef.current,
    );

    if (!target) return;

    try {
      const config: Record<string, unknown> = {
        ...currentOptions.restOptions,
        autoplay: currentOptions.autoplay,
      };

      if (currentOptions.stagger !== undefined) {
        config.stagger = currentOptions.stagger;
      }

      // Wrap callbacks
      const wrapCallback = (name: keyof typeof latestCallbacksRef.current) =>
        (anim: WAAPIAnimation) => {
          setAnimationState(extractAnimationState(anim));
          createSafeCallback(latestCallbacksRef.current[name], name)?.(anim);
        };

      config.onBegin = wrapCallback("onBegin");
      config.onComplete = wrapCallback("onComplete");
      config.onUpdate = wrapCallback("onUpdate");
      config.onRender = wrapCallback("onRender");
      config.onLoop = wrapCallback("onLoop");
      config.onPause = wrapCallback("onPause");

      const anim = waapi.animate(target as any, config as any) as unknown as WAAPIAnimation;
      animationRef.current = anim;

      setAnimationState(extractAnimationState(anim));
      setIsReady(true);

      if (isScoped) {
        unregisterScopedCleanup = registerCleanup(() => {
          animationRef.current?.revert();
        });
      }
    } catch (error) {
      console.error("[react-animejs] WAAPI animation creation error:", error);
      setIsReady(false);
    }

    return () => {
      unregisterScopedCleanup?.();
      animationRef.current?.revert();
      animationRef.current = null;
      setIsReady(false);
    };
  }, [
    enabled,
    optionsJson,
    scopeRootRef,
    isScoped,
    registerCleanup,
    latestOptionsRef,
    latestCallbacksRef,
    depsSignal,
  ]);

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
          (animationRef.current as unknown as Record<string, unknown>).speed = rate;
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
