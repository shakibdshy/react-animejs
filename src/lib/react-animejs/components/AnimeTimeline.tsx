import React, {
  forwardRef,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useAnimeTimeline } from "../hooks";
import { TimelineContext, shallowEqual } from "../core";
import type {
  AnimationState,
  Timeline,
  TimelineControls,
  TimelineEntry,
  UseAnimeTimelineOptions,
} from "../types";

export interface AnimeTimelineRef {
  controls: TimelineControls;
  state: AnimationState;
  timeline: React.RefObject<Timeline | null>;
  isReady: boolean;
  isPlaying: boolean;
  getTimeline: () => Timeline | null;
}

export interface AnimeTimelineProps extends UseAnimeTimelineOptions {
  /**
   * Declarative timeline entries to initialize.
   */
  entries?: TimelineEntry[];

  /**
   * Render static children or a render prop that receives the timeline API.
   */
  children?: ReactNode | ((api: AnimeTimelineRef) => ReactNode);

  /**
   * Called once when the timeline becomes ready.
   */
  onReady?: (api: AnimeTimelineRef) => void;

  /**
   * Called whenever the reactive timeline state *meaningfully* changes.
   *
   * Gated by shallow equality, so it fires on real transitions (begin,
   * complete, pause, reverse, progress milestones you compare) — not on every
   * animation frame. During playback this still emits once per frame because
   * `progress`/`currentTime` change each tick; bind it to a ref or throttle if
   * you drive React state from it.
   */
  onStateChange?: (state: AnimationState) => void;
}

export const AnimeTimeline = forwardRef<AnimeTimelineRef, AnimeTimelineProps>(
  function AnimeTimeline(
    {
      entries = [],
      children,
      onReady,
      onStateChange,
      ...timelineOptions
    },
    ref,
  ) {
    const { controls, state, timeline, isReady, isPlaying } = useAnimeTimeline(
      timelineOptions,
      entries,
    );
    const readyNotifiedRef = useRef(false);

    const refValue = useMemo<AnimeTimelineRef>(
      () => ({
        controls,
        state,
        timeline,
        isReady,
        isPlaying,
        getTimeline: () => timeline.current,
      }),
      [controls, state, timeline, isReady, isPlaying],
    );

    useImperativeHandle(ref, () => refValue, [refValue]);

    useEffect(() => {
      if (isReady && onReady && !readyNotifiedRef.current) {
        onReady(refValue);
        readyNotifiedRef.current = true;
      }
    }, [isReady, onReady, refValue]);

    useEffect(() => {
      if (!timelineOptions.enabled) {
        readyNotifiedRef.current = false;
      }
    }, [timelineOptions.enabled]);

  // Notify on meaningful state changes. Shallow equality suppresses the
  // reference-only updates that `extractAnimationState` produces on internal
  // ticks where nothing observable changed (e.g. a paused timeline re-render).
  const lastNotifiedStateRef = useRef<AnimationState>(state);
  useEffect(() => {
    if (!onStateChange) return;
    if (shallowEqual(lastNotifiedStateRef.current, state)) return;
    lastNotifiedStateRef.current = state;
    onStateChange(state);
  }, [state, onStateChange]);

    const contextValue = useMemo(
      () => ({
        controls,
        state,
        timeline,
        isReady,
        isPlaying,
      }),
      [controls, state, timeline, isReady, isPlaying],
    );

    const renderChildren = () => {
      if (typeof children === "function") {
        return <>{children(refValue)}</>;
      }
      return <>{children ?? null}</>;
    };

    return (
      <TimelineContext.Provider value={contextValue}>
        {renderChildren()}
      </TimelineContext.Provider>
    );
  },
);

export default AnimeTimeline;
