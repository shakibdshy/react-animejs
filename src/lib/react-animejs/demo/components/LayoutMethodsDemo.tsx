import React, { useCallback, useState } from "react";
import { useAnimeLayout } from "../../hooks";
import { DemoSection } from "./DemoSection";

/**
 * LayoutMethodsDemo - Demonstrates all layout methods:
 * - record(): manually record current layout state
 * - animate(): animate from recorded state to current state
 * - update(): combined record + DOM change + animate
 * - revert(): revert layout changes
 */
export const LayoutMethodsDemo: React.FC = () => {
  const [cols, setCols] = useState(2);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  const { ref, controls, state, isReady, layout } =
    useAnimeLayout<HTMLDivElement>({
      children: ".method-item",
      duration: 600,
      ease: "outExpo",
    });

  // Manual record() + DOM change + animate() approach
  const useRecordAnimate = useCallback(() => {
    if (!layout) return;

    // 1. Record current state
    controls.record();

    // 2. Make DOM changes
    const root = ref.current;
    if (root) {
      const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;
      root.style.gridTemplateColumns = `repeat(${nextCols}, 1fr)`;
      setCols(nextCols);
    }

    // 3. Animate to new state
    controls.animate({ duration: 500 });
    setLastMethod("record() → DOM change → animate()");
  }, [layout, controls, ref, cols]);

  // Combined update() approach
  const useUpdate = useCallback(() => {
    const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;

    controls.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${nextCols}, 1fr)`;
      },
      { duration: 700, ease: "outBack" },
    );

    setCols(nextCols);
    setLastMethod("update(callback, params)");
  }, [controls, cols]);

  // Revert method
  const useRevert = useCallback(() => {
    controls.revert();
    setLastMethod("revert()");
  }, [controls]);

  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DemoSection title="Layout: Methods Demo">
      <div className="flex flex-col gap-4 w-full">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={useRecordAnimate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
          >
            record() + animate()
          </button>
          <button
            onClick={useUpdate}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
          >
            update()
          </button>
          <button
            onClick={useRevert}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
          >
            revert()
          </button>
        </div>

        {/* Layout Container */}
        <div
          ref={ref}
          className="w-full grid gap-3 p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item) => (
            <div
              key={item}
              className="method-item h-16 flex items-center justify-center rounded-lg bg-cyan-500/90 text-white font-semibold shadow"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Ready:</div>
          <div className="text-amber-400">{isReady ? "Yes" : "No"}</div>
          <div className="text-gray-500">Columns:</div>
          <div className="text-amber-400">{cols}</div>
          <div className="text-gray-500">Last Method:</div>
          <div className="text-indigo-400">{lastMethod || "None"}</div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">
            {Math.round(state.progress * 100)}%
          </div>
          <div className="text-gray-500">State:</div>
          <div className="text-indigo-400">
            {state.completed
              ? "Completed"
              : state.paused
                ? "Paused"
                : "Playing"}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            • <code className="text-amber-400">record() + animate()</code>:
            Manual two-step approach for complex scenarios
          </p>
          <p>
            • <code className="text-amber-400">update(callback)</code>:
            Simplified one-call approach for most use cases
          </p>
          <p>
            • <code className="text-amber-400">revert()</code>: Resets layout
            and clears animation state
          </p>
        </div>
      </div>
    </DemoSection>
  );
};

export default LayoutMethodsDemo;
