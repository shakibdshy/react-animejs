/**
 * SplitTextCjkDemo - Demonstrates CJK text splitting with Intl.Segmenter
 * Language-aware word splitting for Japanese, Chinese, and Thai
 * Uses pure declarative components.
 */

import React, { useRef, useState } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import { DemoCard } from '../DemoCard';

export const SplitTextCjkDemo: React.FC = () => {
  const [lang, setLang] = useState<'japanese' | 'chinese' | 'thai'>('japanese');
  const splitRef = useRef<SplitTextRef>(null);

  const textSamples = {
    japanese: 'アニメ',
    chinese: '动画',
    thai: 'ภาษา',
  };

  return (
    <DemoCard
      title="cjk text"
      description="Language-aware splitting using Intl.Segmenter for Japanese, Chinese, and Thai."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(['japanese', 'chinese', 'thai'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                lang === l
                  ? 'bg-demo-accent text-demo-bg'
                  : 'bg-demo-card text-demo-text-secondary hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <AnimeTimeline key={lang} loop autoplay defaults={{ ease: 'outBack', duration: 400 }}>
            <SplitText
              ref={splitRef}
              params={{
                lines: false,
                words: true,
                chars: true,
              }}
            >
              <p className="text-5xl md:text-6xl font-black text-white text-center leading-tight">
                {textSamples[lang]}
              </p>
            </SplitText>

            <SplitTextEntry
              splitRef={splitRef}
              splitMode="chars" // CJK chars array is usually filled dynamically via Intl.Segmenter
              opacity={[0, 1]}
              scale={[0.5, 1]}
              stagger={80}
            />
          </AnimeTimeline>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• Uses Intl.Segmenter for word boundaries</p>
          <p>• Continuous declarative loop animation</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextCjkDemo;
