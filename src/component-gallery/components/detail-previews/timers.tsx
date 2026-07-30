import { memo } from 'react';
import { useAnimeTimer } from '@shakibdshy/react-animejs';
import { DemoButton, PreviewCard, StatBlock } from './shared';
import type { PreviewProps } from './types';

export const TimersPreview = memo(function TimersPreview(_props: PreviewProps) {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 1000,
    loop: true,
    autoplay: true,
    frameRate: 30,
  });

  return (
    <PreviewCard
      title="Standalone Timer"
      description="Looping timer with playback controls"
      controls={
        <>
          <DemoButton onClick={controls.play} variant="accent" disabled={isRunning} small>
            Play
          </DemoButton>
          <DemoButton onClick={controls.pause} variant="surface" small>
            Pause
          </DemoButton>
          <DemoButton onClick={() => controls.restart()} variant="ghost" small>
            Restart
          </DemoButton>
        </>
      }
    >
      <div className="flex gap-4 w-full justify-center">
        <StatBlock label="Time" value={Math.round(state.currentTime)} accent />
        <StatBlock label="Progress" value={`${Math.round(state.progress * 100)}%`} />
        <StatBlock label="Iteration" value={state.currentIteration} />
      </div>
    </PreviewCard>
  );
});
