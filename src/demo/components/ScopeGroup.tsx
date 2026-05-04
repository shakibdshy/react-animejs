import React from "react";
import { DemoSection } from "./DemoSection";
import {
  ScopeAddOnceDemo,
  // Basic demos
  ScopeBasicDemo,
  ScopeConstructorDemo,
  ScopeDefaultsDemo,
  ScopeKeepTimeDemo,
  ScopeMediaQueriesDemo,
  // Method demos
  ScopeMethodsDemo,
  // Properties demo
  ScopePropertiesDemo,
  ScopeRefreshDemo,
  ScopeRevertDemo,
  // Parameter demos
  ScopeRootDemo,
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
