import { memo, useCallback, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const ScopePreview = memo(function ScopePreview(_props: PreviewProps) {
  const [count, setCount] = useState(0);
  const { controls } = useAnime({
    selector: '.scope-dot',
    scale: [
      { to: 1.5, duration: 200 },
      { to: 1, duration: 300 },
    ],
    stagger: 50,
    autoplay: false,
  });

  const handleTrigger = useCallback(() => {
    setCount((c) => c + 1);
    controls.restart();
  }, [controls]);

  return (
    <PreviewCard
      title="Scope"
      description="Scoped animation contexts"
      controls={
        <DemoButton onClick={handleTrigger} variant="accent" small>
          Trigger ({count})
        </DemoButton>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="scope-dot w-8 h-8 rounded-full bg-landing-accent/60" />
        ))}
      </div>
    </PreviewCard>
  );
});
