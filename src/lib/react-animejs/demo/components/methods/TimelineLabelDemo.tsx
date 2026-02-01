import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelineLabelDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const { controls } = useAnimeTimeline({ autoplay: false }, [
    { label: "start", position: 0 },
    { targets: boxRef, translateX: 100, duration: 500 },
    { label: "middle", position: 500 },
    { targets: boxRef, translateY: 50, duration: 500 },
    { label: "end", position: 1000 },
  ]);

  return (
    <DemoSection title="timeline.label()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Adds a label to the timeline at a specific position, which can be used
          as a reference point for other animations or seek operations.
        </p>
        <div className="h-24 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl flex flex-col justify-center px-6 relative">
          <div
            ref={boxRef}
            className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded shadow-lg"
          />
          <div className="absolute top-0 left-6 h-full border-l border-white/10 flex items-start pt-1">
            <span className="text-[10px] text-slate-500 -ml-3">start</span>
          </div>
          <div className="absolute top-0 left-[126px] h-full border-l border-white/10 flex items-start pt-1">
            <span className="text-[10px] text-slate-500 -ml-4">middle</span>
          </div>
          <div className="absolute top-0 left-[226px] h-full border-l border-white/10 flex items-start pt-1">
            <span className="text-[10px] text-slate-500 -ml-3">end</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => controls.seek("start")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs"
          >
            Seek 'start'
          </button>
          <button
            onClick={() => controls.seek("middle")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs"
          >
            Seek 'middle'
          </button>
          <button
            onClick={() => controls.seek("end")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs"
          >
            Seek 'end'
          </button>
          <button
            onClick={() => controls.play()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Play
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          timeline.label('middle', 500)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineLabelDemo;
