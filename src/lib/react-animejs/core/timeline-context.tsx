/**
 * Timeline Context - shares the timeline instance with declarative children
 *
 * This context allows child components like <TimelineEntry> to register
 * themselves with the parent <AnimeTimeline> without imperative code.
 */

import { createContext, useContext } from "react";
import type { RefObject } from "react";
import type { Timeline, TimelineControls, AnimationState } from "../types";

export interface TimelineContextValue {
  /**
   * Ref to the timeline instance
   */
  timeline: RefObject<Timeline | null>;

  /**
   * Timeline controls
   */
  controls: TimelineControls;

  /**
   * Current animation state
   */
  state: AnimationState;

  /**
   * Whether the timeline is ready
   */
  isReady: boolean;

  /**
   * Whether the timeline is playing
   */
  isPlaying: boolean;
}

/**
 * React Context for sharing timeline with children
 */
export const TimelineContext = createContext<TimelineContextValue | null>(null);

/**
 * Hook to access the parent timeline context
 *
 * @returns The timeline context value
 * @throws If called outside of an AnimeTimeline provider
 *
 * @example
 * ```tsx
 * function MyEntry() {
 *   const { timeline, controls } = useTimelineContext();
 *   // Use timeline.current to add animations
 * }
 * ```
 */
export function useTimelineContext(): TimelineContextValue {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(
      "useTimelineContext must be used within an <AnimeTimeline> component",
    );
  }
  return context;
}

/**
 * Hook to access the parent timeline context safely (returns null if not in context)
 */
export function useTimelineContextSafe(): TimelineContextValue | null {
  return useContext(TimelineContext);
}
