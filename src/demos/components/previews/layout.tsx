import { memo, useCallback, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const LayoutPreview = memo(function LayoutPreview(_props: PreviewProps) {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const { controls } = useAnime({
    selector: '.layout-item',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 400,
    ease: 'outQuad',
    delay: 60,
    autoplay: false,
  });

  const handleShuffle = useCallback(() => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setTimeout(() => controls.restart(), 30);
  }, [controls]);

  return (
    <PreviewCard
      title="Layout"
      description="FLIP layout animation"
      controls={
        <DemoButton onClick={handleShuffle} variant="accent" small>
          Shuffle
        </DemoButton>
      }
    >
      <div className="grid grid-cols-2 gap-2 w-28">
        {items.map((n) => (
          <div
            key={n}
            className="layout-item h-7 rounded flex items-center justify-center text-[11px] font-mono"
            style={{
              backgroundColor: `var(--color-landing-card, rgba(255,255,255,0.08))`,
              color: `var(--color-landing-text, #e2e0d9)`,
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});
