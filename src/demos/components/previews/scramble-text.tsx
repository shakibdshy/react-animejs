import { memo, useCallback, useRef, useState } from 'react';
import { useAnimeScramble } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const ScrambleTextPreview = memo(function ScrambleTextPreview(_props: PreviewProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const texts = ['Hello World!', 'Scramble Text', 'React AnimeJS', 'Animation Magic'];
  const [idx, setIdx] = useState(0);

  const { rescramble, isReady } = useAnimeScramble({
    target: targetRef,
    params: { text: texts[idx] },
    autoplay: false,
  });

  const handleChange = useCallback(() => {
    const next = (idx + 1) % texts.length;
    setIdx(next);
    setTimeout(() => rescramble(), 50);
  }, [idx, texts.length, rescramble]);

  return (
    <PreviewCard
      title="Scramble Text"
      description="Text scramble/reveal effect"
      controls={
        <DemoButton onClick={handleChange} variant="accent" small>
          {isReady ? 'Change' : 'Start'}
        </DemoButton>
      }
    >
      <p
        ref={targetRef}
        className="landing-font-display text-lg text-landing-accent text-center min-h-8"
      >
        {!isReady ? 'Click Change to start' : ''}
      </p>
    </PreviewCard>
  );
});
