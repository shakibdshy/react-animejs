/**
 * useAnime - Main animation hook for React
 *
 * Provides a declarative way to create animations in React components.
 * Handles lifecycle, cleanup, and state management automatically.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope } from "animejs";
import type {
  AnimationState,
  JSAnimation,
  PlaybackControls,
  UseAnimeOptions,
  UseAnimeReturn,
} from "../types";
import {
  buildCallbackConfig,
  cleanUndefinedValues,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveTarget,
  safeJsonStringify,
  useAnimeScope,
} from "../core";

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnime - Create and control animations declaratively
 *
 * @param options - Animation options including properties, playback settings, and callbacks
 * @returns Object containing ref, controls, state, and animation instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, controls, state } = useAnime({
 *     translateX: 250,
 *     rotate: '1turn',
 *     duration: 1000,
 *     loop: true,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={controls.play}>Play</button>
 *       <p>Progress: {Math.round(state.progress * 100)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnime<T extends HTMLElement | SVGElement = HTMLElement>(
  options: UseAnimeOptions = {},
): UseAnimeReturn<T> {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Target element ref
  const targetRef = useRef<T | null>(null);

  // Animation instance ref
  const animationRef = useRef<JSAnimation | null>(null);

  // Scope ref for cleanup
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  // ==========================================================================
  // Context
  // ==========================================================================

  // Get parent scope context (if inside AnimeProvider)
  const scopeContext = useAnimeScope();

  // ==========================================================================
  // State
  // ==========================================================================

  // Animation state with reactive updates
  const [animationState, setAnimationState] = useState<AnimationState>(
    DEFAULT_ANIMATION_STATE,
  );

  // Ready state
  const [isReady, setIsReady] = useState(false);

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    // Hook-specific options
    selector,
    targets: externalTargets,
    deps = [],
    enabled = true,
    controller,

    // Callbacks
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,

    // Playback settings
    delay,
    duration,
    loop,
    loopDelay,
    alternate,
    reversed,
    autoplay = false,
    frameRate,
    playbackRate,
    playbackEase,
    persist,

    // Tween params
    ease,
    round,
    modifier,
    composition,

    // Stagger
    stagger,

    // Keyframes
    keyframes,

    // Rest are animatable properties
    ...animatableProps
  } = options;

  const callbackRefs = useRef({
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
  });
  callbackRefs.current = {
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
  };

  // ==========================================================================
  // Memoized Options
  // ==========================================================================

  // Use a ref to store the latest options without triggering re-renders
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Stability for animatable props and config
  const animatablePropsJson = useMemo(
    () => safeJsonStringify(animatableProps),
    [animatableProps],
  );
  const configJson = useMemo(
    () =>
      safeJsonStringify({
        delay,
        duration,
        loop,
        loopDelay,
        alternate,
        reversed,
        autoplay,
        frameRate,
        playbackRate,
        persist,
        round,
        composition,
        stagger,
        keyframes,
      }),
    [
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay,
      frameRate,
      playbackRate,
      persist,
      round,
      composition,
      stagger,
      keyframes,
    ],
  );

  /**
   * Build the anime.js configuration object
   */
  const buildConfig = useCallback(() => {
    const currentOptions = optionsRef.current;
    const {
      targets: externalTargets,
      selector,
      controller,
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay = false,
      frameRate,
      playbackRate,
      playbackEase,
      persist,
      ease,
      round,
      modifier,
      composition,
      stagger,
      keyframes,
      ...props
    } = currentOptions;

    // Resolve target
    let target: unknown = resolveTarget(
      externalTargets || targetRef,
      scopeContext.rootRef.current,
    );

    if (!target && selector && scopeContext.rootRef.current) {
      target = scopeContext.rootRef.current.querySelectorAll(selector);
    }

    if (!target) return null;

    // Build config object
    const config: Record<string, unknown> = {
      ...props,

      // Playback settings
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay,
      frameRate,
      playbackRate,
      playbackEase,
      persist,

      // Tween params
      ease,
      round,
      modifier,
      composition,
    };

    // Add stagger if provided
    if (stagger !== undefined) {
      config.delay = stagger;
    }

    // Add keyframes if provided
    if (keyframes) {
      config.keyframes = keyframes;
    }

    // Wrap callbacks with state updates
    const callbackConfig = buildCallbackConfig(
      setAnimationState,
      extractAnimationState,
      {
        onBegin: (anim) => callbackRefs.current.onBegin?.(anim as JSAnimation),
        onComplete: (anim) =>
          callbackRefs.current.onComplete?.(anim as JSAnimation),
        onUpdate: (anim) => callbackRefs.current.onUpdate?.(anim as JSAnimation),
        onRender: (anim) => callbackRefs.current.onRender?.(anim as JSAnimation),
        onBeforeUpdate: (anim) =>
          callbackRefs.current.onBeforeUpdate?.(anim as JSAnimation),
        onLoop: (anim) => callbackRefs.current.onLoop?.(anim as JSAnimation),
        onPause: (anim) => callbackRefs.current.onPause?.(anim as JSAnimation),
      },
      DEFAULT_ANIMATION_STATE,
    );

    // Merge callback config
    Object.assign(config, callbackConfig);

    // Clean undefined values
    cleanUndefinedValues(config);

    return { target, config };
  }, [scopeContext.rootRef]);

  // ==========================================================================
  // Animation Lifecycle
  // ==========================================================================

  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      setIsReady(false);
      return;
    }

    // Wait for target to be available (if using ref)
    if (!externalTargets && !selector && !targetRef.current) {
      return;
    }

    // Create the animation
    const result = buildConfig();
    if (!result) return;

    const { target, config } = result;
    let unregisterController: (() => void) | undefined;

    try {
      // Create animation within a scope for proper cleanup
      scopeRef.current = createScope({
        root: scopeContext.rootRef.current || undefined,
      });

      // Create the animation
       
      const anim = animate(target, config as any) as unknown as JSAnimation;
      animationRef.current = anim;
      unregisterController = controller?.register(anim);

      // Update initial state
      setAnimationState(extractAnimationState(anim));
      setIsReady(true);

      // Register cleanup with parent scope if available
      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          if (animationRef.current) {
            try {
              animationRef.current.revert();
            } catch {
              // Ignore cleanup errors
            }
          }
        });
      }
    } catch (error) {
      console.error("[react-animejs] Animation creation error:", error);
      setIsReady(false);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        animationRef.current = null;
      }

      unregisterController?.();

      if (scopeRef.current) {
        try {
          scopeRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        scopeRef.current = null;
      }

      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    externalTargets,
    selector,
    controller,
    scopeContext.isScoped,
    scopeContext.registerCleanup,
    scopeContext.rootRef,
    animatablePropsJson,
    configJson,
    ease,
    modifier,
    playbackEase,
    ...deps,
  ]);

  // ==========================================================================
  // Dynamic frameRate update
  // ==========================================================================

  useEffect(() => {
    if (animationRef.current && frameRate !== undefined) {
      // Dynamically update fps on the existing animation instance
      (animationRef.current as unknown as Record<string, unknown>).fps =
        frameRate;
    }
  }, [frameRate]);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        if (animationRef.current) {
          animationRef.current.play();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      pause: () => {
        if (animationRef.current) {
          animationRef.current.pause();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      resume: () => {
        if (animationRef.current) {
          animationRef.current.resume();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      restart: () => {
        if (animationRef.current) {
          animationRef.current.restart();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      reverse: () => {
        if (animationRef.current) {
          animationRef.current.reverse();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      alternate: () => {
        if (animationRef.current) {
          animationRef.current.alternate();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      complete: () => {
        if (animationRef.current) {
          animationRef.current.complete();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      reset: () => {
        if (animationRef.current) {
          animationRef.current.reset();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      cancel: () => {
        if (animationRef.current) {
          animationRef.current.cancel();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      revert: () => {
        if (animationRef.current) {
          animationRef.current.revert();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      seek: (time: number | string) => {
        if (animationRef.current) {
          animationRef.current.seek(time);
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      stretch: (newDuration: number) => {
        animationRef.current?.stretch(newDuration);
      },
      refresh: () => {
        animationRef.current?.refresh();
        if (animationRef.current) {
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      setPlaybackRate: (rate: number) => {
        if (animationRef.current) {
          (
            animationRef.current as unknown as Record<string, unknown>
          ).playbackRate = rate;
        }
      },
      setFrameRate: (fps: number) => {
        if (animationRef.current) {
          (
            animationRef.current as unknown as Record<string, unknown>
          ).fps = fps;
        }
      },
    }),
    [],
  );

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    ref: targetRef,
    controls,
    state: animationState,
    // Return the ref so consumers can always access the latest animation instance
    animation: animationRef,
    isPlaying:
      !animationState.paused &&
      animationState.began &&
      !animationState.completed,
    isReady,
  };
}

export default useAnime;
