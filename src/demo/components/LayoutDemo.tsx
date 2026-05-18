import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';

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
      { duration: 800, ease: 'outExpo' }
    );
    setCols(nextCols);
  }, []);

  const toggleItem = useCallback(() => {
    const nextHidden = !isHidden;
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        const item = root.querySelector('[data-layout-demo-item="4"]') as HTMLElement | null;
        if (!item) return;
        item.style.display = nextHidden ? 'none' : '';
      },
      {
        duration: 600,
        ease: 'outExpo',
        enterFrom: { opacity: 0, scale: 0.5 },
        leaveTo: { opacity: 0, scale: 0.5 },
      }
    );
    setIsHidden(nextHidden);
  }, [isHidden]);

  const items = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  return (
    <DemoCard
      title="<Automatic Layout>"
      description="Fluid transitions between different grid configurations."
      footer={
        <>
          <label className="text-xs text-landing-muted landing-font-mono">Columns</label>
          <select
            value={cols}
            onChange={(e) => setGridColumns(Number(e.target.value))}
            className="bg-landing-bg text-landing-fg border border-landing-border rounded px-2 py-1 text-xs landing-font-mono"
          >
            <option value="2">2 Columns</option>
            <option value="3">3 Columns</option>
            <option value="4">4 Columns</option>
          </select>
          <label className="text-xs text-landing-muted landing-font-mono ml-4">Item 4</label>
          <button
            onClick={toggleItem}
            className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${isHidden ? 'bg-landing-accent/20 text-landing-accent border border-landing-accent/30' : 'bg-landing-bg text-landing-fg border border-landing-border'}`}
          >
            {isHidden ? 'Hidden' : 'Visible'}
          </button>
        </>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        duration={800}
        ease="outExpo"
        className="w-full grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((n) => (
          <AnimeLayoutItem
            key={n}
            data-layout-demo-item={n}
            as={DemoBox}
            className="w-full flex items-center justify-center font-bold"
          >
            {n}
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
    </DemoCard>
  );
};
export default LayoutDemo;
