import React from "react";
import { DemoSection } from "./DemoSection";
import { CssSelectorDemo } from "./CssSelectorDemo";
import { JsObjectDemo } from "./JsObjectDemo";
import { ArrayOfTargetsDemo } from "./ArrayOfTargetsDemo";
import { V4FeaturesDemo } from "./V4FeaturesDemo";
import { CallFunctionsDemo } from "./CallFunctionsDemo";

export const CoreFeaturesGroup: React.FC = () => {
  return (
    <DemoSection title="Core Features">
      <CssSelectorDemo />
      <JsObjectDemo />
      <ArrayOfTargetsDemo />
      <V4FeaturesDemo />
      <CallFunctionsDemo />
    </DemoSection>
  );
};
