import React, { useCallback, useState } from "react";
import { useAnimeLayout } from "../../hooks";
import { DemoSection } from "./DemoSection";

/**
 * LayoutEnterExitDemo - Demonstrates enter/exit animations:
 * - enterFrom: initial state for entering elements
 * - leaveTo: final state for leaving elements
 * - Dynamically add/remove items with animated transitions
 */
export const LayoutEnterExitDemo: React.FC = () => {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);

  const { ref, controls, state, isReady, entering, leaving } =
    useAnimeLayout<HTMLDivElement>({
      children: ".enter-exit-item",
      duration: 350,
      ease: "outExpo",
      enterFrom: {
        opacity: 0,
        transform: "translateY(50px) scale(0.8)",
        duration: 450,
        ease: "out(3)",
      },
      leaveTo: {
        opacity: 0,
        transform: "translateY(-50px) scale(0.8)",
        duration: 350,
        ease: "out(2)",
      },
    });

  const addItem = useCallback(() => {
    const newId = counter;
    setCounter((c) => c + 1);

    controls.update(() => {
      // The actual DOM update happens via React state
    });

    setItems((prev) => [...prev, newId]);
  }, [counter, controls]);

  const removeItem = useCallback(
    (id: number) => {
      controls.update(() => {
        // The actual DOM update happens via React state
      });

      setItems((prev) => prev.filter((item) => item !== id));
    },
    [controls],
  );

  const removeFirst = useCallback(() => {
    if (items.length > 0) {
      removeItem(items[0]);
    }
  }, [items, removeItem]);

  const removeLast = useCallback(() => {
    if (items.length > 0) {
      removeItem(items[items.length - 1]);
    }
  }, [items, removeItem]);

  return (
    <DemoSection title="Layout: Enter/Exit Animations">
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
            onClick={removeFirst}
            disabled={items.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            Remove First
          </button>
          <button
            onClick={removeLast}
            disabled={items.length === 0}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            Remove Last
          </button>
        </div>

        {/* Layout Container */}
        <div
          ref={ref}
          className="w-full flex flex-wrap gap-3 p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a] min-h-[80px]"
        >
          {items.map((id) => (
            <div
              key={id}
              className="enter-exit-item w-20 h-20 flex items-center justify-center rounded-lg bg-purple-500/90 text-white font-bold shadow cursor-pointer hover:bg-purple-400/90 transition-colors"
              onClick={() => removeItem(id)}
              title="Click to remove"
            >
              {id}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-gray-500 text-sm italic">
              Click "Add Item" to add elements
            </div>
          )}
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Ready:</div>
          <div className="text-amber-400">{isReady ? "Yes" : "No"}</div>
          <div className="text-gray-500">Items:</div>
          <div className="text-amber-400">{items.length}</div>
          <div className="text-gray-500">Entering:</div>
          <div className="text-green-400">{entering.length} elements</div>
          <div className="text-gray-500">Leaving:</div>
          <div className="text-red-400">{leaving.length} elements</div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">
            {Math.round(state.progress * 100)}%
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Click on any item to remove it. New items enter with a scale-up
          animation, removed items exit with a scale-down animation.
        </p>
      </div>
    </DemoSection>
  );
};

export default LayoutEnterExitDemo;
