import React from "react";
import { DemoSection } from "./DemoSection";
import { AlternatingTimerDemo } from "./AlternatingTimerDemo";
import { ReversedTimerDemo } from "./ReversedTimerDemo";
import { DelayTimerDemo } from "./DelayTimerDemo";
import { TimerCallbacksDemo } from "./TimerCallbacksDemo";
import { TimerMethodsDemo } from "./TimerMethodsDemo";
import { TimerPropertiesDemo } from "./TimerPropertiesDemo";
import { TimePositionDemo } from "./TimePositionDemo";
import { HighFidelityTimePosition } from "./HighFidelityTimePosition";
import { AdvancedTimerDemo } from "./AdvancedTimerDemo";

export const TimersGroup: React.FC = () => {
  return (
    <DemoSection title="Standalone Timers" frameChildren={false} codeId={false}>
      <AdvancedTimerDemo />
      <AlternatingTimerDemo />
      <ReversedTimerDemo />
      <DelayTimerDemo />
      <TimerCallbacksDemo />
      <TimerMethodsDemo />
      <TimerPropertiesDemo />
      <TimePositionDemo />
      <HighFidelityTimePosition />
    </DemoSection>
  );
};
