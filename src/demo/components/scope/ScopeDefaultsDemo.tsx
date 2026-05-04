/**
 * ScopeDefaultsDemo - Shared default parameters demonstration
 *
 * Shows how to use scope defaults to share animation parameters
 * across all animations within the scope.
 */

import React, { useEffect, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "@/lib/react-animejs/hooks/use-anime-scope";
import { animate } from "animejs";

export const ScopeDefaultsDemo: React.FC = () => {
  const [ease, setEase] = useState<string>("outExpo");
  const [duration, setDuration] = useState(800);
  const [key, setKey] = useState(0);

  const { ref, isReady, add } = useAnimeScope({
    defaults: {
      ease: ease,
      duration: duration,
    },
    deps: [ease, duration],
  });

  useEffect(() => {
    if (!isReady) return;

    add(() => {
      // All animations inherit the scope defaults (ease, duration)
      // Individual animations can override these values

      animate(".defaults-box-1", {
        translateX: [0, 150],
        rotate: 180,
      });

      animate(".defaults-box-2", {
        translateX: [0, 150],
        scale: [1, 1.2],
        delay: 200,
      });

      animate(".defaults-box-3", {
        translateX: [0, 150],
        borderRadius: ["12px", "50%"],
        delay: 400,
      });
    });
  }, [isReady, add]);

  const playAnimation = () => {
    setKey((k) => k + 1);
  };

  const EASINGS = [
    "outExpo",
    "inOutSine",
    "inOutElastic(1, 0.5)",
    "outBounce",
    "linear",
  ];

  return (
    <DemoCard
      title="shared defaults"
      description="Use scope defaults to share animation parameters like easing and duration across all animations."
      actions={
        <div className="flex gap-2">
          <select
            value={ease}
            onChange={(e) => setEase(e.target.value)}
            className="bg-black/30 border border-[#2a2a3a] rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-[#ffd11a]/50"
          >
            {EASINGS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-20 accent-[#ffd11a]"
            title={`Duration: ${duration}ms`}
          />
        </div>
      }
      controls={{
        play: playAnimation,
        restart: playAnimation,
      }}
      isPlaying={false}
      state={{ progress: 0 }}
      code={`useAnimeScope({ defaults: { ease: '${ease}', duration: ${duration} } })`}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        key={key}
        className="w-full flex flex-col gap-4 items-start pl-4"
      >
        <div className="flex items-center gap-4 w-full">
          <div className="defaults-box-1 w-10 h-10 rounded-xl bg-linear-to-br from-[#ffd11a] to-[#ff8c00] shadow-lg shadow-[#ffd11a]/30" />
          <span className="text-xs text-slate-500 font-mono">rotate: 180°</span>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="defaults-box-2 w-10 h-10 rounded-xl bg-linear-to-br from-[#06b6d4] to-[#0891b2] shadow-lg shadow-cyan-500/30" />
          <span className="text-xs text-slate-500 font-mono">scale: 1.2x</span>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="defaults-box-3 w-10 h-10 rounded-xl bg-linear-to-br from-[#10b981] to-[#059669] shadow-lg shadow-emerald-500/30" />
          <span className="text-xs text-slate-500 font-mono">
            borderRadius: 50%
          </span>
        </div>

        {/* Current defaults display */}
        <div className="mt-2 w-full flex gap-4 justify-center text-[10px] text-slate-500 font-mono">
          <span>ease: {ease}</span>
          <span>•</span>
          <span>duration: {duration}ms</span>
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeDefaultsDemo;
