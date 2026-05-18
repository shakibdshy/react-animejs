import React, { useCallback, useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';
import { DemoBtn } from '@/landing/components/base/demo-btn';

export const LayoutMethodsDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [cols, setCols] = useState(2);

  const useRecordAnimate = useCallback(() => {
    if (!layoutRef.current) return;
    layoutRef.current.record();
    const root = layoutRef.current.getElement();
    if (root) {
      const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;
      root.style.gridTemplateColumns = `repeat(${nextCols}, 1fr)`;
      setCols(nextCols);
    }
    layoutRef.current.animate({ duration: 500 });
  }, [cols]);

  const useUpdate = useCallback(() => {
    const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${nextCols}, minmax(0, 1fr))`;
      },
      { duration: 700, ease: 'outBack' }
    );
    setCols(nextCols);
  }, [cols]);

  const useRevert = useCallback(() => {
    layoutRef.current?.revert();
    setCols(2);
  }, []);

  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DemoCard
      title="<Layout Methods>"
      description="Directly control the layout engine with programmatic methods."
      footer={
        <div className="flex flex-wrap gap-2 w-full">
          <DemoBtn
            variant="outline"
            onClick={useRecordAnimate}
            className="flex-1 text-[11px] px-3 py-1.5 border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
          >
            record() & animate()
          </DemoBtn>
          <DemoBtn
            variant="outline"
            onClick={useUpdate}
            className="flex-1 text-[11px] px-3 py-1.5 border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
          >
            update()
          </DemoBtn>
          <DemoBtn
            variant="outline"
            onClick={useRevert}
            className="flex-1 text-[11px] px-3 py-1.5 border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            revert()
          </DemoBtn>
        </div>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        duration={600}
        ease="outExpo"
        className="w-full grid gap-3 min-h-[120px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.map((item) => (
          <AnimeLayoutItem
            key={item}
            layoutId={`method-item-${item}`}
            as={DemoBox}
            className="w-full flex items-center justify-center font-bold text-xs"
          >
            {item}
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
    </DemoCard>
  );
};
export default LayoutMethodsDemo;
