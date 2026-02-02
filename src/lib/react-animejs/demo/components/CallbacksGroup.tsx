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
