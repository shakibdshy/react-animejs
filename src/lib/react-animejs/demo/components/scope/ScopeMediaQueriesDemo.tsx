/**
 * ScopeMediaQueriesDemo - Media query reactivity demonstration
 *
 * Shows how scopes can react to media query changes and automatically
 * re-run constructors when viewport changes.
 */

import React, { useEffect, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "../../../hooks/use-anime-scope";
import { animate, utils } from "animejs";

// Custom media queries for the demo
const MEDIA_QUERIES = {
  isSmall: "(max-width: 400px)",
  isMedium: "(min-width: 401px) and (max-width: 600px)",
  isLarge: "(min-width: 601px)",
  reduceMotion: "(prefers-reduced-motion)",
} as const;

export const ScopeMediaQueriesDemo: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState(500);
  const { ref, isReady, matches, add } = useAnimeScope({
    mediaQueries: MEDIA_QUERIES,
    onMediaChange: (newMatches) => {
      console.log("[ScopeMediaQueriesDemo] Media changed:", newMatches);
    },
  });

  useEffect(() => {
    if (!isReady) return;

    add((self) => {
      const { isSmall, reduceMotion } = self.matches;

      // Set initial scale based on size
      utils.set(".mq-box", {
        scale: isSmall ? 0.6 : 1,
      });

      // Different animations based on media query
      if (isSmall) {
        animate(".mq-box", {
          y: [-30, 30],
          duration: reduceMotion ? 0 : 600,
          loop: true,
          alternate: true,
          ease: "inOutSine",
        });
      } else {
        animate(".mq-box", {
          x: [-50, 50],
          rotate: [0, 360],
          duration: reduceMotion ? 0 : 1200,
          loop: true,
          alternate: true,
          ease: "inOutExpo",
        });
      }

      return () => {
        console.log("[ScopeMediaQueriesDemo] Cleaning up animations");
      };
    });
  }, [isReady, add]);

  const getActiveQuery = () => {
    if (matches.isSmall) return "Small";
    if (matches.isMedium) return "Medium";
    if (matches.isLarge) return "Large";
    return "Unknown";
  };

  return (
    <DemoCard
      title="media queries"
      description="Scopes react to media query changes and re-run animations. Resize the window to see different behaviors."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={() => setContainerWidth(350)}
            className={`px-2 py-1 rounded-lg text-xs transition-all ${
              containerWidth === 350
                ? "bg-[#ffd11a] text-[#12121a]"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Small
          </button>
          <button
            onClick={() => setContainerWidth(500)}
            className={`px-2 py-1 rounded-lg text-xs transition-all ${
              containerWidth === 500
                ? "bg-[#ffd11a] text-[#12121a]"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setContainerWidth(700)}
            className={`px-2 py-1 rounded-lg text-xs transition-all ${
              containerWidth === 700
                ? "bg-[#ffd11a] text-[#12121a]"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Large
          </button>
        </div>
      }
      code={`useAnimeScope({ mediaQueries: {...} })`}
    >
      <div className="w-full flex flex-col items-center gap-4">
        {/* Container with resizable width (simulated) */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{ width: containerWidth, maxWidth: "100%" }}
          className="relative bg-[#1a1a24]/50 rounded-xl p-8 border border-[#2a2a3a] transition-all duration-300 flex justify-center items-center min-h-[120px]"
        >
          <div className="mq-box w-14 h-14 rounded-xl bg-linear-to-br from-[#a855f7] to-[#7c3aed] shadow-lg shadow-purple-500/30" />
        </div>

        {/* Status indicators */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Active:</span>
            <span className="text-[#ffd11a] font-mono">{getActiveQuery()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Reduce Motion:</span>
            <span
              className={`font-mono ${matches.reduceMotion ? "text-orange-400" : "text-green-400"}`}
            >
              {matches.reduceMotion ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* Media query badges */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(matches).map(([key, value]) => (
            <span
              key={key}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
                value
                  ? "bg-[#ffd11a]/20 text-[#ffd11a] border border-[#ffd11a]/30"
                  : "bg-slate-800/50 text-slate-600 border border-slate-700/30"
              }`}
            >
              {key}
            </span>
          ))}
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeMediaQueriesDemo;
