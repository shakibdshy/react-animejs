/**
 * SplitTextAdvancedPropsDemo - Demonstrates advanced TextSplitter properties
 * Shows $target, debug, includeSpaces, and custom templates
 */

import React, { useRef, useState } from 'react';
import { AnimeTimeline, SplitText, SplitTextEntry } from '@/lib/react-animejs/components';
import type { SplitTextRef } from '@/lib/react-animejs/components';
import { DemoCard } from '../DemoCard';

export const SplitTextAdvancedPropsDemo: React.FC = () => {
  const splitRef = useRef<SplitTextRef>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [includeSpaces, setIncludeSpaces] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<'none' | 'custom-wrap' | 'data-attr'>('none');

  const handleToggleDebug = () => {
    setDebugMode((prev) => {
      const newVal = !prev;
      splitRef.current?.setDebug(newVal);
      return newVal;
    });
  };

  const handleToggleSpaces = () => {
    setIncludeSpaces((prev) => {
      const newVal = !prev;
      splitRef.current?.setIncludeSpaces(newVal);
      return newVal;
    });
  };

  const handleSetTemplate = (mode: 'none' | 'custom-wrap' | 'data-attr') => {
    setCustomTemplate(mode);
    if (mode === 'none') {
      splitRef.current?.setLineTemplate(false);
      splitRef.current?.setWordTemplate(false);
      splitRef.current?.setCharTemplate(false);
    } else if (mode === 'custom-wrap') {
      splitRef.current?.setCharTemplate('<span class="anime-char-custom">{value}</span>');
    } else if (mode === 'data-attr') {
      splitRef.current?.setCharTemplate((node) => {
        const el = node as HTMLElement;
        const char = el?.textContent || '';
        return `<span class="anime-char" data-char="${char}" data-code="${char.charCodeAt(0)}">${char}</span>`;
      });
    }
    splitRef.current?.refresh();
  };

  const targetElement = splitRef.current?.$target;

  return (
    <DemoCard
      title="advanced split properties"
      description="Debug mode, includeSpaces, custom templates, and $target access."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleToggleDebug}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
              debugMode
                ? 'bg-red-500 text-white'
                : 'bg-demo-card text-demo-text-secondary hover:text-white'
            }`}
          >
            debug: {debugMode ? 'on' : 'off'}
          </button>
          <button
            onClick={handleToggleSpaces}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
              includeSpaces
                ? 'bg-demo-accent text-demo-bg'
                : 'bg-demo-card text-demo-text-secondary hover:text-white'
            }`}
          >
            includeSpaces: {includeSpaces ? 'on' : 'off'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['none', 'custom-wrap', 'data-attr'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleSetTemplate(mode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                customTemplate === mode
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
            loop
            autoplay
            defaults={{ ease: 'outExpo', duration: 600 }}
          >
            <SplitText ref={splitRef} params={{ lines: true, words: true, chars: true }}>
              <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
                Advanced Props
              </p>
            </SplitText>

            <SplitTextEntry
              splitRef={splitRef}
              splitMode="chars"
              opacity={[0, 1]}
              translateY={[20, 0]}
              stagger={30}
            />
          </AnimeTimeline>
        </div>

        {targetElement && (
          <div className="bg-demo-card/50 rounded-xl p-4 border border-white/5">
            <p className="text-[10px] text-demo-text-secondary font-mono mb-2">$target element info:</p>
            <p className="text-[10px] text-demo-text-muted font-mono">
              tag: {targetElement.tagName} | class: {targetElement.className}
            </p>
          </div>
        )}

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• debug: Visualizes split boundaries with colored outlines</p>
          <p>• includeSpaces: Wraps space characters as separate elements</p>
          <p>• custom-wrap: Uses custom HTML string template for chars</p>
          <p>• data-attr: Uses function template to add data attributes</p>
          <p>• $target: Direct access to the root split element</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextAdvancedPropsDemo;
