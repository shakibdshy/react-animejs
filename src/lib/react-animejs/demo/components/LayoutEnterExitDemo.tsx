import React, { useCallback, useState } from "react";
import { useAnimeLayout } from "../../hooks";
import { DemoCard } from "./DemoCard";
import { Plus, Trash2, ChevronFirst, ChevronLast } from "lucide-react";

export const LayoutEnterExitDemo: React.FC = () => {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);

  const { ref, controls, state, isAnimating, entering, leaving } =
    useAnimeLayout<HTMLDivElement>({
      children: ".enter-exit-item",
      duration: 500,
      ease: "outExpo",
      enterFrom: {
        opacity: 0,
        transform: "translateY(50px) scale(0.8)",
      },
      leaveTo: {
        opacity: 0,
        transform: "translateY(-50px) scale(0.8)",
      },
    });

  const addItem = useCallback(() => {
    const newId = counter;
    setCounter((c) => c + 1);
    controls.update(() => {
      setItems((prev) => [...prev, newId]);
    });
  }, [counter, controls]);

  const removeItem = useCallback(
    (id: number) => {
      controls.update(() => {
        setItems((prev) => prev.filter((item) => item !== id));
      });
    },
    [controls],
  );

  const playDemo = () => {
    // Add 2 items, then remove 1
    addItem();
    setTimeout(() => {
      addItem();
      setTimeout(() => {
        if (items.length > 0) removeItem(items[0]);
      }, 600);
    }, 600);
  };

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
    <DemoCard
      title="enter / exit"
      description="Animated insertion and removal of elements. Click 'Play' to auto-add items."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={addItem}
            className="p-1.5 bg-[#ffd11a] text-[#12121a] rounded-lg transition-all hover:scale-105 active:scale-95"
            title="Add Item"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={removeFirst}
            disabled={items.length === 0}
            className="p-1.5 text-slate-500 hover:text-orange-500 rounded-lg transition-all disabled:opacity-20"
            title="Remove First"
          >
            <ChevronFirst size={12} />
          </button>
          <button
            onClick={removeLast}
            disabled={items.length === 0}
            className="p-1.5 text-slate-500 hover:text-orange-500 rounded-lg transition-all disabled:opacity-20"
            title="Remove Last"
          >
            <ChevronLast size={12} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => {
          controls.update(() => setItems([1, 2, 3, 4]));
          setCounter(5);
        },
      }}
      state={state}
      isPlaying={isAnimating}
      code={`enterFrom: { opacity: 0, translateY: 50 }`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        <div
          ref={ref}
          className="w-full flex flex-wrap gap-4 min-h-[160px] items-start content-start"
        >
          {items.map((id) => (
            <div
              key={id}
              className="enter-exit-item w-16 h-16 flex items-center justify-center rounded-2xl bg-[#ffd11a]/10 border border-[#ffd11a]/20 text-[#ffd11a] font-bold text-lg shadow-sm cursor-pointer group hover:bg-[#ffd11a] hover:text-[#12121a] transition-all"
              onClick={() => removeItem(id)}
            >
              <span className="group-hover:hidden">{id}</span>
              <Trash2 size={24} className="hidden group-hover:block" />
            </div>
          ))}
          {items.length === 0 && (
            <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600 text-sm font-mono uppercase tracking-widest">
              No items - Click + to add
            </div>
          )}
        </div>

        {/* Live Status */}
        <div className="flex gap-4">
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
              Entering
            </span>
            <span className="text-green-500 font-mono font-bold">
              {entering.length}
            </span>
          </div>
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
              Leaving
            </span>
            <span className="text-red-500 font-mono font-bold">
              {leaving.length}
            </span>
          </div>
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
              Total
            </span>
            <span className="text-[#ffd11a] font-mono font-bold">
              {items.length}
            </span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
};

export default LayoutEnterExitDemo;
