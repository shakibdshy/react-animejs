import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { DemoSection } from "../DemoSection";

const TimelineCallDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [msg, ...prev].slice(0, 3));
  };

  const { controls } = useAnimeTimeline({ autoplay: false }, [
    { targets: boxRef, translateX: 100, duration: 500 },
    {
      callback: () => addLog("Step 1 complete!"),
      position: "+=0",
    },
    { targets: boxRef, translateY: 50, duration: 500 },
    {
      callback: () => addLog("Step 2 complete!"),
      position: "+=0",
    },
  ]);

  return (
    <DemoSection title="timeline.call()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Executes a function at a specific position in the timeline. Perfect
          for triggering non-animation logic between steps.
        </p>
        <div className="h-24 bg-linear-to-r from-slate-800 to-slate-900 rounded-xl flex items-center px-6 gap-6">
          <div
            ref={boxRef}
            className="w-10 h-10 bg-linear-to-br from-pink-400 to-pink-600 rounded shadow-lg"
          />
          <div className="flex-1 bg-black/30 rounded p-2 h-full overflow-hidden">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              Execution Log
            </div>
            {log.map((msg, i) => (
              <div key={i} className="text-xs text-pink-400 font-mono">
                &rsaquo; {msg}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setLog([]);
              controls.restart();
            }}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Restart & Call
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          timeline.call(() =&gt; console.log('Hi!'))
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineCallDemo;
