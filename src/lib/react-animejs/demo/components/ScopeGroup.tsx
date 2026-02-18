import React from "react";
import { DemoSection } from "./DemoSection";
import {
  // Basic demos
  ScopeBasicDemo,
  ScopeConstructorDemo,
  // Parameter demos
  ScopeRootDemo,
  ScopeDefaultsDemo,
  ScopeMediaQueriesDemo,
  // Method demos
  ScopeMethodsDemo,
  ScopeAddOnceDemo,
  ScopeKeepTimeDemo,
  ScopeRefreshDemo,
  ScopeRevertDemo,
  // Properties demo
  ScopePropertiesDemo,
} from "./scope";

export const ScopeGroup: React.FC = () => {
  return (
    <DemoSection title="Scope">
      {/* Overview */}
      <ScopeConstructorDemo />
      <ScopeBasicDemo />
      
      {/* Parameters */}
      <ScopeRootDemo />
      <ScopeDefaultsDemo />
      <ScopeMediaQueriesDemo />
      
      {/* Methods */}
      <ScopeMethodsDemo />
      <ScopeAddOnceDemo />
      <ScopeKeepTimeDemo />
      <ScopeRefreshDemo />
      <ScopeRevertDemo />
      
      {/* Properties */}
      <ScopePropertiesDemo />
    </DemoSection>
  );
};

export default ScopeGroup;
