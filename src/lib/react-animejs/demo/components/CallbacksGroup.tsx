import React from "react";
import { DemoSection } from "./DemoSection";
import {
  TimelineOnBeforeUpdateDemo,
  TimelineOnBeginDemo,
  TimelineOnCompleteDemo,
  TimelineOnLoopDemo,
  TimelineOnPauseDemo,
  TimelineOnRenderDemo,
  TimelineOnUpdateDemo,
  TimelineThenDemo,
} from "./callbacks";

export const CallbacksGroup: React.FC = () => {
  return (
    <DemoSection title="Timeline: Callbacks">
      <TimelineOnBeginDemo />
      <TimelineOnCompleteDemo />
      <TimelineOnUpdateDemo />
      <TimelineOnRenderDemo />
      <TimelineOnBeforeUpdateDemo />
      <TimelineOnLoopDemo />
      <TimelineOnPauseDemo />
      <TimelineThenDemo />
    </DemoSection>
  );
};
