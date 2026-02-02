import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAnimeLayout } from "../../hooks";
import { DemoCard } from "./DemoCard";
import { Columns, Grid2X2, Grid3X3, Split } from "lucide-react";

export const LayoutDemo: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [isHidden, setIsHidden] = useState(false);

  const { ref, controls, state, isReady, isAnimating } =
    useAnimeLayout<HTMLDivElement>({
      children: ".layout-item",
      duration: 800,
      ease: "outExpo",
    });

  // Handle initialization safely
  useEffect(() => {
    if (!isReady || !ref.current) return;
    const root = ref.current;
    root.style.display = "grid";
    root.style.gap = "12px";
    root.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }, [isReady]);

  const setGridColumns = useCallback(
    (nextCols: number) => {
      if (!isReady) return;
      controls.update(
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
    },
    [controls, isReady],
  );

  const toggleItem = useCallback(() => {
    const nextHidden = !isHidden;
    controls.update(
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
  }, [controls, isHidden]);

  // Demo play sequence: cycle through column layouts
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
      description="Fluid transitions between different grid configurations. Click 'Play' to auto-cycle."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={() => setGridColumns(2)}
            className={`p-1.5 rounded-lg transition-all ${cols === 2 ? "bg-[#ffd11a] text-[#12121a]" : "text-slate-500 hover:text-white"}`}
            title="2 Columns"
          >
            <Columns size={12} />
          </button>
          <button
            onClick={() => setGridColumns(3)}
            className={`p-1.5 rounded-lg transition-all ${cols === 3 ? "bg-[#ffd11a] text-[#12121a]" : "text-slate-500 hover:text-white"}`}
            title="3 Columns"
          >
            <Grid3X3 size={12} />
          </button>
          <button
            onClick={() => setGridColumns(4)}
            className={`p-1.5 rounded-lg transition-all ${cols === 4 ? "bg-[#ffd11a] text-[#12121a]" : "text-slate-500 hover:text-white"}`}
            title="4 Columns"
          >
            <Grid2X2 size={12} />
          </button>
          <button
            onClick={toggleItem}
            className={`p-1.5 rounded-lg transition-all ${isHidden ? "bg-orange-500 text-white" : "text-slate-500 hover:text-white"}`}
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
      state={state}
      isPlaying={isAnimating}
      code={`controls.update((layout) => {
  root.style.gridTemplateColumns = 'repeat(${cols}, 1fr)';
});`}
    >
      <div ref={ref} className="w-full flex-1 min-h-[160px]">
        {items.map((n) => (
          <div
            key={n}
            data-layout-demo-item={n}
            className="layout-item h-12 flex items-center justify-center rounded-xl bg-[#ffd11a]/10 border border-[#ffd11a]/20 text-[#ffd11a] font-bold text-sm shadow-sm"
          >
            {n}
          </div>
        ))}
      </div>
    </DemoCard>
  );
};

export default LayoutDemo;
