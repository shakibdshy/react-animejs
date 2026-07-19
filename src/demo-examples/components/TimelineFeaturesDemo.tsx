import React, { useRef, useState } from 'react';
import { AnimeTimeline } from '@/lib/react-animejs/components';
import { DemoSection } from './DemoSection';
import { TimelineDemoFrame } from './TimelineDemoFrame';

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
          <TimelineDemoFrame
            title="Advanced timeline features"
            controls={(
              <>
              <button 
                onClick={controls.play}
                className="timeline-demo-text-button"
              >
                Play Timeline
              </button>
              <button 
                onClick={controls.restart}
                className="timeline-demo-text-button"
              >
                Restart
              </button>
              </>
            )}
          >

            <div className="flex flex-1 flex-col justify-center gap-4 rounded-2xl border border-demo-border bg-demo-bg p-6 shadow-inner">
              <div className="flex items-center gap-4">
                <div ref={box1Ref} className="w-10 h-10 bg-demo-accent rounded-sm demo-stage-glow-soft"></div>
                <span className="text-xs text-demo-text-secondary">Animation 1 (pos: 0)</span>
              </div>
              <div className="flex items-center gap-4">
                <div ref={box2Ref} className="w-10 h-10 bg-demo-accent/70 rounded-sm demo-stage-glow-soft"></div>
                <span className="text-xs text-demo-text-secondary">{'Animation 2 (pos: "<")'}</span>
              </div>
              <div className="flex items-center gap-4">
                <div ref={box3Ref} className="w-10 h-10 bg-demo-accent/45 rounded-sm demo-stage-glow-soft"></div>
                <span className="text-xs text-demo-text-secondary">{'Animation 3 (pos: "+=")'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-demo-bg p-4 rounded-lg border border-demo-border">
              <div className="text-demo-text-muted">Last Event:</div>
              <div className="text-demo-accent">{lastEvent}</div>
              <div className="text-demo-text-muted">Progress:</div>
              <div className="text-demo-accent">{Math.round(state.progress * 100)}%</div>
            </div>

            <div className="space-y-1 border-t border-demo-border pt-5 text-xs text-demo-text-muted">
              <p>• Uses <code>position</code> for relative timing (<code>&lt;</code>, <code>&gt;</code>, <code>+=</code>).</p>
              <p>• Demonstrates <code>callback</code> (function calls) within the timeline.</p>
              <p>• Shows <code>timer</code> entries (pauses/delays) without targets.</p>
              <p>• Uses <code>labels</code> for marking positions.</p>
            </div>
          </TimelineDemoFrame>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default TimelineFeaturesDemo;
