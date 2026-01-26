/**
 * useAnimeTimeline - Timeline hook for sequencing animations
 *
 * Provides a way to create sequenced animations with precise timing control.
 */

"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { createTimeline } from "animejs";
import type {
  UseAnimeTimelineOptions,
  UseAnimeTimelineReturn,
  TimelineEntry,
  AnimationState,
  PlaybackControls,
  Timeline,
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

        const { targets, offset, ...animProps } = entry;

        // Resolve target
        let resolvedTarget: unknown = targets;
        if (isRef(targets)) {
          resolvedTarget = targets.current;
        }

        if (!resolvedTarget) return;

        // Add to timeline
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeline.add(resolvedTarget as any, animProps as any, offset);
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
  const add = useCallback((entry: TimelineEntry, offset?: number | string) => {
    if (!timelineRef.current) {
      console.warn(
        "[react-animejs] Cannot add entry: timeline not initialized",
      );
      return;
    }

    const { targets, offset: entryOffset, ...animProps } = entry;

    // Resolve target
    let resolvedTarget: unknown = targets;
    if (isRef(targets)) {
      resolvedTarget = targets.current;
    }

    if (!resolvedTarget) return;

    // Add to timeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timelineRef.current.add(
      resolvedTarget as any,
      animProps as any,
      offset ?? entryOffset,
    );
  }, []);

  /**
   * Add a label to the timeline
   */
  const addLabel = useCallback((label: string, offset?: number | string) => {
    if (!timelineRef.current) {
      console.warn(
        "[react-animejs] Cannot add label: timeline not initialized",
      );
      return;
    }

    timelineRef.current.label(label, offset);
  }, []);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        timelineRef.current?.play();
      },
      pause: () => {
        timelineRef.current?.pause();
      },
      resume: () => {
        timelineRef.current?.resume();
      },
      restart: () => {
        timelineRef.current?.restart();
      },
      reverse: () => {
        timelineRef.current?.reverse();
      },
      alternate: () => {
        timelineRef.current?.alternate();
      },
      complete: () => {
        timelineRef.current?.complete();
      },
      reset: () => {
        timelineRef.current?.reset();
      },
      cancel: () => {
        timelineRef.current?.cancel();
      },
      seek: (time: number | string) => {
        timelineRef.current?.seek(time);
      },
      stretch: (newDuration: number) => {
        timelineRef.current?.stretch(newDuration);
      },
      setPlaybackRate: (rate: number) => {
        if (timelineRef.current) {
          (
            timelineRef.current as unknown as Record<string, unknown>
          ).playbackRate = rate;
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
    state: timelineState,
    timeline: timelineRef.current,
    add,
    addLabel,
    isPlaying:
      !timelineState.paused && timelineState.began && !timelineState.completed,
    isReady,
  };
}

export default useAnimeTimeline;
