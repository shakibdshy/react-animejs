/**
 * useAnimeTimeline - Timeline hook for sequencing animations
 *
 * Provides a way to create sequenced animations with precise timing control.
 */

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { createTimeline } from "animejs";
import type {
  UseAnimeTimelineOptions,
  UseAnimeTimelineReturn,
  TimelineEntry,
  AnimationState,
  TimelineControls,
  Timeline,
} from "../types";
import {
  useAnimeScope,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveTarget,
  createSafeCallback,
  safeJsonStringify,
} from "../core";

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnimeTimeline - Create sequenced animations
 *
 * @param options - Timeline options including playback settings and callbacks
 * @param entries - Array of timeline entries to animate
 * @returns Object containing controls, state, and timeline instance
 *
 * @example
 * ```tsx
 * function Sequence() {
 *   const boxRef = useRef(null);
 *   const circleRef = useRef(null);
 *
 *   const { controls, state } = useAnimeTimeline(
 *     { duration: 2000, loop: true },
 *     [
 *       { targets: boxRef, translateX: 250, offset: 0 },
 *       { targets: circleRef, scale: 2, offset: '+=500' },
 *       { targets: boxRef, rotate: 360, offset: '-=200' },
 *     ]
 *   );
 *
 *   return (
 *     <div>
 *       <div ref={boxRef} className="box" />
 *       <div ref={circleRef} className="circle" />
 *       <button onClick={controls.play}>Play Sequence</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimeTimeline(
  options: UseAnimeTimelineOptions = {},
  entries: TimelineEntry[] = [],
): UseAnimeTimelineReturn {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Timeline instance ref
  const timelineRef = useRef<Timeline | null>(null);

  // Track if we've added entries
  const entriesAddedRef = useRef(false);

  // ==========================================================================
  // Context
  // ==========================================================================

  const scopeContext = useAnimeScope();

  // ==========================================================================
  // State
  // ==========================================================================

  const [timelineState, setTimelineState] = useState<AnimationState>(
    DEFAULT_ANIMATION_STATE,
  );
  const [isReady, setIsReady] = useState(false);

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    deps = [],
    enabled = true,
    defaults,

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
  } = options;

  // ==========================================================================
  // Timeline Lifecycle
  // ==========================================================================

  // Stability for options and entries
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
        frameRate,
        playbackRate,
        playbackEase,
        persist,
        defaults,
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
      playbackEase,
      persist,
      defaults,
    ],
  );
  const entriesJson = useMemo(() => safeJsonStringify(entries), [entries]);

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    try {
      // Build timeline config
      const config: Record<string, unknown> = {
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
        defaults,
      };

      // Wrap callbacks with state updates
      config.onBegin = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onBegin, "onBegin")?.(tl);
      };

      config.onComplete = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onComplete, "onComplete")?.(tl);
      };

      config.onUpdate = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onUpdate, "onUpdate")?.(tl);
      };

      config.onRender = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onRender, "onRender")?.(tl);
      };

      config.onBeforeUpdate = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onBeforeUpdate, "onBeforeUpdate")?.(tl);
      };

      config.onLoop = (tl: Timeline) => {
        setTimelineState(extractAnimationState(tl));
        createSafeCallback(onLoop, "onLoop")?.(tl);
      };

      if (onPause) {
        config.onPause = (tl: Timeline) => {
          setTimelineState(extractAnimationState(tl));
          createSafeCallback(onPause, "onPause")?.(tl);
        };
      }

      // Clean undefined values
      Object.keys(config).forEach((key) => {
        if (config[key] === undefined) {
          delete config[key];
        }
      });

      // Create timeline
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timeline = createTimeline(config as any) as unknown as Timeline;
      timelineRef.current = timeline;

      // Add entries
      entries.forEach((entry) => {
        if (!timeline) return;

        if ("label" in entry) {
          // Label entry
          timeline.label(entry.label, entry.position);
        } else if ("callback" in entry) {
          // Function call
          timeline.call(entry.callback, entry.position);
        } else if ("target" in entry) {
          // Sync timeline/WAAPI
          timeline.sync(entry.target, entry.position);
        } else if ("targets" in entry) {
          // Animation entry
          const { targets, position, ...animProps } = entry;

          // Resolve target
          const resolvedTarget = resolveTarget(targets);

          if (!resolvedTarget) return;

          // Add to timeline
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          timeline.add(resolvedTarget as any, animProps as any, position);
        } else {
          // Timer entry
          const { position, ...timerProps } = entry;
          timeline.add(timerProps as any, position);
        }
      });

      entriesAddedRef.current = true;

      // Update initial state
      setTimelineState(extractAnimationState(timeline));
      setIsReady(true);

      // Register cleanup with parent scope
      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          if (timelineRef.current) {
            try {
              timelineRef.current.revert();
            } catch {
              // Ignore cleanup errors
            }
          }
        });
      }
    } catch (error) {
      console.error("[react-animejs] Timeline creation error:", error);
      setIsReady(false);
    }

    // Cleanup
    return () => {
      if (timelineRef.current) {
        try {
          timelineRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        timelineRef.current = null;
      }
      entriesAddedRef.current = false;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, optionsJson, entriesJson, scopeContext, ...deps]);

  // ==========================================================================
  // Dynamic Methods
  // ==========================================================================

  /**
   * Add an animation entry to the timeline dynamically
   */
  const add = useCallback(
    (entry: TimelineEntry, position?: number | string) => {
      if (!timelineRef.current) {
        console.warn(
          "[react-animejs] Cannot add entry: timeline not initialized",
        );
        return;
      }

      if ("label" in entry) {
        timelineRef.current.label(entry.label, position ?? entry.position);
      } else if ("callback" in entry) {
        timelineRef.current.call(entry.callback, position ?? entry.position);
      } else if ("target" in entry) {
        timelineRef.current.sync(entry.target, position ?? entry.position);
      } else if ("targets" in entry) {
        const { targets, position: entryPos, ...animProps } = entry;

        // Resolve target
        const resolvedTarget = resolveTarget(targets);

        if (!resolvedTarget) return;

        // Add to timeline
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timelineRef.current.add(
          resolvedTarget as any,
          animProps as any,
          position ?? entryPos,
        );
      } else {
        const { position: entryPos, ...timerProps } = entry;
        timelineRef.current.add(timerProps as any, position ?? entryPos);
      }
    },
    [],
  );

  /**
   * Sync another timeline or WAAPI animation
   */
  const sync = useCallback(
    (target: Timeline | unknown, position?: number | string) => {
      timelineRef.current?.sync(target, position);
    },
    [],
  );

  /**
   * Call a function at a specific position
   */
  const call = useCallback(
    (callback: (tl: Timeline) => void, position?: number | string) => {
      timelineRef.current?.call(callback, position);
    },
    [],
  );

  /**
   * Add a label to the timeline
   */
  const label = useCallback((name: string, position?: number | string) => {
    if (!timelineRef.current) {
      console.warn(
        "[react-animejs] Cannot add label: timeline not initialized",
      );
      return;
    }

    timelineRef.current.label(name, position);
  }, []);

  /**
   * Set values of targets at a specific position
   */
  const set = useCallback(
    (targets: any, parameters: any, position?: number | string) => {
      if (!timelineRef.current) return;
      const resolvedTarget = resolveTarget(targets);
      if (!resolvedTarget) return;

      // If no position specified, use current time to ensure it applies now
      const pos = position ?? timelineRef.current.currentTime;

      timelineRef.current.set(resolvedTarget as any, parameters, pos);

      // Force a render by seeking to the current time
      timelineRef.current.seek(timelineRef.current.currentTime);

      setTimelineState(extractAnimationState(timelineRef.current));
    },
    [],
  );

  /**
   * Remove targets or instances from the timeline
   */
  const remove = useCallback(
    (targetsOrInstance: any, propertyOrPosition?: string | number) => {
      if (!timelineRef.current) return;

      let resolved = targetsOrInstance;
      // If it looks like a ref or target, resolve it
      if (
        typeof targetsOrInstance === "string" ||
        (targetsOrInstance &&
          typeof targetsOrInstance === "object" &&
          !("id" in targetsOrInstance))
      ) {
        resolved = resolveTarget(targetsOrInstance) || targetsOrInstance;
      }

      timelineRef.current.remove(resolved, propertyOrPosition);
      setTimelineState(extractAnimationState(timelineRef.current));
    },
    [],
  );

  /**
   * Initialize/Render the timeline state immediately
   */
  const init = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.init();
      setTimelineState(extractAnimationState(timelineRef.current));
    }
  }, []);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: TimelineControls = useMemo(
    () => ({
      play: () => {
        if (timelineRef.current) {
          timelineRef.current.play();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      pause: () => {
        if (timelineRef.current) {
          timelineRef.current.pause();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      resume: () => {
        if (timelineRef.current) {
          timelineRef.current.resume();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      restart: () => {
        if (timelineRef.current) {
          timelineRef.current.restart();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      reverse: () => {
        if (timelineRef.current) {
          timelineRef.current.reverse();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      alternate: () => {
        if (timelineRef.current) {
          timelineRef.current.alternate();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      complete: () => {
        if (timelineRef.current) {
          timelineRef.current.complete();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      reset: () => {
        if (timelineRef.current) {
          timelineRef.current.reset();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      cancel: () => {
        if (timelineRef.current) {
          timelineRef.current.cancel();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      revert: () => {
        if (timelineRef.current) {
          timelineRef.current.revert();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      refresh: () => {
        if (timelineRef.current) {
          timelineRef.current.refresh();
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      seek: (time: number | string) => {
        if (timelineRef.current) {
          timelineRef.current.seek(time);
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      stretch: (newDuration: number) => {
        if (timelineRef.current) {
          timelineRef.current.stretch(newDuration);
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      setPlaybackRate: (rate: number) => {
        if (timelineRef.current) {
          (
            timelineRef.current as unknown as Record<string, unknown>
          ).playbackRate = rate;
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      setFrameRate: (fps: number) => {
        if (timelineRef.current) {
          (timelineRef.current as unknown as Record<string, unknown>).fps = fps;
          setTimelineState(extractAnimationState(timelineRef.current));
        }
      },
      set,
      remove,
      init,
      label,
      add,
      sync,
      call,
    }),
    [set, remove, init, label, add, sync, call],
  );

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    controls,
    state: timelineState,
    // Return the ref so consumers can always access the latest timeline instance
    timeline: timelineRef,
    isPlaying:
      !timelineState.paused && timelineState.began && !timelineState.completed,
    isReady,
  };
}

export default useAnimeTimeline;
