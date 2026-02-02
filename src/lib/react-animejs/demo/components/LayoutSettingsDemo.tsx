import React, { useState } from "react";
import { useAnimeLayout } from "../../hooks";
import { stagger } from "animejs";
import { DemoSection } from "./DemoSection";

/**
 * LayoutSettingsDemo - Demonstrates Layout settings:
 * - children: selector for layout children
 * - delay: animation delay (supports stagger)
 * - duration: animation duration
 * - ease: easing function
 */
export const LayoutSettingsDemo: React.FC = () => {
  const [duration, setDuration] = useState(500);
  const [delay, setDelay] = useState(0);
  const [useStagger, setUseStagger] = useState(false);
  const [isRow, setIsRow] = useState(false);

  const { ref, controls, state, isReady } = useAnimeLayout<HTMLDivElement>({
    children: ".settings-item",
    duration,
    delay: useStagger ? stagger(50) : delay,
    ease: "outExpo",
  });

  const toggleLayout = () => {
    controls.update((layout) => {
      const root = layout.root as HTMLElement;
      root.classList.toggle("flex-row");
      root.classList.toggle("flex-col");
    });
    setIsRow(!isRow);
  };

  const items = ["A", "B", "C", "D", "E"];

  return (
    <DemoSection title="Layout: Settings Demo">
      <div className="flex flex-col gap-4 w-full">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Duration:</label>
            <input
              type="range"
              min="100"
              max="1500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-amber-400 w-12">{duration}ms</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Delay:</label>
            <input
              type="range"
              min="0"
              max="500"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              disabled={useStagger}
              className="w-24"
            />
            <span className="text-xs text-amber-400 w-12">{delay}ms</span>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={useStagger}
              onChange={(e) => setUseStagger(e.target.checked)}
              className="rounded"
            />
            Use Stagger
          </label>

          <button
            onClick={toggleLayout}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Toggle Layout
          </button>
        </div>

        {/* Layout Container */}
        <div
          ref={ref}
          className={`w-full flex gap-3 p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a] ${isRow ? "flex-row" : "flex-col"}`}
        >
          {items.map((item) => (
            <div
              key={item}
              className="settings-item flex-1 h-14 flex items-center justify-center rounded-lg bg-emerald-500/90 text-white font-semibold shadow"
            >
              Item {item}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Ready:</div>
          <div className="text-amber-400">{isReady ? "Yes" : "No"}</div>
          <div className="text-gray-500">Duration:</div>
          <div className="text-amber-400">{duration}ms</div>
          <div className="text-gray-500">Delay:</div>
          <div className="text-amber-400">
            {useStagger ? "stagger(50)" : `${delay}ms`}
          </div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">
            {Math.round(state.progress * 100)}%
          </div>
        </div>
      </div>
    </DemoSection>
  );
};

export default LayoutSettingsDemo;
