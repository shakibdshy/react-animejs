import React, { useState } from "react";
import { Grid, PlayCircle, Sliders } from "lucide-react";
import { AnimeLayoutComponentDemo } from "./AnimeLayoutComponentDemo";
import { DemoSection } from "./DemoSection";
import { LayoutDemo } from "./LayoutDemo";
import { LayoutEnterExitDemo } from "./LayoutEnterExitDemo";
import { LayoutMethodsDemo } from "./LayoutMethodsDemo";
import { LayoutSettingsDemo } from "./LayoutSettingsDemo";
import { LayoutStaggerDemo } from "./LayoutStaggerDemo";

export const LayoutGroup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"grid" | "timing" | "transitions">("grid");

  return (
    <DemoSection title="Layout Animations" codeId="layout">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-6 text-landing-muted">
          Explore FLIP layout transitions across grids, timing, enter/exit states, and imperative methods.
        </p>

        <div className="rounded-2xl border border-landing-border bg-landing-surface p-1.5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              onClick={() => setActiveTab("grid")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "grid"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:bg-landing-bg/50 hover:text-landing-fg"
              }`}
            >
              <Grid size={14} />
              Grid transformations
            </button>
            <button
              onClick={() => setActiveTab("timing")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "timing"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:bg-landing-bg/50 hover:text-landing-fg"
              }`}
            >
              <Sliders size={14} />
              Sequence & timing
            </button>
            <button
              onClick={() => setActiveTab("transitions")}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "transitions"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:bg-landing-bg/50 hover:text-landing-fg"
              }`}
            >
              <PlayCircle size={14} />
              Transitions & methods
            </button>
          </div>
        </div>

        {activeTab === "grid" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in">
            <LayoutDemo />
            <AnimeLayoutComponentDemo />
          </div>
        )}
        {activeTab === "timing" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in">
            <LayoutSettingsDemo />
            <LayoutStaggerDemo />
          </div>
        )}
        {activeTab === "transitions" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in">
            <LayoutEnterExitDemo />
            <LayoutMethodsDemo />
          </div>
        )}
      </div>

    </DemoSection>
  );
};

export default LayoutGroup;
