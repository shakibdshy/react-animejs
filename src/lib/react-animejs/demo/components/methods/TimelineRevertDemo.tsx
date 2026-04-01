import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelineRevertDemo: React.FC = () => {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  const { controls, state } = useAnimeTimeline(
    {
      autoplay: false,
    },
    [
      {
        targets: [box1Ref, box2Ref],
        translateX: 200,
        rotate: "2turn",
        backgroundColor: "#ef4444",
        borderRadius: "50%",
        duration: 2000,
        ease: "inOutQuad",
      },
    ],
  );

  return (
    <DemoSection title="timeline.revert()">
      <div className="space-y-6 w-full">
        <p className="text-sm text-slate-400">
          Reverts the timeline to its initial state and removes all styles
          applied by the animation. Unlike <code>reset()</code>, it completely
          undoes the animation's impact on the DOM.
        </p>

        <div className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-4">
            <div
              ref={box1Ref}
              className="w-12 h-12 bg-blue-500 rounded-lg shadow-lg"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Target 1
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              ref={box2Ref}
              className="w-12 h-12 bg-emerald-500 rounded-lg shadow-lg"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Target 2
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => controls.play()}
            disabled={state.began && !state.paused}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Play Animation
          </button>
          <button
            onClick={() => controls.revert()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Revert All
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          // Undoes everything and clears styles
          <br />
          controls.revert()
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineRevertDemo;
