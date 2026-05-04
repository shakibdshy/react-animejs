import React, { useRef, useState } from 'react';
import { AnimeTimeline } from '@/lib/react-animejs/components';
import { DemoSection } from './DemoSection';

/**
 * TimelineFeaturesDemo - Demonstrates advanced Anime.js v4 timeline features
 * - Adding animations with relative positions (<, >, +=, -=)
 * - Adding timers
 * - Function calls (call)
 * - Labels
 */
export const TimelineFeaturesDemo: React.FC = () => {
  const [lastEvent, setLastEvent] = useState<string>('None');
  
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);

  const entries = [
    { label: 'start' },
    {
      targets: box1Ref,
      translateX: 200,
      duration: 1000,
      position: 0,
    },
    {
      callback: () => setLastEvent('First Animation Done'),
      position: '+=0',
    },
    {
      targets: box2Ref,
      translateX: 200,
      duration: 1000,
      position: '<',
    },
    {
      duration: 500,
      position: '+=',
    },
    {
      targets: box3Ref,
      translateX: 200,
      duration: 1000,
      position: '+=',
    },
    {
      callback: () => setLastEvent('Back at start!'),
      position: 'start',
    },
  ];

  return (
    <AnimeTimeline
      autoplay={false}
      onBegin={() => setLastEvent('Timeline Began')}
      onComplete={() => setLastEvent('Timeline Completed')}
      entries={entries}
    >
      {({ controls, state }) => (
        <DemoSection title="Advanced Timeline Features">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-4">
              <button 
                onClick={controls.play}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                Play Timeline
              </button>
              <button 
                onClick={controls.restart}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Restart
              </button>
            </div>

            <div className="flex flex-col gap-4 bg-demo-card p-6 rounded-xl border border-demo-border">
              <div className="flex items-center gap-4">
                <div ref={box1Ref} className="w-10 h-10 bg-indigo-500 rounded-sm shadow-lg"></div>
                <span className="text-xs text-gray-400">Animation 1 (pos: 0)</span>
              </div>
              <div className="flex items-center gap-4">
                <div ref={box2Ref} className="w-10 h-10 bg-purple-500 rounded-sm shadow-lg"></div>
                <span className="text-xs text-gray-400">Animation 2 (pos: '&lt;')</span>
              </div>
              <div className="flex items-center gap-4">
                <div ref={box3Ref} className="w-10 h-10 bg-pink-500 rounded-sm shadow-lg"></div>
                <span className="text-xs text-gray-400">Animation 3 (pos: '+=')</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-demo-border">
              <div className="text-gray-500">Last Event:</div>
              <div className="text-amber-400">{lastEvent}</div>
              <div className="text-gray-500">Progress:</div>
              <div className="text-amber-400">{Math.round(state.progress * 100)}%</div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Uses <code>position</code> for relative timing (<code>&lt;</code>, <code>&gt;</code>, <code>+=</code>).</p>
              <p>• Demonstrates <code>callback</code> (function calls) within the timeline.</p>
              <p>• Shows <code>timer</code> entries (pauses/delays) without targets.</p>
              <p>• Uses <code>labels</code> for marking positions.</p>
            </div>
          </div>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default TimelineFeaturesDemo;
