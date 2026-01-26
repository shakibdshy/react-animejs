/**
 * useAnimeTimer - Timer hook for React
 *
 * A React-friendly replacement for setTimeout/setInterval that stays
 * synchronized with anime.js animations.
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { createTimer } from "animejs";
import type {
  UseAnimeTimerOptions,
  UseAnimeTimerReturn,
  AnimationState,
  PlaybackControls,
  Timer,
} from "../types";
import {
  useAnimeScope,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  createSafeCallback,
  safeJsonStringify,
} from "../core";

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnimeTimer - Create synchronized timers
 *
 * @param options - Timer options including duration, loop, and callbacks
 * @returns Object containing controls, state, and timer instance
 *
 * @example
 * ```tsx
 * function Countdown() {
 *   const [count, setCount] = useState(0);
 *
 *   const { controls, state } = useAnimeTimer({
 *     duration: 1000,
 *     loop: 10,
 *     onLoop: () => setCount(c => c + 1),
 *   });
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={controls.pause}>Pause</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimeTimer(
  options: UseAnimeTimerOptions = {},
): UseAnimeTimerReturn {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Timer instance ref
  const timerRef = useRef<Timer | null>(null);

  // ==========================================================================
  // Context
  // ==========================================================================

  // Get parent scope context
  const scopeContext = useAnimeScope();

  // ==========================================================================
  // State
  // ==========================================================================

  const [timerState, setTimerState] = useState<AnimationState>(
    DEFAULT_ANIMATION_STATE,
  );
  const [isReady, setIsReady] = useState(false);

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
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
    duration = 1000,
    loop,
    loopDelay,
    alternate,
    reversed,
    autoplay = false,
    frameRate,
    playbackRate,
  } = options;

  // ==========================================================================
  // Timer Lifecycle
  // ==========================================================================

  // Stability for options - NOTE: frameRate is NOT included here because
  // it should be updated dynamically via timer.fps, not by recreating the timer
  const optionsJson = useMemo(
    () =>
      safeJsonStringify({
        delay,
        duration,
        loop,
        loopDelay,
        alternate,
        reversed,
        autoplay,
        playbackRate,
      }),
    [
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay,
      playbackRate,
    ],
  );

  // Store scope context in ref to avoid it as a dependency
  const scopeContextRef = useRef(scopeContext);
  scopeContextRef.current = scopeContext;

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    try {
      // Build timer config - note: frameRate is included for initial creation only
      const config: Record<string, unknown> = {
        delay,
        duration,
        loop,
        loopDelay,
        alternate,
        reversed,
        autoplay,
        frameRate, // Only used for initial creation
        playbackRate,
      };

      // Wrap callbacks with state updates (only for lifecycle events, NOT onUpdate)
      config.onBegin = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));
        createSafeCallback(onBegin, "onBegin")?.(timer);
      };

      config.onComplete = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));
        createSafeCallback(onComplete, "onComplete")?.(timer);
      };

      config.onUpdate = (timer: Timer) => {
        // NOTE: We intentionally do NOT call setTimerState here!
        // React state updates on every frame interfere with Anime.js timing.
        // Users should use refs for per-frame updates (like the vanilla JS docs example).
        createSafeCallback(onUpdate, "onUpdate")?.(timer);
      };

      config.onLoop = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));
        createSafeCallback(onLoop, "onLoop")?.(timer);
      };

      if (onPause) {
        config.onPause = (timer: Timer) => {
          setTimerState(extractAnimationState(timer));
          createSafeCallback(onPause, "onPause")?.(timer);
        };
      }

      // Clean undefined values
      Object.keys(config).forEach((key) => {
        if (config[key] === undefined) {
          delete config[key];
        }
      });

      // Create timer
      timerRef.current = createTimer(config) as unknown as Timer;

      // If we are recreating, try to seek to previous time to avoid "restarting" feel
      // DISABLED: This interferes with 'reversed' toggling (seeking 0 on a reversed timer might be wrong)
      // and causes "sticky" behavior when changing configs.
      /*
      if (previousTime > 0 && previousTime < (duration || 0)) {
        newTimer.seek(previousTime);
      }
      */
      setTimerState(extractAnimationState(timerRef.current));
      setIsReady(true);

      // Register cleanup with parent scope (using ref to avoid dependency)
      const currentScopeContext = scopeContextRef.current;
      if (currentScopeContext.isScoped) {
        currentScopeContext.registerCleanup(() => {
          if (timerRef.current) {
            try {
              timerRef.current.cancel();
            } catch {
              // Ignore cleanup errors
            }
          }
        });
      }
    } catch (error) {
      console.error("[react-animejs] Timer creation error:", error);
      setIsReady(false);
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        try {
          timerRef.current.cancel();
        } catch {
          // Ignore cleanup errors
        }
        timerRef.current = null;
      }
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, optionsJson, ...deps]);

  // ==========================================================================
  // Dynamic frameRate update (matches Anime.js docs pattern: timer.fps = value)
  // ==========================================================================

  useEffect(() => {
    if (timerRef.current && frameRate !== undefined) {
      // Dynamically update fps on the existing timer instance
      (timerRef.current as unknown as Record<string, unknown>).fps = frameRate;
    }
  }, [frameRate]);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        timerRef.current?.play();
      },
      pause: () => {
        timerRef.current?.pause();
      },
      resume: () => {
        timerRef.current?.resume();
      },
      restart: () => {
        timerRef.current?.restart();
      },
      reverse: () => {
        timerRef.current?.reverse();
      },
      alternate: () => {
        timerRef.current?.alternate();
      },
      complete: () => {
        timerRef.current?.complete();
      },
      reset: () => {
        timerRef.current?.reset();
      },
      cancel: () => {
        timerRef.current?.cancel();
      },
      seek: (time: number | string) => {
        timerRef.current?.seek(time);
      },
      stretch: (newDuration: number) => {
        timerRef.current?.stretch(newDuration);
      },
      setPlaybackRate: (rate: number) => {
        if (timerRef.current) {
          (
            timerRef.current as unknown as Record<string, unknown>
          ).playbackRate = rate;
        }
      },
      setFrameRate: (fps: number) => {
        if (timerRef.current) {
          (timerRef.current as unknown as Record<string, unknown>).fps = fps;
        }
      },
    }),
    [],
  );

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    controls,
    state: timerState,
    timer: timerRef.current,
    isRunning: !timerState.paused && timerState.began && !timerState.completed,
    isReady,
  };
}

export default useAnimeTimer;
