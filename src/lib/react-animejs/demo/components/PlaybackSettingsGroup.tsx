import React from "react";
import {
  TimelineDefaultsDemo,
  TimelineDelayDemo,
  TimelineLoopDemo,
  TimelineLoopDelayDemo,
  TimelineAlternateDemo,
  TimelineReversedDemo,
  TimelineAutoplayDemo,
  TimelineFrameRateDemo,
  TimelinePlaybackRateDemo,
  TimelinePlaybackEaseDemo,
} from "./playback-settings";

/**
 * PlaybackSettingsGroup - A collection of all playback-related demos
 * Groups components under a single "Playback settings" section.
 */
export const PlaybackSettingsGroup: React.FC = () => {
  return (
    <div className="w-full space-y-12 mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-[#ffd11a]/20 to-transparent" />
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
          <span className="w-2 h-8 bg-[#ffd11a] rounded-full" />
          Playback Settings
        </h2>
        <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-[#ffd11a]/20 to-transparent" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
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
      </div>
    </div>
  );
};
