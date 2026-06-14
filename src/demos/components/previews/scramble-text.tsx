import { memo, useCallback, useRef, useState } from 'react';
import { useAnimeScramble } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

const TEXTS = ['Scramble Text', 'Hello World!', 'React + Anime.js', 'Decoded ✦'];

export const ScrambleTextPreview = memo(function ScrambleTextPreview(_props: PreviewProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const [idx, setIdx] = useState(0);

  // Autoplay on mount with a custom charset + cursor, so the card is alive in
  // the gallery immediately and shows off more of the hook than just `text`.
  const { rescramble, isReady } = useAnimeScramble({
    target: targetRef,
    params: {
      text: TEXTS[idx],
      chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#',
      cursor: true,
    },
    autoplay: true,
  });

  const handleShuffle = useCallback(() => {
    setIdx((i) => (i + 1) % TEXTS.length);
    // Let React commit the new text into params, then re-trigger the scramble.
    setTimeout(() => rescramble(), 50);
  }, [rescramble]);

  return (
    <PreviewCard
      title="Scramble Text"
      description="Decoding character scramble"
      controls={
        <DemoButton onClick={handleShuffle} variant="accent" small>
          Shuffle
        </DemoButton>
      }
    >
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Framed terminal-style stage so the scramble reads as a display */}
        <div className="w-full max-w-64 rounded-xl border border-landing-border/60 bg-landing-surface/40 px-5 py-6 flex items-center justify-center min-h-20">
          <p
            ref={targetRef}
            className="landing-font-mono text-base font-bold text-center text-landing-accent tabular-nums"
            style={{
              letterSpacing: '0.02em',
              textShadow: '0 0 16px color-mix(in oklch, var(--landing-accent) 35%, transparent)',
            }}
          >
            {TEXTS[idx]}
          </p>
        </div>

        {/* Progress dots showing position in the text cycle */}
        <div className="flex items-center gap-1.5">
          {TEXTS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === idx ? 'w-5 bg-landing-accent' : 'w-1.5 bg-landing-border'
              }`}
            />
          ))}
        </div>

        <span className="landing-font-mono text-[8px] tracking-[0.2em] uppercase text-landing-muted/60">
          {isReady ? 'cursor · custom chars' : 'initializing…'}
        </span>
      </div>
    </PreviewCard>
  );
});
