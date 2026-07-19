import React from "react";
import { DemoSection } from "./DemoSection";
import { SvgUtilitiesDemo } from "./SvgUtilitiesDemo";

export const SvgFeaturesGroup: React.FC = () => {
  return (
    <DemoSection title="Advanced SVG Utilities">
      <SvgUtilitiesDemo />
    </DemoSection>
  );
};

export default SvgFeaturesGroup;
