import React from "react";
import { DemoSection } from "./DemoSection";
import { AnimatableUnitDemo } from "./animatable/AnimatableUnitDemo";
import { AnimatableDurationDemo } from "./animatable/AnimatableDurationDemo";
import { AnimatableEaseDemo } from "./animatable/AnimatableEaseDemo";
import { AnimatableModifierDemo } from "./animatable/AnimatableModifierDemo";
import { AnimatableGettersDemo } from "./animatable/AnimatableGettersDemo";
import { AnimatableSettersDemo } from "./animatable/AnimatableSettersDemo";
import { AnimatableRevertDemo } from "./animatable/AnimatableRevertDemo";

export const AnimatableGroup: React.FC = () => {
  return (
    <DemoSection title="useAnimatable Hook">
      <AnimatableUnitDemo />
      <AnimatableDurationDemo />
      <AnimatableEaseDemo />
      <AnimatableModifierDemo />
      <AnimatableGettersDemo />
      <AnimatableSettersDemo />
      <AnimatableRevertDemo />
    </DemoSection>
  );
};
