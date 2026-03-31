/**
 * useAnimeTimer - Timer hook for React
 *
 * A React-friendly replacement for setTimeout/setInterval that stays
 * synchronized with anime.js animations.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createTimer } from "animejs";
import type {
  AnimationState,
  PlaybackControls,
  Timer,
  UseAnimeTimerOptions,
  UseAnimeTimerReturn,
} from "../types";
import {
  createSafeCallback,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  safeJsonStringify,
  useAnimeScope,
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

  // Display refs for auto-update functionality
  const countDisplayRef = useRef<HTMLSpanElement>(null);
  const iterationTimeDisplayRef = useRef<HTMLSpanElement>(null);

  // Internal tracking refs
  const loopCountRef = useRef(0);
  const iterationTimeRef = useRef(0);
  const isMountedRef = useRef(false);

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
  const [isMounted, setIsMounted] = useState(false);

  const [trackedCount, setTrackedCount] = useState(0);
  const [trackedIterationTime, setTrackedIterationTime] = useState(0);

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
    onRender,
    onBeforeUpdate,
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
    playbackEase,
    persist,

    // Tracking options
    trackLoopCount = false,
    trackIterationTime = false,
    autoUpdateRefs = false,
  } = options;

  // ==========================================================================
  // Mount State Management
  // ==========================================================================

  useEffect(() => {
    isMountedRef.current = true;
    setIsMounted(true);

    return () => {
      isMountedRef.current = false;
      setIsMounted(false);
    };
  }, []);

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
        playbackEase,
        persist,
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
      playbackEase,
      persist,
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
        playbackEase,
        persist,
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

        if (trackIterationTime) {
          const time = timer.iterationCurrentTime ?? timer.iterationTime ?? timer.currentTime ?? 0;
          iterationTimeRef.current = time;
          setTrackedIterationTime(Math.round(time));

          if (autoUpdateRefs && iterationTimeDisplayRef.current) {
            iterationTimeDisplayRef.current.textContent = String(Math.round(time));
          }
        }

        createSafeCallback(onUpdate, "onUpdate")?.(timer);
      };

      config.onRender = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));
        createSafeCallback(onRender, "onRender")?.(timer);
      };

      config.onBeforeUpdate = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));
        createSafeCallback(onBeforeUpdate, "onBeforeUpdate")?.(timer);
      };

      config.onLoop = (timer: Timer) => {
        setTimerState(extractAnimationState(timer));

        if (trackLoopCount) {
          loopCountRef.current += 1;
          setTrackedCount(loopCountRef.current);

          if (autoUpdateRefs && countDisplayRef.current) {
            countDisplayRef.current.textContent = String(loopCountRef.current);
          }
        }

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

  const resetTracking = () => {
    loopCountRef.current = 0;
    iterationTimeRef.current = 0;
    setTrackedCount(0);
    setTrackedIterationTime(0);

    if (countDisplayRef.current) {
      countDisplayRef.current.textContent = "0";
    }

    if (iterationTimeDisplayRef.current) {
      iterationTimeDisplayRef.current.textContent = "0";
    }
  };

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        if (timerRef.current) {
          timerRef.current.play();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      pause: () => {
        if (timerRef.current) {
          timerRef.current.pause();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      resume: () => {
        if (timerRef.current) {
          timerRef.current.resume();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      restart: () => {
        if (timerRef.current) {
          timerRef.current.restart();
          resetTracking();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      reverse: () => {
        if (timerRef.current) {
          timerRef.current.reverse();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      alternate: () => {
        if (timerRef.current) {
          timerRef.current.alternate();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      complete: () => {
        if (timerRef.current) {
          timerRef.current.complete();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      reset: () => {
        if (timerRef.current) {
          timerRef.current.reset();
          resetTracking();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      cancel: () => {
        if (timerRef.current) {
          timerRef.current.cancel();
          resetTracking();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      revert: () => {
        if (timerRef.current) {
          timerRef.current.revert();
          resetTracking();
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      seek: (time: number | string) => {
        if (timerRef.current) {
          timerRef.current.seek(time);
          setTimerState(extractAnimationState(timerRef.current));
        }
      },
      stretch: (newDuration: number) => {
        timerRef.current?.stretch(newDuration);
      },
      refresh: () => {
        timerRef.current?.refresh();
        if (timerRef.current) {
          setTimerState(extractAnimationState(timerRef.current));
        }
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
    count: trackedCount,
    iterationTime: trackedIterationTime,
    countRef: countDisplayRef,
    iterationTimeRef: iterationTimeDisplayRef,
    isMounted,
  };
}

export default useAnimeTimer;
