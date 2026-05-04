/**
 * SplitTextBasicDemo - Demonstrates basic text splitting with SplitText component
 * Uses pure declarative components without any imperative hook wrappers for the cleanest DX.
 */

import React, { useRef, useState } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import { DemoCard } from '../DemoCard';

export const SplitTextBasicDemo: React.FC = () => {
  const [splitMode, setSplitMode] = useState<'chars' | 'words' | 'lines'>('chars');
  const splitRef = useRef<SplitTextRef>(null);

  // Derive which parts of the TextSplitter we need initialized based on the active mode
  const splitParams =
    splitMode === 'chars'
      ? { lines: false, words: false, chars: true }
      : splitMode === 'words'
        ? { lines: false, words: true, chars: false }
        : { lines: true, words: false, chars: false };

  return (
    <DemoCard
      title="basic split"
      description="SplitText — declarative text splitting with continuous loop animations."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(['chars', 'words', 'lines'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSplitMode(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                splitMode === mode
                  ? 'bg-demo-accent text-demo-bg'
                  : 'bg-demo-card text-demo-text-secondary hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center">
          {/* 
            Clean, developer-friendly declarative timeline logic.
            We don't need any useEffects, refs for imperative commands, or manual callbacks.
          */}
          <AnimeTimeline
            key={splitMode}
            loop
            autoplay
            defaults={{ ease: 'outExpo', duration: 600 }}
          >
            {/* SplitText wraps the text elements and provides the split reference */}
            <SplitText ref={splitRef} params={splitParams}>
              <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
                Hello World
              </p>
            </SplitText>

            {/* SplitTextEntry automatically pulls the sub-elements (chars) and appends to the parent AnimeTimeline! */}
            <SplitTextEntry
              splitRef={splitRef}
              splitMode={splitMode}
              opacity={[0, 1]}
              translateY={[20, 0]}
              stagger={30}
            />
          </AnimeTimeline>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• Clean declarative implementation using Components</p>
          <p>• Switch modes to see different split levels</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextBasicDemo;
