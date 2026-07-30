import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";
import { DemoSection } from "../DemoSection";

const TimelineInitDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Timeline with targets that start off-screen or hidden
  const { controls } = useAnimeTimeline({ autoplay: false }, [
    { targets: boxRef, translateX: [200, 0], opacity: [0, 1], duration: 1000 },
  ]);

  const handleInit = () => {
    controls.init();
    setInitialized(true);
  };

  return (
    <DemoSection title="timeline.init()">
      <div className="space-y-6">
        <p className="text-sm text-demo-text-secondary">
          Manually initializes the values of all elements in a timeline. By
          default, children are initialized when the playhead reaches them.
          init() forces an immediate render of initial states.
        </p>
        <div className="h-24 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl flex items-center px-6">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg shadow-yellow-500/20"
            style={{ opacity: 0 }} // Intentionally hidden initially
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleInit}
            disabled={initialized}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              initialized
                ? "bg-demo-card text-demo-text-muted"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {initialized ? "Initialized" : "Force Initialize (init)"}
          </button>
          <button
            onClick={() => controls.play()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Play Animation
          </button>
          <button
            onClick={() => {
              controls.revert();
              setInitialized(false);
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>

        <div className="text-xs text-demo-text-secondary font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          controls.init() // Forces elements to start values
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineInitDemo;
