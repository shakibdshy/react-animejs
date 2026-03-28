/**
 * ScopeMediaQueriesDemo - Media query reactivity demonstration
 *
 * Shows how to use useCreateScope and useAnime hooks together for
 * a clean, reactive, and scoped animation experience.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useCreateScope, useAnime } from "../../../index";
import { GripVertical } from "lucide-react";

// Media queries to track
const MEDIA_QUERIES = {
  isSmall: "(max-width: 200px)",
  reduceMotion: "(prefers-reduced-motion)",
} as const;

export const ScopeMediaQueriesDemo: React.FC = () => {
  const [iframeWidth, setIframeWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Create the scope (tracks media queries automatically on the root element)
  const { ref, matches } = useCreateScope({ mediaQueries: MEDIA_QUERIES });

  // 2. Use the animation hook (automatically scoped and reactive to option changes)
  useAnime({
    selector: ".square",
    translateX: matches.isSmall ? 0 : ["-35%", "35%"],
    translateY: matches.isSmall ? ["-40%", "40%"] : 0,
    scale: matches.isSmall ? 0.5 : 1,
    loop: true,
    alternate: true,
    duration: matches.reduceMotion ? 0 : matches.isSmall ? 750 : 1250,
    ease: "inOutQuad",
  });

  // Drag resize logic (UI concern)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      const clampedWidth = Math.max(
        100,
        Math.min(newWidth, containerRect.width - 40),
      );
      setIframeWidth(clampedWidth);
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <DemoCard
      title="Scope"
      description="Using useCreateScope and useAnime hooks together. The animation automatically adapts when the container crosses 200px."
      code={`useCreateScope({ mediaQueries: { isSmall: '(max-width: 200px)' } })\nuseAnime({ x: matches.isSmall ? 0 : 100, duration: matches.isSmall ? 0 : 750 })`}
    >
      <div className="w-full flex flex-col items-center gap-4">
        {/* Resizable container */}
        <div ref={containerRef} className="relative w-full flex items-center">
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ width: iframeWidth }}
            className="relative bg-[#0d3d38] rounded-lg border-2 border-[#2dd4bf] transition-colors duration-200 overflow-hidden"
          >
            {/* Content area */}
            <div className="relative min-h-[140px] flex items-center justify-center p-4">
              <div className="square w-12 h-12 rounded-lg bg-[#2dd4bf] shadow-lg shadow-[#2dd4bf]/30" />
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize transition-colors ${
                isDragging ? "bg-[#2dd4bf]/20" : "hover:bg-[#2dd4bf]/10"
              }`}
            >
              <GripVertical className="w-4 h-4 text-[#2dd4bf]/60" />
            </div>

            {/* Labels */}
            <div className="absolute bottom-2 right-8 text-[10px] text-[#2dd4bf]/60 font-mono whitespace-nowrap">
              resize iframe »
            </div>
            <div className="absolute top-2 right-8 text-[10px] text-[#2dd4bf]/80 font-mono">
              {Math.round(iframeWidth)}px
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Size:</span>
            <span
              className={`font-mono ${matches.isSmall ? "text-[#2dd4bf]" : "text-[#ffd11a]"}`}
            >
              {matches.isSmall ? "Small (≤200px)" : "Normal (>200px)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Direction:</span>
            <span className="text-slate-300 font-mono">
              {matches.isSmall ? "Vertical ↕" : "Horizontal ↔"}
            </span>
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
      </div>
    </DemoCard>
  );
};

export default ScopeMediaQueriesDemo;
