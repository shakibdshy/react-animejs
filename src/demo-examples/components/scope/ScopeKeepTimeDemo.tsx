/**
 * ScopeKeepTimeDemo - keepTime method demonstration
 *
 * Shows how to use AnimeScope component with ref to call keepTime() and refresh().
 * Useful for preserving animation progress when refreshing the scope.
 *
 * @see https://animejs.com/documentation/scope/scope-methods/keeptime
 */

import React, { useCallback, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { AnimeScope } from "@shakibdshy/react-animejs";
import type { AnimeScopeRef } from "@shakibdshy/react-animejs";
import { animate } from "animejs";
import { Clock, RefreshCw } from "lucide-react";

export const ScopeKeepTimeDemo: React.FC = () => {
  const [preserveTime, setPreserveTime] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [progressBefore, setProgressBefore] = useState(0);
  const [progressAfter, setProgressAfter] = useState(0);
  const scopeRef = useRef<AnimeScopeRef>(null);
  const animationRef = useRef<any>(null);

  const handleRefresh = useCallback(() => {
    if (!scopeRef.current) return;

    // Get progress before refresh
    const progress = animationRef.current?.progress ?? 0;
    setProgressBefore(Math.round(progress * 100));

    if (preserveTime) {
      // Keep time before refresh - animation continues from current position
      scopeRef.current.keepTime();
    }

    scopeRef.current.refresh();
    setRefreshCount((c) => c + 1);

    // Get progress after refresh (slightly delayed to allow refresh to complete)
    setTimeout(() => {
      const newProgress = animationRef.current?.progress ?? 0;
      setProgressAfter(Math.round(newProgress * 100));
    }, 50);
  }, [preserveTime]);

  const handleRevert = useCallback(() => {
    scopeRef.current?.revert();
    setRefreshCount(0);
    setProgressBefore(0);
    setProgressAfter(0);
  }, []);

  return (
    <DemoCard
      title="keepTime method (Component)"
      description="Using AnimeScope component with ref to call keepTime() - preserve animation progress when refreshing the scope."
      actions={
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2 text-xs text-demo-text-secondary">
            <input
              type="checkbox"
              checked={preserveTime}
              onChange={(e) => setPreserveTime(e.target.checked)}
              className="accent-demo-accent"
            />
            Keep Time
          </label>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2 py-1 bg-demo-accent/20 hover:bg-demo-accent/30 border border-demo-accent/30 rounded-lg text-demo-accent text-xs transition-all"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      }
      controls={{
        restart: handleRevert,
      }}
      code={`// Preserve time before refresh
scopeRef.current?.keepTime();
scopeRef.current?.refresh();`}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* AnimeScope component with ref */}
        <AnimeScope
          ref={scopeRef}
          mediaQueries={{
            isSmall: "(max-width: 300px)",
          }}
          animate={() => {
            animationRef.current = animate(".keeptime-box", {
              translateX: [0, 200],
              rotate: [0, 360],
              scale: [1, 1.3],
              duration: 3000,
              loop: true,
              alternate: true,
              ease: "inOutQuad",
            });

            return () => {
              animationRef.current = null;
            };
          }}
        >
          {/* Animated element */}
          <div className="w-full flex items-center justify-center min-h-20">
            <div className="keeptime-box w-14 h-14 rounded-xl bg-linear-to-br from-demo-accent to-[#ff8c00] shadow-lg shadow-demo-accent/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-demo-card" />
            </div>
          </div>
        </AnimeScope>

        {/* Progress display */}
        <div className="flex gap-6 text-xs">
          <div className="flex flex-col items-center gap-1">
            <span className="text-demo-text-muted text-[10px] uppercase tracking-wider">
              Before Refresh
            </span>
            <span className="font-mono text-lg text-slate-300">
              {progressBefore}%
            </span>
          </div>
          <div className="flex items-center text-slate-600">{"->"}</div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-demo-text-muted text-[10px] uppercase tracking-wider">
              After Refresh
            </span>
            <span
              className={`font-mono text-lg ${
                preserveTime ? "text-green-400" : "text-red-400"
              }`}
            >
              {progressAfter}%
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-demo-text-muted">Refreshes:</span>
            <span className="font-mono text-demo-accent">{refreshCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-demo-text-muted">Mode:</span>
            <span
              className={`font-mono ${
                preserveTime ? "text-green-400" : "text-red-400"
              }`}
            >
              {preserveTime ? "Preserving time" : "Resetting time"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="text-[10px] text-demo-text-muted text-center max-w-sm">
          {preserveTime ? (
            <>
              With <code className="text-green-400">keepTime()</code>, animation
              continues from current position after refresh.
            </>
          ) : (
            <>
              Without <code className="text-red-400">keepTime()</code>, animation
              resets to beginning on refresh.
            </>
          )}
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeKeepTimeDemo;
