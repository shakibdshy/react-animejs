import React, { useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "@/lib/react-animejs/components/AnimeLayout";
import { DemoCard } from "./DemoCard";
import { Columns, Grid2X2, Grid3X3, Plus, RefreshCw } from "lucide-react";

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

  const playDemo = () => {
    addItem();
    setTimeout(() => {
      changeColumns(cols === 4 ? 2 : 4);
    }, 600);
  };

  const isAnimating = layoutRef.current?.state
    ? !layoutRef.current.state.paused &&
      layoutRef.current.state.began &&
      !layoutRef.current.state.completed
    : false;

  return (
    <DemoCard
      title="declarative layout"
      description="Declarative component-based layout. Click 'Play' to auto-scale."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={addItem}
            className="p-1.5 bg-demo-accent text-demo-bg rounded-lg transition-all hover:scale-105 active:scale-95"
            title="Add Item"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={() => layoutRef.current?.refresh()}
            className="p-1.5 text-demo-text-muted hover:text-demo-accent rounded-lg transition-all"
            title="Refresh Layout"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => {
          setItems([1, 2, 3, 4]);
          setCounter(5);
          setCols(4);
        },
      }}
      state={layoutRef.current?.state}
      isPlaying={isAnimating}
      code={`<AnimeLayout mode="auto" />`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Column Selectors */}
        <div className="flex justify-center gap-2">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => changeColumns(n)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                cols === n
                  ? "bg-demo-accent text-demo-bg shadow-lg shadow-demo-accent/20"
                  : "bg-white/5 text-demo-text-muted hover:bg-white/10"
              }`}
            >
              {n === 2 ? (
                <Columns size={12} />
              ) : n === 3 ? (
                <Grid3X3 size={12} />
              ) : (
                <Grid2X2 size={12} />
              )}
              {n} Columns
            </button>
          ))}
        </div>

        {/* AnimeLayout Component Area */}
        <AnimeLayout
          ref={layoutRef}
          mode="auto"
          duration={500}
          ease="outExpo"
          enterFrom={{ opacity: 0, transform: "scale(0.8) translateY(20px)" }}
          leaveTo={{ opacity: 0, transform: "scale(0.8) translateY(-20px)" }}
          className="flex-1 grid gap-3 p-1 min-h-[160px]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((id) => (
            <AnimeLayoutItem
              key={id}
              layoutId={`item-${id}`}
              className="h-12 flex items-center justify-center rounded-xl bg-linear-to-br from-demo-accent/20 to-[#f59e0b]/20 border border-demo-accent/20 text-demo-accent font-bold text-sm shadow-sm cursor-pointer hover:from-demo-accent hover:to-[#f59e0b] hover:text-demo-bg transition-all"
              onClick={() => removeItem(id)}
            >
              {id}
            </AnimeLayoutItem>
          ))}
          {items.length === 0 && (
            <div className="col-span-full h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600 text-sm font-mono uppercase tracking-widest leading-loose text-center">
              Layout Empty
              <br />
              Click + to begin
            </div>
          )}
        </AnimeLayout>
      </div>
    </DemoCard>
  );
};

export default AnimeLayoutComponentDemo;
