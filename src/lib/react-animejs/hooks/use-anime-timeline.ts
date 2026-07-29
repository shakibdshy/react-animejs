/**
 * useAnimeTimeline - Timeline hook for sequencing animations
 *
 * Provides a way to create sequenced animations with precise timing control.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createTimeline } from "animejs";
import type {
  AnimationState,
  Timeline,
  TimelineControls,
  TimelineEntry,
  UseAnimeTimelineOptions,
  UseAnimeTimelineReturn,
} from "../types";
import {
  appendTimelineEntry,
  buildCallbackConfig,
  cleanUndefinedValues,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  resolveScopedTarget,
  safeJsonStringify,
  useScopeContext,
} from "../core";
import { useDependencySignal } from './use-dependency-signal';
import { useLatestRef } from './use-latest-ref';

function resolveSyncTarget(target: unknown) {
  if (
    target &&
    typeof target === "object" &&
    "current" in target &&
    "current" in (target as { current?: unknown })
  ) {
    return (target as { current: unknown }).current ?? null;
  }

  return target;
}

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

  const scopeContext = useScopeContext();

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

  const depsSignal = useDependencySignal(deps);
  const latestCallbacksRef = useLatestRef({
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
  });
  const latestOptionsRef = useLatestRef({
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
    entries,
  });
  const { rootRef: scopeRootRef, isScoped, registerCleanup } = scopeContext;

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
    let unregisterScopedCleanup: (() => void) | undefined;

    if (!enabled) {
      setIsReady(false);
      return;
    }

    try {
      const currentOptions = latestOptionsRef.current;
      // Build timeline config
      const config: Record<string, unknown> = {
        delay: currentOptions.delay,
        duration: currentOptions.duration,
        loop: currentOptions.loop,
        loopDelay: currentOptions.loopDelay,
        alternate: currentOptions.alternate,
        reversed: currentOptions.reversed,
        autoplay: currentOptions.autoplay,
        frameRate: currentOptions.frameRate,
        playbackRate: currentOptions.playbackRate,
        playbackEase: currentOptions.playbackEase,
        persist: currentOptions.persist,
        defaults: currentOptions.defaults,
      };

      // Wrap callbacks with state updates
      const callbackConfig = buildCallbackConfig(
        setTimelineState,
        extractAnimationState,
        {
          onBegin: (timeline) => latestCallbacksRef.current.onBegin?.(timeline),
          onComplete: (timeline) => latestCallbacksRef.current.onComplete?.(timeline),
          onUpdate: (timeline) => latestCallbacksRef.current.onUpdate?.(timeline),
          onRender: (timeline) => latestCallbacksRef.current.onRender?.(timeline),
          onBeforeUpdate: (timeline) =>
            latestCallbacksRef.current.onBeforeUpdate?.(timeline),
          onLoop: (timeline) => latestCallbacksRef.current.onLoop?.(timeline),
          onPause: (timeline) => latestCallbacksRef.current.onPause?.(timeline),
        },
        DEFAULT_ANIMATION_STATE,
      );

      // Merge into config
      Object.assign(config, callbackConfig);

      // Clean undefined values
      cleanUndefinedValues(config);

      // Create timeline
       
      const timeline = createTimeline(config as any) as unknown as Timeline;
      timelineRef.current = timeline;

      // Add entries through the same dispatcher used by controls.add().
      currentOptions.entries.forEach((entry) =>
        appendTimelineEntry(timeline, entry, undefined, scopeRootRef.current),
      );

      entriesAddedRef.current = true;

      // Update initial state
      setTimelineState(extractAnimationState(timeline));
      setIsReady(true);

      // Register cleanup with parent scope
      if (isScoped) {
        unregisterScopedCleanup = registerCleanup(() => {
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
      unregisterScopedCleanup?.();
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
  }, [
    enabled,
    optionsJson,
    entriesJson,
    scopeRootRef,
    isScoped,
    registerCleanup,
    depsSignal,
    latestOptionsRef,
    latestCallbacksRef,
  ]);

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

      appendTimelineEntry(
        timelineRef.current,
        entry,
        position,
        scopeRootRef.current,
      );
    },
    [scopeRootRef],
  );

  /**
   * Sync another timeline or WAAPI animation
   */
  const sync = useCallback(
    (target: Timeline | unknown, position?: number | string) => {
      const syncTarget = resolveSyncTarget(target);

      if (!syncTarget) return;

      timelineRef.current?.sync(syncTarget, position);
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
      const resolvedTarget = resolveScopedTarget(
        targets,
        scopeRootRef.current,
      );
      if (!resolvedTarget) return;

      // If no position specified, use current time to ensure it applies now
      const pos = position ?? timelineRef.current.currentTime;

      timelineRef.current.set(resolvedTarget as any, parameters, pos);

      // Force a render by seeking to the current time
      timelineRef.current.seek(timelineRef.current.currentTime);

      setTimelineState(extractAnimationState(timelineRef.current));
    },
    [scopeRootRef],
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
        resolved =
          resolveScopedTarget(targetsOrInstance, scopeRootRef.current) ||
          targetsOrInstance;
      }

      timelineRef.current.remove(resolved, propertyOrPosition);
      setTimelineState(extractAnimationState(timelineRef.current));
    },
    [scopeRootRef],
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
  // Dynamic playbackRate / frameRate updates
  // ==========================================================================

  // Dynamically update speed/fps on the existing timeline instance.
  // NOTE: anime.js v4 accepts `playbackRate`/`frameRate` only as constructor
  // parameters; the live instance setters are `speed` and `fps` (defined on
  // Clock, the base of Timer, which Timeline extends).
  useEffect(() => {
    if (timelineRef.current && playbackRate !== undefined) {
      (timelineRef.current as unknown as Record<string, unknown>).speed =
        playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (timelineRef.current && frameRate !== undefined) {
      (timelineRef.current as unknown as Record<string, unknown>).fps =
        frameRate;
    }
  }, [frameRate]);

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
          // anime.js v4's live setter is `speed` (Clock), not `playbackRate`
          // (which is accepted only as a constructor parameter).
          (timelineRef.current as unknown as Record<string, unknown>).speed =
            rate;
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
