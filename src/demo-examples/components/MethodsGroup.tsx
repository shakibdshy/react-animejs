import React from "react";
import { DemoSection } from "./DemoSection";
import {
  TimelineAddDemo,
  TimelineCallDemo,
  TimelineInitDemo,
  TimelineLabelDemo,
  TimelinePlaybackMethodsDemo,
  TimelinePropertiesDemo,
  TimelineRefreshDemo,
  TimelineRemoveDemo,
  TimelineRevertDemo,
  TimelineSetDemo,
  TimelineStretchDemo,
  TimelineSyncDemo,
} from "./methods";

const MethodsGroup: React.FC = () => {
  return (
    <DemoSection title="Timeline: Methods" frameChildren={false} codeId={false}>
      <TimelinePlaybackMethodsDemo />
      <TimelinePropertiesDemo />
      <TimelineAddDemo />
      <TimelineSetDemo />
      <TimelineSyncDemo />
      <TimelineLabelDemo />
      <TimelineRemoveDemo />
      <TimelineInitDemo />
      <TimelineRefreshDemo />
      <TimelineCallDemo />
      <TimelineStretchDemo />
      <TimelineRevertDemo />
    </DemoSection>
  );
};

export default MethodsGroup;
