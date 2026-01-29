/**
 * useAnime - Main animation hook for React
 *
 * Provides a declarative way to create animations in React components.
 * Handles lifecycle, cleanup, and state management automatically.
 */

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { animate, createScope } from "animejs";
import type {
  UseAnimeOptions,
  UseAnimeReturn,
  AnimationState,
  PlaybackControls,
  JSAnimation,
} from "../types";
import {
  useAnimeScope,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  isRef,
  createSafeCallback,
  safeJsonStringify,
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

    // Callbacks
    onBegin,
    onComplete,
    onUpdate,
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

  /**
   * Build the anime.js configuration object
   */
  const buildConfig = useCallback(() => {
    const currentOptions = optionsRef.current;
    const {
      targets: externalTargets,
      selector,
      onBegin,
      onComplete,
      onUpdate,
      onLoop,
      onPause,
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay = false,
      frameRate,
      playbackRate,
      ease,
      round,
      modifier,
      composition,
      stagger,
      keyframes,
      ...props
    } = currentOptions;

    // Resolve target
    let target: unknown = targetRef.current;

    if (externalTargets) {
      target = isRef(externalTargets)
        ? externalTargets.current
        : externalTargets;
    } else if (selector && scopeContext.rootRef.current) {
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
    config.onBegin = (anim: JSAnimation) => {
      setAnimationState(extractAnimationState(anim));
      createSafeCallback(onBegin, "onBegin")?.(anim);
    };

    config.onComplete = (anim: JSAnimation) => {
      setAnimationState(extractAnimationState(anim));
      createSafeCallback(onComplete, "onComplete")?.(anim);
    };

    config.onUpdate = (anim: JSAnimation) => {
      // Update state for reactive progress/values
      setAnimationState(extractAnimationState(anim));
      createSafeCallback(onUpdate, "onUpdate")?.(anim);
    };

    config.onLoop = (anim: JSAnimation) => {
      setAnimationState(extractAnimationState(anim));
      createSafeCallback(onLoop, "onLoop")?.(anim);
    };

    if (onPause) {
      config.onPause = (anim: JSAnimation) => {
        setAnimationState(extractAnimationState(anim));
        createSafeCallback(onPause, "onPause")?.(anim);
      };
    }

    // Clean undefined values
    Object.keys(config).forEach((key) => {
      if (config[key] === undefined) {
        delete config[key];
      }
    });

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

    try {
      // Create animation within a scope for proper cleanup
      scopeRef.current = createScope({
        root: scopeContext.rootRef.current || undefined,
      });

      // Create the animation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anim = animate(target, config as any) as unknown as JSAnimation;
      animationRef.current = anim;

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
    scopeContext,
    animatablePropsJson,
    ...deps,
  ]);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        animationRef.current?.play();
      },
      pause: () => {
        animationRef.current?.pause();
      },
      resume: () => {
        animationRef.current?.resume();
      },
      restart: () => {
        animationRef.current?.restart();
      },
      reverse: () => {
        animationRef.current?.reverse();
      },
      alternate: () => {
        animationRef.current?.alternate();
      },
      complete: () => {
        animationRef.current?.complete();
      },
      reset: () => {
        animationRef.current?.reset();
      },
      cancel: () => {
        animationRef.current?.cancel();
      },
      seek: (time: number | string) => {
        animationRef.current?.seek(time);
      },
      stretch: (newDuration: number) => {
        animationRef.current?.stretch(newDuration);
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
    animation: animationRef.current,
    isPlaying:
      !animationState.paused &&
      animationState.began &&
      !animationState.completed,
    isReady,
  };
}

export default useAnime;
