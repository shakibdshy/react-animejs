import React from "react";
import { DemoSection } from "./DemoSection";
import { MathUtilitiesDemo } from "./MathUtilitiesDemo";
import { RandomUtilitiesDemo } from "./RandomUtilitiesDemo";
import { StringUtilitiesDemo } from "./StringUtilitiesDemo";
import { DOMUtilitiesDemo } from "./DOMUtilitiesDemo";
import { ValueUtilitiesDemo } from "./ValueUtilitiesDemo";

/**
 * Utilities Group - Demos for all animejs utility functions
 */
export const UtilitiesGroup: React.FC = () => {
  return (
    <DemoSection title="Utilities">
      <MathUtilitiesDemo />
      <RandomUtilitiesDemo />
      <StringUtilitiesDemo />
      <DOMUtilitiesDemo />
      <ValueUtilitiesDemo />
    </DemoSection>
  );
};
