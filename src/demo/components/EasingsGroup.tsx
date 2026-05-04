import React from "react";
import { DemoSection } from "./DemoSection";
import { CubicBezierEasingDemo } from "./easings/CubicBezierEasingDemo";
import { LinearEasingDemo } from "./easings/LinearEasingDemo";
import { StepsEasingDemo } from "./easings/StepsEasingDemo";
import { IrregularEasingDemo } from "./easings/IrregularEasingDemo";
import { SpringEasingDemo } from "./easings/SpringEasingDemo";

/**
 * Easings Group - Demos for all anime.js easing functions
 */
export const EasingsGroup: React.FC = () => {
  return (
    <DemoSection title="Easings">
      <CubicBezierEasingDemo />
      <LinearEasingDemo />
      <StepsEasingDemo />
      <IrregularEasingDemo />
      <SpringEasingDemo />
    </DemoSection>
  );
};
