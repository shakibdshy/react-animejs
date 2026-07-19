import React, { useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { stagger } from 'animejs';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';
import { DemoBtn } from '@/landing/components/base/demo-btn';

export const LayoutStaggerDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [staggerFrom, setStaggerFrom] = useState<'first' | 'last' | 'center'>('first');
  const [staggerDelay, setStaggerDelay] = useState(75);
  const [isRow, setIsRow] = useState(true);

  const toggleLayout = () => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.classList.toggle('flex-row');
        root.classList.toggle('flex-col');
      },
      {
        delay: stagger(staggerDelay, { from: staggerFrom }),
      }
    );
    setIsRow(!isRow);
  };

  const items = ['1', '2', '3', '4', '5', '6'];

  return (
    <DemoCard
      title="<Staggered Layout>"
      description="Apply sequential delays to layout transitions."
      code={`layoutRef.current?.update((layout) => {
  layout.root.classList.toggle('grid-cols-2');
}, {
  duration: 700,
  ease: 'outExpo',
  stagger: 80,
});`}
      footer={
        <>
          <label className="text-xs text-landing-muted landing-font-mono">Stagger Delay</label>
          <input
            type="range"
            min={25}
            max={200}
            value={staggerDelay}
            step={25}
            onChange={(e) => setStaggerDelay(Number(e.target.value))}
            className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-[11px] text-landing-muted landing-font-mono">{staggerDelay}ms</span>

          <label className="text-xs text-landing-muted landing-font-mono ml-4">From</label>
          <select
            value={staggerFrom}
            onChange={(e) => setStaggerFrom(e.target.value as any)}
            className="bg-landing-bg text-landing-fg border border-landing-border rounded px-2 py-1 text-xs landing-font-mono"
          >
            <option value="first">first</option>
            <option value="center">center</option>
            <option value="last">last</option>
          </select>
        </>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        childrenSelector=".stagger-item"
        duration={600}
        ease="outExpo"
        className={`w-full flex gap-3 items-center justify-center ${isRow ? 'flex-row' : 'flex-col'}`}
      >
        {items.map((item, index) => (
          <AnimeLayoutItem
            key={item}
            as={DemoBox}
            className="stagger-item font-bold"
            style={{
              borderColor: `hsla(${200 + index * 25}, 70%, 50%, 0.3)`,
              backgroundColor: `hsla(${200 + index * 25}, 70%, 50%, 0.1)`,
              color: `hsl(${200 + index * 25}, 70%, 60%)`,
            }}
          >
            {item}
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
      <div className="mt-6 flex justify-center w-full">
        <DemoBtn onClick={toggleLayout}>Toggle</DemoBtn>
      </div>
    </DemoCard>
  );
};
export default LayoutStaggerDemo;
