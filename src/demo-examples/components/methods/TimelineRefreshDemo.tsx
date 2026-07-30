import React, { useRef } from "react";
import { useAnimeTimeline, utils } from "@shakibdshy/react-animejs";
import { DemoSection } from "../DemoSection";

const TimelineRefreshDemo: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  const { controls } = useAnimeTimeline(
    {
      loop: true,
      onLoop: (self) => self.refresh(),
    },
    [
      {
        targets: circleRef,
        translateX: () => utils.random(0, 200),
        duration: 1000,
        position: 0,
      },
      {
        targets: triangleRef,
        translateX: () => utils.random(0, 200),
        duration: 1000,
        position: 0,
      },
      {
        targets: squareRef,
        translateX: () => utils.random(0, 200),
        duration: 1000,
        position: 0,
      },
    ],
  );

  return (
    <DemoSection title="timeline.refresh()">
      <div className="space-y-6 w-full">
        <p className="text-sm text-demo-text-secondary">
          Recalculates all values in the timeline. Useful for function-based
          values that should change on every loop or manual trigger.
        </p>

        <div className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="h-8 flex items-center">
            <div
              ref={circleRef}
              className="w-8 h-8 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"
            />
          </div>
          <div className="h-8 flex items-center">
            <div
              ref={triangleRef}
              className="w-0 h-0 border-l-16 border-l-transparent border-r-16 border-r-transparent border-b-28 border-b-emerald-500 drop-shadow-lg"
            />
          </div>
          <div className="h-8 flex items-center">
            <div
              ref={squareRef}
              className="w-8 h-8 bg-amber-500 rounded shadow-lg shadow-amber-500/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              controls.refresh();
              controls.restart();
            }}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Refresh & Restart
          </button>
        </div>

        <div className="text-xs text-demo-text-secondary font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          onLoop: self =&gt; self.refresh()
          <br />
          translateX: () =&gt; utils.random(0, 200)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineRefreshDemo;
