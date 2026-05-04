import React, { useRef } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { DemoSection } from "../DemoSection";

const TimelineSyncDemo: React.FC = () => {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  // Child timeline
  const { timeline: childTimeline } = useAnimeTimeline({ autoplay: false }, [
    { targets: box2Ref, translateX: 200, duration: 1000, ease: "linear" },
    { targets: box2Ref, rotate: 180, duration: 1000, ease: "linear" },
  ]);

  // Parent timeline
  const { controls } = useAnimeTimeline({ autoplay: false }, [
    { targets: box1Ref, translateX: 200, duration: 1000, ease: "linear" },
    // Sync the child timeline at the start (offset 0)
    { target: childTimeline, position: 0 } as any,
  ]);

  return (
    <DemoSection title="timeline.sync()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Synchronizes another timeline or WAAPI animation with the current
          timeline. Both animations will play in sync.
        </p>
        <div className="space-y-4">
          <div className="h-16 bg-slate-800/50 rounded-lg flex items-center px-6">
            <div
              ref={box1Ref}
              className="w-8 h-8 bg-blue-500 rounded shadow-lg"
            />
            <span className="ml-4 text-xs text-slate-500">Parent Timeline</span>
          </div>
          <div className="h-16 bg-slate-800/50 rounded-lg flex items-center px-6">
            <div
              ref={box2Ref}
              className="w-8 h-8 bg-emerald-500 rounded shadow-lg"
            />
            <span className="ml-4 text-xs text-slate-500">
              Synced Child Timeline
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => controls.play()}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Play Synced
          </button>
          <button
            onClick={() => controls.restart()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Restart
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          timeline.sync(otherTimeline, 0)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineSyncDemo;
