/**
 * ScopeMethodsDemo - Registered methods demonstration
 *
 * Shows how to register methods within a scope that can be
 * called from outside the scope.
 */

import React, { useEffect, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "@/lib/react-animejs/hooks/use-anime-scope";
import { animate } from "animejs";

export const ScopeMethodsDemo: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);
  const { ref, isReady, methods, add } = useAnimeScope();

  const addLog = (message: string) => {
    setLog((prev) => [...prev.slice(-4), message]);
  };

  useEffect(() => {
    if (!isReady) return;

    add((self) => {
      // Register methods that can be called from outside the scope
      self.add("pulse", () => {
        addLog("pulse() called");
        animate(".methods-box", {
          scale: [1, 1.3, 1],
          duration: 400,
          ease: "outElastic(1, 0.5)",
        });
      });

      self.add("spin", () => {
        addLog("spin() called");
        animate(".methods-box", {
          rotate: "+=360",
          duration: 600,
          ease: "outExpo",
        });
      });

      self.add("shake", () => {
        addLog("shake() called");
        animate(".methods-box", {
          translateX: [0, -10, 10, -10, 10, 0],
          duration: 400,
          ease: "inOutSine",
        });
      });

      self.add("colorShift", (color: unknown) => {
        addLog(`colorShift('${color}') called`);
        animate(".methods-box", {
          background: color as string,
          duration: 300,
        });
      });

      addLog("Methods registered");
    });
  }, [isReady, add]);

  return (
    <DemoCard
      title="registered methods"
      description="Register methods within the scope that can be called externally via scope.methods"
      code={`self.add('methodName', (args) => { ... })`}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="w-full flex flex-col items-center gap-6"
      >
        {/* Animated element */}
        <div className="methods-box w-16 h-16 rounded-xl bg-linear-to-br from-[#ec4899] to-[#d946ef] shadow-lg shadow-pink-500/30" />

        {/* Method buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => methods.pulse?.()}
            className="px-3 py-1.5 bg-demo-accent/10 hover:bg-demo-accent/20 border border-demo-accent/30 rounded-lg text-demo-accent text-xs font-medium transition-all"
          >
            pulse()
          </button>
          <button
            onClick={() => methods.spin?.()}
            className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs font-medium transition-all"
          >
            spin()
          </button>
          <button
            onClick={() => methods.shake?.()}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-medium transition-all"
          >
            shake()
          </button>
          <button
            onClick={() =>
              methods.colorShift?.(
                ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffd93d"][
                  Math.floor(Math.random() * 5)
                ],
              )
            }
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-medium transition-all"
          >
            colorShift(random)
          </button>
        </div>

        {/* Log output */}
        <div className="w-full max-w-xs bg-black/30 rounded-lg p-3 border border-demo-border">
          <div className="text-[10px] text-demo-text-muted mb-2 uppercase tracking-wider">
            Console
          </div>
          <div className="space-y-1 font-mono text-[11px] max-h-24 overflow-y-auto">
            {log.length === 0 ? (
              <div className="text-slate-600">// Click a method button...</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="text-green-400">
                  → {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeMethodsDemo;
