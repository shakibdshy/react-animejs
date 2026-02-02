import React from "react";
import { DemoSection } from "./DemoSection";
import {
  ScopeBasicDemo,
  ScopeDefaultsDemo,
  ScopeMediaQueriesDemo,
  ScopeMethodsDemo,
  ScopeRevertDemo,
} from "./scope";

export const ScopeGroup: React.FC = () => {
  return (
    <DemoSection title="Scope">
      <ScopeBasicDemo />
      <ScopeMediaQueriesDemo />
      <ScopeDefaultsDemo />
      <ScopeMethodsDemo />
      <ScopeRevertDemo />
    </DemoSection>
  );
};

export default ScopeGroup;
