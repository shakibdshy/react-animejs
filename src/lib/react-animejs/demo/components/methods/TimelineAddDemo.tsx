import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelineAddDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const { controls } = useAnimeTimeline(
    {
      autoplay: false,
    },
    [], // Start empty
  );

  const handleAddAnimation = () => {
    controls.add({
      targets: boxRef,
      translateX: [0, 200],
      duration: 1000,
      ease: "out-expo",
    });
    controls.play();
  };

  return (
    <DemoSection title="timeline.add()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Adds a new animation, timer, or callback to the timeline. This demo
          starts with an empty timeline and adds an animation dynamically.
        </p>
        <div className="h-20 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl flex items-center px-6 relative overflow-hidden">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg shadow-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddAnimation}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Add & Play Animation
          </button>
          <button
            onClick={() => controls.reset()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          controls.add(&#123; targets: boxRef, translateX: 200 &#125;)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineAddDemo;
