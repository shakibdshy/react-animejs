/**
 * ScopeRefreshDemo - refresh method demonstration
 *
 * Shows how to use AnimeScope component with ref to call refresh().
 * Useful when DOM elements change or when you need to re-initialize animations.
 *
 * @see https://animejs.com/documentation/scope/scope-methods/refresh
 */

import React, { useCallback, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { AnimeScope } from "../../../components/AnimeScope";
import type { AnimeScopeRef } from "../../../components/AnimeScope";
import { animate } from "animejs";
import { Minus, Plus, RefreshCw } from "lucide-react";

export const ScopeRefreshDemo: React.FC = () => {
  const [boxCount, setBoxCount] = useState(3);
  const [refreshCount, setRefreshCount] = useState(0);
  const scopeRef = useRef<AnimeScopeRef>(null);

  // Generate box colors
  const colors = [
    { from: "#ffd11a", to: "#ff8c00", shadow: "#ffd11a" },
    { from: "#06b6d4", to: "#0891b2", shadow: "cyan-500" },
    { from: "#8b5cf6", to: "#7c3aed", shadow: "violet-500" },
    { from: "#10b981", to: "#059669", shadow: "emerald-500" },
    { from: "#f59e0b", to: "#d97706", shadow: "amber-500" },
    { from: "#ec4899", to: "#d946ef", shadow: "pink-500" },
  ];

  const handleRefresh = useCallback(() => {
    scopeRef.current?.refresh();
    setRefreshCount((c) => c + 1);
  }, []);

  const handleAddBox = useCallback(() => {
    if (boxCount < 6) {
      setBoxCount((c) => c + 1);
      // Refresh to pick up new element
      setTimeout(handleRefresh, 50);
    }
  }, [boxCount, handleRefresh]);

  const handleRemoveBox = useCallback(() => {
    if (boxCount > 1) {
      setBoxCount((c) => c - 1);
      // Refresh to update animations
      setTimeout(handleRefresh, 50);
    }
  }, [boxCount, handleRefresh]);

  const handleRevert = useCallback(() => {
    scopeRef.current?.revert();
    setBoxCount(3);
    setRefreshCount(0);
  }, []);

  return (
    <DemoCard
      title="refresh method (Component)"
      description="Using AnimeScope component with ref to call refresh() - re-run all constructors to pick up DOM changes."
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleAddBox}
            disabled={boxCount >= 6}
            className="flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={12} />
            Add
          </button>
          <button
            onClick={handleRemoveBox}
            disabled={boxCount <= 1}
            className="flex items-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={12} />
            Remove
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2 py-1 bg-[#ffd11a]/20 hover:bg-[#ffd11a]/30 border border-[#ffd11a]/30 rounded-lg text-[#ffd11a] text-xs transition-all"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      }
      controls={{
        restart: handleRevert,
      }}
      code={`// Using ref to access scope methods
const scopeRef = useRef<AnimeScopeRef>(null);

<AnimeScope ref={scopeRef} animate={() => { ... }}>
  {children}
</AnimeScope>

// Call refresh via ref
scopeRef.current?.refresh();`}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* AnimeScope component with ref */}
        <AnimeScope
          ref={scopeRef}
          // animate runs when boxCount changes (via deps)
          animate={() => {
            // Animate all boxes with stagger
            for (let i = 0; i < boxCount; i++) {
              animate(`.refresh-box-${i}`, {
                translateX: [0, 60],
                rotate: [0, 180],
                scale: [1, 1.1],
                duration: 1200,
                loop: true,
                alternate: true,
                delay: i * 150,
                ease: "inOutQuad",
              });
            }

            return () => {
              console.log("[ScopeRefreshDemo] Cleanup");
            };
          }}
          // Re-run when boxCount changes
          deps={[boxCount]}
        >
          {/* Animated elements */}
          <div className="flex gap-3 items-center min-h-20 flex-wrap justify-center">
            {Array.from({ length: boxCount }).map((_, i) => (
              <div
                key={i}
                className={`refresh-box-${i} w-10 h-10 rounded-xl bg-linear-to-br shadow-lg`}
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${colors[i].from}, ${colors[i].to})`,
                  boxShadow: `0 10px 15px -3px ${colors[i].from}30`,
                }}
              />
            ))}
          </div>
        </AnimeScope>

        {/* Stats */}
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Elements:</span>
            <span className="font-mono text-[#ffd11a]">{boxCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Refreshes:</span>
            <span className="font-mono text-cyan-400">{refreshCount}</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-[10px] text-slate-500 text-center max-w-sm">
          Add or remove elements, then click <span className="text-[#ffd11a]">Refresh</span> to
          re-run constructors and pick up the DOM changes.
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeRefreshDemo;
