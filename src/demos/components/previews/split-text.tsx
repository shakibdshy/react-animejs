import { memo, useCallback, useRef, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const SplitTextPreview = memo(function SplitTextPreview(_props: PreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { controls } = useAnime({
    selector: '.split-char',
    translateY: [40, 0],
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    delay: 40,
    ease: 'outBack',
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    if (!ref.current) return;
    const text = 'SplitText';
    ref.current.innerHTML = text
      .split('')
      .map((c) => `<span class="split-char inline-block">${c === ' ' ? '\u00A0' : c}</span>`)
      .join('');
    setPlaying(true);
    setTimeout(() => controls.restart(), 20);
  }, [controls]);

  return (
    <PreviewCard
      title="SplitText"
      description="Character text splitting"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" small>
          Split
        </DemoButton>
      }
    >
      <div
        ref={ref}
        className="text-xl font-semibold tracking-wide h-8 flex items-center justify-center"
        style={{ color: 'var(--color-landing-text, #e2e0d9)' }}
      >
        {!playing && 'SplitText'}
      </div>
    </PreviewCard>
  );
});
