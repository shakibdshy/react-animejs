import React from "react";
import { DemoSection } from "./DemoSection";
import {
  TimelineAddDemo,
  TimelineSetDemo,
  TimelineSyncDemo,
  TimelineLabelDemo,
  TimelineRemoveDemo,
  TimelineInitDemo,
  TimelineRefreshDemo,
  TimelineCallDemo,
  TimelineStretchDemo,
  TimelineRevertDemo,
  TimelinePlaybackMethodsDemo,
  TimelinePropertiesDemo,
} from "./methods";

const MethodsGroup: React.FC = () => {
  return (
    <DemoSection title="Timeline: Methods">
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
