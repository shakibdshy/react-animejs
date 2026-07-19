import { memo, useCallback, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const BasicAnimationPreview = memo(function BasicAnimationPreview(_props: PreviewProps) {
  const boxes = ['A', 'B', 'C', 'D', 'E'];
  const [running, setRunning] = useState(false);

  const { controls } = useAnime({
    selector: '.basic-anim-box',
    translateX: [
      { to: 120, duration: 600 },
      { to: 0, duration: 400 },
    ],
    scale: [
      { to: 1.2, duration: 300 },
      { to: 1, duration: 300 },
    ],
    stagger: 80,
    ease: 'inOutQuad',
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    setRunning(true);
    controls.restart();
    setTimeout(() => setRunning(false), 1200);
  }, [controls]);

  return (
    <PreviewCard
      title="Basic Animation"
      description="CSS selectors, stagger, easing"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" disabled={running} small>
          {running ? 'Playing...' : 'Play'}
        </DemoButton>
      }
    >
      <div className="flex gap-3">
        {boxes.map((b) => (
          <div
            key={b}
            className="basic-anim-box w-10 h-10 rounded-lg bg-landing-accent flex items-center justify-center landing-font-mono text-xs font-bold text-landing-bg"
          >
            {b}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});
