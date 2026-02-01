import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelineSetDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const { controls } = useAnimeTimeline({ autoplay: false }, []);

  const handleSetValues = () => {
    controls.set(boxRef, {
      translateX: Math.random() * 200,
      rotate: Math.random() * 360,
      scale: 0.5 + Math.random(),
    });
  };

  return (
    <DemoSection title="timeline.set()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Immediately sets values to targets without animation. Similar to add()
          but with zero duration.
        </p>
        <div className="h-24 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl flex items-center px-6">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-linear-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSetValues}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Set Random Values
          </button>
          <button
            onClick={() => controls.revert()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Revert
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          controls.set(targets, &#123; translateX: 100 &#125;)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineSetDemo;
