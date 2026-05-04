import React from "react";
import { DemoSection } from "./DemoSection";
import { LayoutDemo } from "./LayoutDemo";
import { LayoutSettingsDemo } from "./LayoutSettingsDemo";
import { LayoutEnterExitDemo } from "./LayoutEnterExitDemo";
import { LayoutStaggerDemo } from "./LayoutStaggerDemo";
import { LayoutMethodsDemo } from "./LayoutMethodsDemo";
import { AnimeLayoutComponentDemo } from "./AnimeLayoutComponentDemo";

export const LayoutGroup: React.FC = () => {
  return (
    <DemoSection title="Layout Animations">
      <LayoutDemo />
      <LayoutSettingsDemo />
      <LayoutEnterExitDemo />
      <LayoutStaggerDemo />
      <LayoutMethodsDemo />
      <AnimeLayoutComponentDemo />
    </DemoSection>
  );
};
