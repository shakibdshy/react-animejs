import React, { useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "../../components/AnimeLayout";
import { DemoSection } from "./DemoSection";

/**
 * AnimeLayoutComponentDemo - Demonstrates the AnimeLayout component
 *
 * Shows how to use the component-based approach instead of the hook.
 * Features:
 * - Auto mode for automatic animations
 * - Manual mode with ref controls
 * - AnimeLayout.Item for individual items
 */
export const AnimeLayoutComponentDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);
  const [cols, setCols] = useState(4);

  const addItem = () => {
    setItems((prev) => [...prev, counter]);
    setCounter((c) => c + 1);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item !== id));
  };

  const changeColumns = (newCols: number) => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${newCols}, 1fr)`;
      },
      { duration: 600, ease: "outExpo" },
    );
    setCols(newCols);
  };

  return (
    <DemoSection title="AnimeLayout Component Demo">
      <div className="flex flex-col gap-4 w-full">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            + Add Item
          </button>
          <button
            onClick={() =>
              items.length > 0 && removeItem(items[items.length - 1])
            }
            disabled={items.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            Remove Last
          </button>

          <div className="flex gap-2">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => changeColumns(n)}
                className={`px-3 py-2 rounded-md transition-colors ${
                  cols === n
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {n} cols
              </button>
            ))}
          </div>

          <button
            onClick={() => layoutRef.current?.refresh()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* AnimeLayout Component */}
        <AnimeLayout
          ref={layoutRef}
          mode="auto"
          duration={500}
          ease="outExpo"
          enterFrom={{ opacity: 0, transform: "scale(0.8) translateY(20px)" }}
          leaveTo={{ opacity: 0, transform: "scale(0.8) translateY(-20px)" }}
          className="grid gap-3 p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          onLayoutChange={({ entering, leaving }) => {
            if (entering.length > 0)
              console.log("Items entering:", entering.length);
            if (leaving.length > 0)
              console.log("Items leaving:", leaving.length);
          }}
        >
          {items.map((id) => (
            <AnimeLayoutItem
              key={id}
              layoutId={`item-${id}`}
              className="h-16 flex items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-purple-600 text-white font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => removeItem(id)}
            >
              {id}
            </AnimeLayoutItem>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-gray-500 text-center py-8">
              Click "Add Item" to add elements
            </div>
          )}
        </AnimeLayout>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Items:</div>
          <div className="text-amber-400">{items.length}</div>
          <div className="text-gray-500">Columns:</div>
          <div className="text-amber-400">{cols}</div>
          <div className="text-gray-500">Mode:</div>
          <div className="text-indigo-400">auto</div>
          <div className="text-gray-500">Ready:</div>
          <div className="text-green-400">
            {layoutRef.current?.isReady ? "Yes" : "Initializing..."}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          This demo uses the{" "}
          <code className="text-amber-400">&lt;AnimeLayout&gt;</code> component
          with <code className="text-amber-400">mode=&quot;auto&quot;</code> for
          automatic animations when items change. Click items to remove them.
        </p>
      </div>
    </DemoSection>
  );
};

export default AnimeLayoutComponentDemo;
