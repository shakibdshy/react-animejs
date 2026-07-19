/**
 * SplitTextAdvancedDemo - Demonstrates advanced text splitting mimicking
 * the official Anime.js v4 documentation example.
 *
 * Uses pure declarative timeline sequences!
 */

import React, { useRef } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import { stagger as animeStagger } from '@/lib/react-animejs/index';
import { DemoCard } from '../DemoCard';

export const SplitTextAdvancedDemo: React.FC = () => {
  const splitRef = useRef<SplitTextRef>(null);

  return (
    <DemoCard
      title="advanced timeline"
      description="Official Anime.js v4 text splitter capabilities reproduced using react-animejs components."
      code={`<AnimeTimeline defaults={{ ease: 'outExpo', duration: 700 }}>
  <SplitText ref={splitRef} params={{ lines: true, words: true }}>
    <p>Timeline controlled text</p>
  </SplitText>
  <SplitTextEntry splitRef={splitRef} splitMode="lines" stagger={120} />
</AnimeTimeline>`}
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <AnimeTimeline loop autoplay defaults={{ ease: 'inOut(3)', duration: 650 }}>
            <SplitText
              ref={splitRef}
              params={{
                words: { wrap: 'clip' },
                chars: true,
              }}
            >
              <p className="text-3xl md:text-xl font-black text-white text-center leading-tight">
                All-in-one text splitter
                <br />
                テキストスプリッター
              </p>
            </SplitText>

            {/* Stage 1: Words alternate sliding in from top/bottom */}
            <SplitTextEntry
              splitRef={splitRef}
              splitMode="words"
              y={[($el: HTMLElement) => (Number($el.dataset.line) % 2 ? '100%' : '-100%'), '0%']}
              stagger={125}
            />

            {/* Stage 2: Chars alternate sliding out top/bottom randomly */}
            <SplitTextEntry
              splitRef={splitRef}
              splitMode="chars"
              y={($el: HTMLElement) => (Number($el.dataset.line) % 2 ? '100%' : '-100%')}
              // Inject custom animeJS stagger objects via the native 'delay' property
              delay={animeStagger(10, { from: 'random' }) as any}
            />
          </AnimeTimeline>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• Clean declarative implementation mimicking official anime.js demo</p>
          <p>• Uses dataset.line for alternating y-axis animations</p>
          <p>• Combines sequential timeline staggering</p>
          <p>• Loops infinitely</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextAdvancedDemo;
