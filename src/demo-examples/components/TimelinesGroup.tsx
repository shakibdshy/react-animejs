import React from "react";
import { DemoSection } from "./DemoSection";
import { TimelineAnimationsDemo } from "./TimelineAnimationsDemo";
import { TimelineFeaturesDemo } from "./TimelineFeaturesDemo";
import { TimelineTimersDemo } from "./TimelineTimersDemo";
import { SyncTimelinesDemo } from "./SyncTimelinesDemo";
import { SyncWAAPIAnimationsDemo } from "./SyncWAAPIAnimationsDemo";

export const TimelinesGroup: React.FC = () => {
  return (
    <DemoSection title="Timelines & Syncing" frameChildren={false} codeId={false}>
      <TimelineAnimationsDemo />
      <TimelineFeaturesDemo />
      <TimelineTimersDemo />
      <SyncTimelinesDemo />
      <SyncWAAPIAnimationsDemo />
    </DemoSection>
  );
};
