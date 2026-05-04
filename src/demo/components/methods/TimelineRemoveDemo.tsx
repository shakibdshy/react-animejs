import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { DemoSection } from "../DemoSection";

const TimelineRemoveDemo: React.FC = () => {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  const { controls } = useAnimeTimeline({ loop: true, autoplay: true }, [
    { targets: box1Ref, translateX: 200, duration: 1000, alternate: true },
    {
      targets: box2Ref,
      translateX: 200,
      duration: 1000,
      alternate: true,
      position: 0,
    },
  ]);

  const handleRemove = () => {
    controls.remove(box1Ref);
    setRemoved(true);
  };

  return (
    <DemoSection title="timeline.remove()">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Removes specific targets or animation instances from the timeline. In
          this demo, clicking 'Remove Blue' will stop its animation while the
          green one continues.
        </p>
        <div className="space-y-3">
          <div className="h-12 bg-slate-800/50 rounded-lg flex items-center px-6">
            <div
              ref={box1Ref}
              className={`w-8 h-8 bg-blue-500 rounded shadow-lg transition-opacity ${removed ? "opacity-50" : ""}`}
            />
            <span className="ml-4 text-xs text-slate-500 italic">
              {removed ? "Removed" : "Active"}
            </span>
          </div>
          <div className="h-12 bg-slate-800/50 rounded-lg flex items-center px-6">
            <div
              ref={box2Ref}
              className="w-8 h-8 bg-emerald-500 rounded shadow-lg"
            />
            <span className="ml-4 text-xs text-slate-500 italic">
              Always Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRemove}
            disabled={removed}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              removed
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Remove Blue Box
          </button>
          <button
            onClick={() => controls.restart()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors text-sm font-medium"
          >
            Restart
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          controls.remove(box1Ref)
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineRemoveDemo;
