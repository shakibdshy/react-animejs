import React, { useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "../../components/AnimeLayout";
import { stagger } from "animejs";
import { DemoSection } from "./DemoSection";

/**
 * LayoutStaggerDemo - Demonstrates staggered layout animations using AnimeLayout component:
 * - Stagger delay from first/last/center
 * - Visual effect of sequential item animations
 */
export const LayoutStaggerDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [staggerFrom, setStaggerFrom] = useState<"first" | "last" | "center">(
    "first",
  );
  const [staggerDelay, setStaggerDelay] = useState(75);
  const [isRow, setIsRow] = useState(true);

  const toggleLayout = () => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.classList.toggle("flex-row");
        root.classList.toggle("flex-col");
      },
      {
        delay: stagger(staggerDelay, { from: staggerFrom }),
      },
    );
    setIsRow(!isRow);
  };

  const items = ["1", "2", "3", "4", "5", "6"];

  return (
    <DemoSection title="Layout: Staggered Animation">
      <div className="flex flex-col gap-4 w-full">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Stagger From:</label>
            <select
              value={staggerFrom}
              onChange={(e) =>
                setStaggerFrom(e.target.value as "first" | "last" | "center")
              }
              className="px-3 py-1 bg-gray-700 text-white rounded-md border border-gray-600"
            >
              <option value="first">First</option>
              <option value="last">Last</option>
              <option value="center">Center</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Delay:</label>
            <input
              type="range"
              min="25"
              max="200"
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-amber-400 w-12">
              {staggerDelay}ms
            </span>
          </div>

          <button
            onClick={toggleLayout}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Toggle Layout
          </button>
        </div>

        {/* Layout Container using AnimeLayout Component */}
        <AnimeLayout
          ref={layoutRef}
          childrenSelector=".stagger-item"
          duration={600}
          ease="outExpo"
          className={`w-full flex gap-3 p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a] ${isRow ? "flex-row" : "flex-col"}`}
        >
          {items.map((item, index) => (
            <AnimeLayoutItem
              key={item}
              className="stagger-item flex-1 h-14 flex items-center justify-center rounded-lg text-white font-semibold shadow"
              style={{
                backgroundColor: `hsl(${200 + index * 25}, 70%, 50%)`,
              }}
            >
              {item}
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Ready:</div>
          <div className="text-amber-400">
            {layoutRef.current?.isReady ? "Yes" : "No"}
          </div>
          <div className="text-gray-500">Stagger:</div>
          <div className="text-amber-400">
            stagger({staggerDelay}, &#123; from: '{staggerFrom}' &#125;)
          </div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">
            {Math.round((layoutRef.current?.state.progress ?? 0) * 100)}%
          </div>
          <div className="text-gray-500">State:</div>
          <div className="text-indigo-400">
            {layoutRef.current?.state.completed
              ? "Completed"
              : layoutRef.current?.state.paused
                ? "Paused"
                : "Playing"}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          This demo uses the{" "}
          <code className="text-amber-400">&lt;AnimeLayout&gt;</code> component
          with ref-based controls. Toggle the layout to see items animate
          sequentially based on the stagger configuration.
        </p>
      </div>
    </DemoSection>
  );
};

export default LayoutStaggerDemo;
