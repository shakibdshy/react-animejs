import React from "react";
import { DemoSection } from "./DemoSection";
import {
  TimelineOnBeginDemo,
  TimelineOnCompleteDemo,
  TimelineOnBeforeUpdateDemo,
  TimelineOnUpdateDemo,
  TimelineOnRenderDemo,
  TimelineOnLoopDemo,
  TimelineOnPauseDemo,
  TimelineThenDemo,
} from "./callbacks";

export const CallbacksGroup: React.FC = () => {
  return (
    <DemoSection title="Timeline: Callbacks">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TimelineOnBeginDemo />
        <TimelineOnCompleteDemo />
        <TimelineOnUpdateDemo />
        <TimelineOnRenderDemo />
        <TimelineOnBeforeUpdateDemo />
        <TimelineOnLoopDemo />
        <TimelineOnPauseDemo />
        <TimelineThenDemo />
      </div>
    </DemoSection>
  );
};
