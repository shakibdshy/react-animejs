import React from "react";
import { DemoSection } from "./DemoSection";
import {
  TimelineAlternateDemo,
  TimelineAutoplayDemo,
  TimelineDefaultsDemo,
  TimelineDelayDemo,
  TimelineFrameRateDemo,
  TimelineLoopDelayDemo,
  TimelineLoopDemo,
  TimelinePlaybackEaseDemo,
  TimelinePlaybackRateDemo,
  TimelineReversedDemo,
} from "./playback-settings";

/**
 * PlaybackSettingsGroup - A collection of all playback-related demos
 * Groups components under a single "Playback Settings" section.
 */
export const PlaybackSettingsGroup: React.FC = () => {
  return (
    <DemoSection title="Playback Settings">
      <TimelineDefaultsDemo />
      <TimelineDelayDemo />
      <TimelineLoopDemo />
      <TimelineLoopDelayDemo />
      <TimelineAlternateDemo />
      <TimelineReversedDemo />
      <TimelineAutoplayDemo />
      <TimelineFrameRateDemo />
      <TimelinePlaybackRateDemo />
      <TimelinePlaybackEaseDemo />
    </DemoSection>
  );
};
