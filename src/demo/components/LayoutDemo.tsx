import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "@/lib/react-animejs/components/AnimeLayout";
import { DemoCard } from "./DemoCard";
import { Columns, Grid2X2, Grid3X3, Split } from "lucide-react";

export const LayoutDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [cols, setCols] = useState(3);
  const [isHidden, setIsHidden] = useState(false);

  const setGridColumns = useCallback((nextCols: number) => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${nextCols}, minmax(0, 1fr))`;
      },
      {
        duration: 800,
        ease: "outExpo",
      },
    );
    setCols(nextCols);
  }, []);

  const toggleItem = useCallback(() => {
    const nextHidden = !isHidden;
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        const item = root.querySelector(
          '[data-layout-demo-item="4"]',
        ) as HTMLElement | null;
        if (!item) return;
        item.style.display = nextHidden ? "none" : "";
      },
      {
        duration: 600,
        ease: "outExpo",
        enterFrom: { opacity: 0, scale: 0.5 },
        leaveTo: { opacity: 0, scale: 0.5 },
      },
    );
    setIsHidden(nextHidden);
  }, [isHidden]);

  const playDemo = useCallback(() => {
    const sequence = [2, 4, 3];
    let i = 0;
    const interval = setInterval(() => {
      setGridColumns(sequence[i]);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 1000);
  }, [setGridColumns]);

  const items = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  return (
    <DemoCard
      title="automatic layout"
      description="Fluid transitions between different grid configurations. Using <AnimeLayout> component."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={() => setGridColumns(2)}
            className={`p-1.5 rounded-lg transition-all ${cols === 2 ? "bg-demo-accent text-demo-bg" : "text-demo-text-muted hover:text-white"}`}
            title="2 Columns"
          >
            <Columns size={12} />
          </button>
          <button
            onClick={() => setGridColumns(3)}
            className={`p-1.5 rounded-lg transition-all ${cols === 3 ? "bg-demo-accent text-demo-bg" : "text-demo-text-muted hover:text-white"}`}
            title="3 Columns"
          >
            <Grid3X3 size={12} />
          </button>
          <button
            onClick={() => setGridColumns(4)}
            className={`p-1.5 rounded-lg transition-all ${cols === 4 ? "bg-demo-accent text-demo-bg" : "text-demo-text-muted hover:text-white"}`}
            title="4 Columns"
          >
            <Grid2X2 size={12} />
          </button>
          <button
            onClick={toggleItem}
            className={`p-1.5 rounded-lg transition-all ${isHidden ? "bg-orange-500 text-white" : "text-demo-text-muted hover:text-white"}`}
            title="Toggle Item 4"
          >
            <Split size={12} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => setGridColumns(3),
      }}
      state={layoutRef.current?.state}
      isPlaying={layoutRef.current?.isAnimating}
      code={`<AnimeLayout ref={layoutRef}>...</AnimeLayout>`}
    >
      <AnimeLayout
        ref={layoutRef}
        duration={800}
        ease="outExpo"
        className="w-full flex-1 min-h-[160px] grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((n) => (
          <AnimeLayoutItem
            key={n}
            layoutId={`item-${n}`}
            data-layout-demo-item={n}
            className="h-12 flex items-center justify-center rounded-xl bg-demo-accent/10 border border-demo-accent/20 text-demo-accent font-bold text-sm shadow-sm transition-colors hover:bg-demo-accent/20 cursor-pointer"
            onClick={n === 4 ? toggleItem : undefined}
          >
            {n}
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
    </DemoCard>
  );
};

export default LayoutDemo;
