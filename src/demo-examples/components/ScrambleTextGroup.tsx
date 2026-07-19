import React, { useRef, useState } from 'react';
import { useAnimeScramble } from '@/lib/react-animejs/hooks';
import { DemoCard } from './DemoCard';
import { DemoSection } from './DemoSection';

const texts = [
  'Transition between different text.',
  'Hello World!',
  'Anime.js 4.4.0 scrambleText()',
  'React AnimeJS Wrapper',
];

export const ScrambleTextBasicDemo: React.FC = () => {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const [textIndex, setTextIndex] = useState(0);

  const { rescramble, isReady } = useAnimeScramble({
    target: targetRef,
    params: { text: texts[textIndex] },
    autoplay: false,
  });

  const handleChange = () => {
    setTextIndex((i) => (i + 1) % texts.length);
    setTimeout(() => rescramble(), 50);
  };

  return (
    <DemoCard
      title="scrambleText basic"
      description="Cycle through different text with scramble effect."
      actions={
        <button
          onClick={handleChange}
          className="px-3 py-1.5 bg-demo-accent text-demo-bg rounded-lg text-[10px] font-bold uppercase tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        >
          Change Text
        </button>
      }
    >
      <p ref={targetRef} className="text-2xl font-bold text-demo-accent text-center">
        {!isReady ? 'Click Change Text to start' : ''}
      </p>
    </DemoCard>
  );
};

export const ScrambleTextAutoplayDemo: React.FC = () => {
  const targetRef = useRef<HTMLParagraphElement>(null);

  const { controls, isPlaying } = useAnimeScramble({
    target: targetRef,
    params: {
      text: 'Auto-playing scramble animation with custom settings!',
      chars: 'A-Za-z0-9',
    },
    autoplay: true,
  });

  return (
    <DemoCard
      title="scrambleText autoplay"
      description="Auto-playing with custom character set."
      controls={controls}
      isPlaying={isPlaying}
    >
      <p ref={targetRef} className="text-xl font-bold text-demo-accent text-center">
        Original text content here
      </p>
    </DemoCard>
  );
};

export const ScrambleTextOptionsDemo: React.FC = () => {
  const targetRef = useRef<HTMLParagraphElement>(null);

  const { rescramble, controls, isPlaying } = useAnimeScramble({
    target: targetRef,
    params: {
      text: 'Custom options: lower reveal rate, longer settle, cursor effect',
      chars: 'A-Za-z0-9!@#$%',
      revealRate: 30,
      settleDuration: 600,
      cursor: true,
    },
    autoplay: false,
  });

  return (
    <DemoCard
      title="scrambleText options"
      description="Custom revealRate, settleDuration, and cursor."
      controls={controls}
      isPlaying={isPlaying}
      actions={
        <button
          onClick={() => rescramble()}
          className="px-3 py-1.5 bg-demo-accent text-demo-bg rounded-lg text-[10px] font-bold uppercase tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        >
          Scramble
        </button>
      }
    >
      <p ref={targetRef} className="text-lg font-bold text-demo-accent text-center">
        Click Scramble to start
      </p>
    </DemoCard>
  );
};

export const ScrambleTextLoopDemo: React.FC = () => {
  const targetRef = useRef<HTMLParagraphElement>(null);

  useAnimeScramble({
    target: targetRef,
    params: {
      text: 'Looping scramble animation with reversed effect!',
      from: 'right',
      reversed: true,
    },
    autoplay: true,
    loop: true,
  });

  return (
    <DemoCard
      title="scrambleText loop"
      description="Looping animation with reversed and from-right settings."
    >
      <p ref={targetRef} className="text-xl font-bold text-demo-accent text-center">
        Original text
      </p>
    </DemoCard>
  );
};

export const ScrambleTextGroup: React.FC = () => {
  return (
    <DemoSection title="Scramble Text" frameChildren={false} codeId={false}>
      <ScrambleTextBasicDemo />
      <ScrambleTextAutoplayDemo />
      <ScrambleTextOptionsDemo />
      <ScrambleTextLoopDemo />
    </DemoSection>
  );
};

export default ScrambleTextGroup;
