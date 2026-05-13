import { memo, useCallback, useRef } from 'react';
import { useAnimatable } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const AnimatablePreview = memo(function AnimatablePreview(_props: PreviewProps) {
  const cubeRef = useRef<HTMLDivElement>(null);

  const { animatable, isReady } = useAnimatable(
    {
      x: { duration: 800, ease: 'inOutQuad' },
    },
    cubeRef
  );

  const handleMoveRight = useCallback(() => {
    if (animatable.current && isReady) {
      (animatable.current as any).x(100);
    }
  }, [animatable, isReady]);

  const handleReset = useCallback(() => {
    if (animatable.current && isReady) {
      (animatable.current as any).x(0);
    }
  }, [animatable, isReady]);

  return (
    <PreviewCard
      title="UseAnimatable"
      description="Reactive animation state"
      controls={
        <>
          <DemoButton onClick={handleMoveRight} variant="accent" small>
            Move →
          </DemoButton>
          <DemoButton onClick={handleReset} variant="surface" small>
            ← Reset
          </DemoButton>
        </>
      }
    >
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="relative w-full h-12 flex items-center">
          <div ref={cubeRef} className="w-10 h-10 rounded-lg bg-landing-accent shadow-lg" />
        </div>
        <span className="landing-font-mono text-[10px] text-landing-muted">
          {isReady ? 'Ready — use buttons to animate' : 'Initializing...'}
        </span>
      </div>
    </PreviewCard>
  );
});
