import { memo, useCallback, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const EasingsPreview = memo(function EasingsPreview(_props: PreviewProps) {
  const [activeEasing, setActiveEasing] = useState('linear');
  const easings = ['linear', 'easeInOutQuad', 'easeOutElastic', 'easeInOutBack', 'spring'];

  const { controls } = useAnime({
    selector: '.easing-dot',
    translateX: 150,
    duration: 1000,
    ease: activeEasing,
    autoplay: false,
    deps: [activeEasing],
  });

  const handleRun = useCallback(
    (easing: string) => {
      setActiveEasing(easing);
      setTimeout(() => controls.restart(), 50);
    },
    [controls]
  );

  return (
    <PreviewCard
      title="Easings"
      description="Cubic bezier, spring, steps"
      controls={easings.map((e) => (
        <DemoButton
          key={e}
          onClick={() => handleRun(e)}
          variant={e === activeEasing ? 'accent' : 'ghost'}
          small
        >
          {e}
        </DemoButton>
      ))}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="relative h-8 w-full">
          <div className="easing-dot w-8 h-8 rounded-full bg-landing-accent shadow-lg absolute top-0 left-0" />
        </div>
      </div>
    </PreviewCard>
  );
});
