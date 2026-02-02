/**
 * ScopeRevertDemo - Batch revert demonstration
 *
 * Shows how scope.revert() cleans up all animations and
 * calls cleanup functions in batch.
 */

import React, { useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "../../../hooks/use-anime-scope";
import { animate } from "animejs";
import { RotateCcw, Play, Trash2 } from "lucide-react";

export const ScopeRevertDemo: React.FC = () => {
  const [status, setStatus] = useState<
    "idle" | "animating" | "reverted" | "cleaned"
  >("idle");
  const [animationCount, setAnimationCount] = useState(0);
  const [key, setKey] = useState(0);

  const { ref, isReady, add, revert } = useAnimeScope();

  const startAnimations = () => {
    if (!isReady) return;

    setStatus("animating");
    setAnimationCount(0);

    add(() => {
      // Create multiple animations
      animate(".revert-box-1", {
        translateX: [0, 100],
        rotate: 360,
        duration: 2000,
        loop: true,
        alternate: true,
        onBegin: () => setAnimationCount((c) => c + 1),
      });

      animate(".revert-box-2", {
        translateY: [0, 50],
        scale: [1, 1.2],
        duration: 1500,
        loop: true,
        alternate: true,
        delay: 200,
        onBegin: () => setAnimationCount((c) => c + 1),
      });

      animate(".revert-box-3", {
        translateX: [0, -50],
        borderRadius: ["12px", "50%"],
        duration: 1800,
        loop: true,
        alternate: true,
        delay: 400,
        onBegin: () => setAnimationCount((c) => c + 1),
      });

      // Cleanup function called when revert() is invoked
      return () => {
        setStatus("cleaned");
        console.log("[ScopeRevertDemo] All animations cleaned up!");
      };
    });
  };

  const handleRevert = () => {
    revert();
    setStatus("reverted");
    setAnimationCount(0);
  };

  const handleReset = () => {
    setKey((k) => k + 1);
    setStatus("idle");
    setAnimationCount(0);
  };

  return (
    <DemoCard
      title="batch revert"
      description="Use revert() to clean up all animations in the scope at once. Cleanup functions are also called."
      actions={
        <div className="flex gap-2">
          {status === "idle" ||
          status === "reverted" ||
          status === "cleaned" ? (
            <button
              onClick={startAnimations}
              className="flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-xs transition-all"
            >
              <Play size={12} />
              Start
            </button>
          ) : (
            <button
              onClick={handleRevert}
              className="flex items-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs transition-all"
            >
              <Trash2 size={12} />
              Revert
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      }
      code={`scope.revert() // Cleans up all animations`}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        key={key}
        className="w-full flex flex-col items-center gap-6"
      >
        {/* Animated elements */}
        <div className="flex gap-6 items-center min-h-[80px]">
          <div className="revert-box-1 w-12 h-12 rounded-xl bg-linear-to-br from-[#f59e0b] to-[#d97706] shadow-lg shadow-amber-500/30" />
          <div className="revert-box-2 w-10 h-10 rounded-xl bg-linear-to-br from-[#8b5cf6] to-[#7c3aed] shadow-lg shadow-violet-500/30" />
          <div className="revert-box-3 w-8 h-8 rounded-xl bg-linear-to-br from-[#06b6d4] to-[#0891b2] shadow-lg shadow-cyan-500/30" />
        </div>

        {/* Status display */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Status:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                status === "idle"
                  ? "bg-slate-700 text-slate-300"
                  : status === "animating"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : status === "reverted"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Active animations:{" "}
            <span className="text-[#ffd11a]">{animationCount}</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-[10px] text-slate-600 text-center max-w-xs">
          Click <span className="text-green-400">Start</span> to create multiple
          animations, then <span className="text-red-400">Revert</span> to clean
          them all up at once.
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeRevertDemo;
