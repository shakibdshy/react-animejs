import React, { useRef } from 'react';
import { useAnime, useAnimeTimeline } from '@/lib/react-animejs/hooks';
import { AnimeTimeline } from '@/lib/react-animejs/components';
import { DemoSection } from './DemoSection';
import { TimelineDemoFrame } from './TimelineDemoFrame';

/**
 * SyncTimelinesDemo - Demonstrates syncing multiple timelines together
 */
export const SyncTimelinesDemo: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  // 1. Standalone animation to be synced into tlA
  const { animation: circleAnimation, isReady: isCircleReady } = useAnime({
    targets: circleRef,
    translateX: '15rem',
    autoplay: false,
    duration: 1000,
  });

  // 2. Timeline A: Sequences circle, triangle, and square movements
  const { timeline: tlA, isReady: isAReady } = useAnimeTimeline(
    {
      autoplay: false,
      enabled: isCircleReady,
    },
    [
      { target: circleAnimation, position: 0 },
      { 
        targets: triangleRef,
        translateX: '15rem',
        duration: 2000,
        position: '+=0'
      },
      { 
        targets: squareRef,
        translateX: '15rem',
        duration: 1000,
        position: '+=0'
      }
    ]
  );

  // 3. Timeline B: Overlapping rotations and scaling
  const { timeline: tlB, isReady: isBReady } = useAnimeTimeline(
    { 
      autoplay: false,
      defaults: { duration: 2000 }
    },
    [
      { 
        targets: [triangleRef, squareRef],
        rotate: 360,
        position: 0
      },
      { 
        targets: circleRef,
        scale: [1, 1.5, 1],
        position: 0
      }
    ]
  );

  // 4. Main Timeline: Syncs tlA and tlB
  // Only initialize tlMain when tlA and tlB are ready
  const mainEntries = [
    { target: tlA, position: 0 },
    { target: tlB, position: '-=2000' },
  ];

  const tlAWidth = 100; // 4000/4000
  const tlBWidth = 50;  // 2000/4000
  const tlBOffset = 50; // Starts at 2000ms

  return (
    <AnimeTimeline
      autoplay={false}
      enabled={isAReady && isBReady}
      entries={mainEntries}
    >
      {({ controls, state }) => (
        <DemoSection title="Timeline: Sync Timelines">
          <TimelineDemoFrame
            title="Sync timelines"
            controls={(
              <>
            <button 
              onClick={controls.restart}
              aria-label="Restart timeline"
              className="text-demo-accent hover:text-demo-accent/80 transition-colors"
              title="Restart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
            <button 
              onClick={state.paused ? controls.play : controls.pause}
              aria-label={state.paused ? 'Play timeline' : 'Pause timeline'}
              className="text-demo-accent hover:text-demo-accent/80 transition-colors"
            >
              {state.paused ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              )}
            </button>
              </>
            )}
          >

        {/* Animation Stage */}
        <div className="relative h-64 w-full bg-demo-bg rounded-2xl border border-demo-border p-6 overflow-hidden shadow-inner">
          <div className="relative w-full h-full flex items-center">
            {/* Square */}
            <div 
              ref={squareRef} 
              className="absolute left-6 w-16 h-16 bg-demo-accent rounded-2xl demo-stage-glow z-10"
            ></div>

            {/* Triangle */}
            <div 
              ref={triangleRef} 
              className="absolute left-12 w-0 h-0 border-l-35 border-l-transparent border-r-35 border-r-transparent border-b-60 border-b-demo-accent demo-stage-drop-glow z-20 -translate-y-8"
            ></div>

            {/* Circle */}
            <div 
              ref={circleRef} 
              className="absolute left-16 w-16 h-16 bg-demo-accent rounded-full demo-stage-glow z-30 flex items-center justify-center border-2 border-demo-accent"
            >
              <div className="w-6 h-6 rounded-full border-4 border-demo-bg"></div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative w-full h-24 flex flex-col justify-end gap-3 px-12">
          {/* Bar 1 (Timeline A) */}
          <div 
            className="h-3 bg-demo-accent/20 rounded-full relative"
            style={{ width: `${tlAWidth}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-demo-accent/20 rounded-full border-2 border-demo-accent/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-demo-accent"></div>
            </div>
            <div 
              className="absolute top-0 left-0 h-full bg-demo-accent demo-stage-glow-strong rounded-full"
              style={{ width: `${state.progress * 100}%` }}
            />
          </div>

          {/* Bar 2 (Timeline B) */}
          <div 
            className="h-3 bg-demo-accent/20 rounded-full relative"
            style={{ width: `${tlBWidth}%`, marginLeft: `${tlBOffset}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-demo-accent/20 rounded-lg border-2 border-demo-accent/40 shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 bg-demo-accent rounded-sm"></div>
            </div>
            <div 
              className="absolute top-0 left-0 h-full bg-demo-accent demo-stage-glow-strong rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((state.currentTime - 2000) / 2000) * 100))}%` }}
            />
          </div>

          {/* Current position marker */}
          <div 
            className="absolute bottom-0 w-0.5 h-full bg-demo-accent/60 demo-stage-glow-strong z-20"
            style={{ left: `${state.progress * 100}%` }}
          />
        </div>

        <div className="space-y-3 pt-6 border-t border-demo-border">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-demo-accent"></div>
            <span className="text-xs text-demo-text-muted font-bold tracking-widest uppercase">Timelines can be synchronised to another timeline using the sync() method.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-demo-accent"></div>
            <span className="text-xs text-demo-text-muted font-bold tracking-widest uppercase">Complex nesting and relative positioning control.</span>
          </div>
        </div>
          </TimelineDemoFrame>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default SyncTimelinesDemo;
