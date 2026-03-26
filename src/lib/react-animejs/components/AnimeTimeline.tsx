import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useAnimeTimeline } from "../hooks";
import type {
  UseAnimeTimelineOptions,
  TimelineEntry,
  TimelineControls,
  Timeline,
  AnimationState,
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
   * Called whenever the reactive timeline state changes.
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

    useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);

    if (typeof children === "function") {
      return <>{children(refValue)}</>;
    }

    return <>{children ?? null}</>;
  },
);

export default AnimeTimeline;
