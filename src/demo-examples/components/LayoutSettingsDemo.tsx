import React, { useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@shakibdshy/react-animejs';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';
import { DemoBtn } from '@/landing/components/base/demo-btn';

export const LayoutSettingsDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [duration, setDuration] = useState(500);
  const [delay, setDelay] = useState(0);
  const [useStagger, setUseStagger] = useState(false);
  const [isRow, setIsRow] = useState(false);

  const toggleLayout = () => {
    layoutRef.current?.update((layout) => {
      const root = layout.root as HTMLElement;
      root.classList.toggle('flex-row');
      root.classList.toggle('flex-col');
    });
    setIsRow(!isRow);
  };

  const items = ['A', 'B', 'C', 'D', 'E'];

  return (
    <DemoCard
      title="<Layout Settings>"
      description="Configure duration, delay, and staggering."
      code={`<AnimeLayout
  duration={duration}
  delay={delay}
  ease="outExpo"
  stagger={stagger}
>
  {items.map((item) => <AnimeLayoutItem key={item.id} layoutId={item.id} />)}
</AnimeLayout>`}
      footer={
        <>
          <label className="text-xs text-landing-muted landing-font-mono">Duration</label>
          <input
            type="range"
            min={100}
            max={1500}
            value={duration}
            step={100}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-[11px] text-landing-muted landing-font-mono">{duration}ms</span>

          <label className="text-xs text-landing-muted landing-font-mono ml-4">Delay</label>
          <input
            type="range"
            min={0}
            max={500}
            value={delay}
            step={50}
            disabled={useStagger}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer disabled:opacity-30"
          />
          <span className="text-[11px] text-landing-muted landing-font-mono">{delay}ms</span>

          <label className="text-xs text-landing-muted landing-font-mono ml-4 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useStagger}
              onChange={(e) => setUseStagger(e.target.checked)}
              className="cursor-pointer accent-landing-accent"
            />
            Stagger
          </label>
        </>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        duration={duration}
        delay={useStagger ? 50 : delay}
        className={`w-full flex gap-3 items-center justify-center ${isRow ? 'flex-row' : 'flex-col'}`}
      >
        {items.map((item) => (
          <AnimeLayoutItem key={item} as={DemoBox} className="font-bold">
            {item}
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
      <div className="mt-6 flex justify-center w-full">
        <DemoBtn onClick={toggleLayout}>Toggle Layout</DemoBtn>
      </div>
    </DemoCard>
  );
};
export default LayoutSettingsDemo;
