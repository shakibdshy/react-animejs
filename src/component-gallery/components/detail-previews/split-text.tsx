import { memo, useRef, useState } from 'react';
import {
  AnimeTimeline,
  type AnimeTimelineRef,
  SplitText,
  SplitTextEntry,
  type SplitTextRef,
} from '@/lib/react-animejs/components';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

/**
 * SplitText preview.
 *
 * Uses the declarative `SplitText` + `SplitTextEntry` + `AnimeTimeline` pattern
 * (the same one the full demos use). The animation is bound to the split
 * elements themselves, so it reliably targets characters — unlike an
 * imperative `useAnime({ selector })` setup, which captures its targets at
 * mount time before any splitting has happened.
 *
 * `autoplay: false` + a "Split" button calling `controls.restart()` keeps the
 * click-to-play interaction the preview grid expects.
 */
export const SplitTextPreview = memo(function SplitTextPreview(_props: PreviewProps) {
  const timelineRef = useRef<AnimeTimelineRef>(null);
  const splitRef = useRef<SplitTextRef>(null);
  const [played, setPlayed] = useState(false);

  const handlePlay = () => {
    setPlayed(true);
    // restart() resets to the beginning and plays, so repeated clicks re-trigger it.
    timelineRef.current?.controls.restart();
  };

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
      <AnimeTimeline
        ref={timelineRef}
        autoplay={false}
        defaults={{ ease: 'outBack', duration: 600 }}
      >
        <SplitText ref={splitRef} params={{ lines: true, words: true, chars: true }}>
          <p
            className="text-xl font-semibold tracking-wide text-center leading-tight"
            style={{ color: 'var(--color-landing-text, #e2e0d9)' }}
          >
            {played ? 'SplitText' : 'SplitText'}
          </p>
        </SplitText>

        <SplitTextEntry
          splitRef={splitRef}
          splitMode="chars"
          opacity={[0, 1]}
          translateY={[40, 0]}
          scale={[0.8, 1]}
          stagger={40}
        />
      </AnimeTimeline>
    </PreviewCard>
  );
});
