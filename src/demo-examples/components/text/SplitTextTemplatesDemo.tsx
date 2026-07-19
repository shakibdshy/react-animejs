/**
 * SplitTextTemplatesDemo - Demonstrates custom templates for split text
 * Uses pure declarative components.
 */

import React, { useRef, useState } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import type { TextSplitterParams } from 'animejs';
import { DemoCard } from '../DemoCard';

export const SplitTextTemplatesDemo: React.FC = () => {
  const [templateMode, setTemplateMode] = useState<'block' | 'clip' | 'accessible'>('block');
  const splitRef = useRef<SplitTextRef>(null);

  const templateConfigs = {
    block: {
      lines: true,
      words: true,
      chars: true,
    },
    clip: {
      lines: { wrap: 'clip' },
      words: { wrap: 'clip' },
      chars: { wrap: 'clip' },
    },
    accessible: {
      lines: true,
      words: true,
      chars: true,
      accessible: true,
    },
  } as const;

  return (
    <DemoCard
      title="split templates"
      description="Custom HTML templates and accessibility options for split text."
      code={`<SplitText
  params={{ words: true }}
  templates={{ word: '<span class="word">$1</span>' }}
>
  <p>Template driven text</p>
</SplitText>`}
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(['block', 'clip', 'accessible'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTemplateMode(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                templateMode === mode
                  ? 'bg-demo-accent text-demo-bg'
                  : 'bg-demo-card text-demo-text-secondary hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <AnimeTimeline
            key={templateMode}
            loop
            autoplay
            defaults={{ ease: 'outExpo', duration: 600 }}
          >
            <SplitText ref={splitRef} params={templateConfigs[templateMode] as TextSplitterParams}>
              <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
                Split Me
              </p>
            </SplitText>

            <SplitTextEntry
              splitRef={splitRef}
              splitMode="chars"
              opacity={[0, 1]}
              translateY={[20, 0]}
              rotate={[-10, 0]}
              stagger={30}
            />
          </AnimeTimeline>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• block: Wraps elements in block spans</p>
          <p>• clip: Overflow clipping for animations</p>
          <p>• accessible: Preserves screen reader text</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextTemplatesDemo;
