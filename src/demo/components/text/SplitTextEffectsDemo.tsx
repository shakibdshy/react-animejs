/**
 * SplitTextEffectsDemo - Demonstrates text splitting with different effects
 * Uses pure declarative components.
 */

import React, { useRef, useState } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import { DemoCard } from '../DemoCard';

export const SplitTextEffectsDemo: React.FC = () => {
  const [effectType, setEffectType] = useState<'fadeUp' | 'wave' | 'scale' | 'rotate'>('fadeUp');
  const splitRef = useRef<SplitTextRef>(null);

  const effectDescriptions = {
    fadeUp: 'Fade up with stagger',
    wave: 'Wave effect from left to right',
    scale: 'Scale in with bounce',
    rotate: 'Rotate in character by character',
  };

  let animationProps: Record<string, unknown> = {};
  let staggerValue = 30;

  if (effectType === 'fadeUp') {
    animationProps = {
      opacity: [0, 1],
      translateY: [40, 0],
    };
    staggerValue = 30;
  } else if (effectType === 'wave') {
    animationProps = {
      opacity: [0, 1],
      translateY: [0, -30, 0],
      rotate: [-5, 5, 0],
    };
    staggerValue = 50;
  } else if (effectType === 'scale') {
    animationProps = {
      opacity: [0, 1],
      scale: [0, 1],
    };
    staggerValue = 20;
  } else {
    animationProps = {
      opacity: [0, 1],
      rotateY: [-90, 0],
    };
    staggerValue = 40;
  }

  return (
    <DemoCard
      title="split effects"
      description="Different animation effects on split text elements with continuous loops."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(['fadeUp', 'wave', 'scale', 'rotate'] as const).map((effect) => (
            <button
              key={effect}
              onClick={() => {
                setEffectType(effect);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                effectType === effect
                  ? 'bg-demo-accent text-demo-bg'
                  : 'bg-demo-card text-demo-text-secondary hover:text-white'
              }`}
            >
              {effect}
            </button>
          ))}
        </div>

        <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <AnimeTimeline
            key={effectType}
            loop
            autoplay
            defaults={{
              ease:
                effectType === 'wave'
                  ? 'outElastic(1, .3)'
                  : effectType === 'scale'
                    ? 'outBack'
                    : 'outExpo',
              duration: effectType === 'scale' ? 400 : effectType === 'wave' ? 600 : 800,
            }}
          >
            <SplitText ref={splitRef} params={{ lines: true, words: true, chars: true }}>
              <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
                Anime.js
              </p>
            </SplitText>

            <SplitTextEntry
              splitRef={splitRef}
              splitMode="chars"
              {...animationProps}
              stagger={staggerValue}
            />
          </AnimeTimeline>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• Effect: {effectDescriptions[effectType]}</p>
          <p>• Continuous declarative loop animation</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextEffectsDemo;
