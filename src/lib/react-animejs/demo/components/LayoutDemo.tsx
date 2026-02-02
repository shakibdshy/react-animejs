import React, { useEffect, useMemo, useState } from 'react';
import { useAnimeLayout } from '../../hooks';
import { DemoSection } from './DemoSection';

export const LayoutDemo: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [isHidden, setIsHidden] = useState(false);

  const { ref, controls, state, isReady } = useAnimeLayout<HTMLDivElement>({
    children: '.layout-item',
    duration: 900,
    ease: 'outExpo',
    autoplay: false,
  });

  const items = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.display = 'grid';
    ref.current.style.gap = '12px';
    ref.current.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }, [ref, cols, isReady]);

  const setGridColumns = (nextCols: number) => {
    controls.update((layout) => {
      const root = layout.root as HTMLElement;
      root.style.display = 'grid';
      root.style.gap = '12px';
      root.style.gridTemplateColumns = `repeat(${nextCols}, minmax(0, 1fr))`;
    });
    setCols(nextCols);
  };

  const toggleItem = () => {
    const nextHidden = !isHidden;

    controls.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        const item = root.querySelector(
          '[data-layout-demo-item="4"]',
        ) as HTMLElement | null;
        if (!item) return;
        item.style.display = nextHidden ? 'none' : '';
      },
      {
        duration: 700,
        ease: 'outExpo',
        enterFrom: { opacity: 0, transform: 'scale(0.9)' },
        leaveTo: { opacity: 0, transform: 'scale(0.9)' },
        swapAt: { transform: 'scale(1.02)' },
      },
    );

    setIsHidden(nextHidden);
  };

  return (
    <DemoSection title="Layout: Auto Layout">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setGridColumns(2)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            2 cols
          </button>
          <button
            onClick={() => setGridColumns(3)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            3 cols
          </button>
          <button
            onClick={() => setGridColumns(4)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            4 cols
          </button>
          <button
            onClick={toggleItem}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            {isHidden ? 'Show #4' : 'Hide #4'}
          </button>
        </div>

        <div
          ref={ref}
          className="w-full bg-[#1a1a24] rounded-lg p-4 border border-[#2a2a3a]"
        >
          {items.map((n) => (
            <div
              key={n}
              data-layout-demo-item={n}
              className="layout-item h-16 flex items-center justify-center rounded-lg bg-indigo-500/90 text-white font-semibold shadow"
            >
              {n}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Ready:</div>
          <div className="text-amber-400">{isReady ? 'Yes' : 'No'}</div>
          <div className="text-gray-500">Cols:</div>
          <div className="text-amber-400">{cols}</div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">{Math.round(state.progress * 100)}%</div>
          <div className="text-gray-500">State:</div>
          <div className="text-indigo-400">
            {state.completed ? 'Completed' : state.paused ? 'Paused' : 'Playing'}
          </div>
        </div>
      </div>
    </DemoSection>
  );
};

export default LayoutDemo;
