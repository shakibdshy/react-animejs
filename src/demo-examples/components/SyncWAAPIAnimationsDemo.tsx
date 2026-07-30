import React, { useState } from 'react';
import type { WAAPIAnimation } from '@shakibdshy/react-animejs';
import type { AnimeWAAPIRef } from '@shakibdshy/react-animejs';
import { AnimeTimeline, AnimeWAAPI } from '@shakibdshy/react-animejs';
import { DemoSection } from './DemoSection';
import { TimelineDemoFrame } from './TimelineDemoFrame';

/**
 * SyncWAAPIAnimationsDemo - Demonstrates syncing WAAPI animations to a timeline
 */
export const SyncWAAPIAnimationsDemo: React.FC = () => {
  const [circleWAAPI, setCircleWAAPI] = useState<WAAPIAnimation | null>(null);
  const [triangleWAAPI, setTriangleWAAPI] = useState<WAAPIAnimation | null>(null);
  const [squareWAAPI, setSquareWAAPI] = useState<WAAPIAnimation | null>(null);

  const entries = [
    { target: circleWAAPI, position: 0 },
    { target: triangleWAAPI, position: 350 },
    { target: squareWAAPI, position: 250 },
  ];

  // Animation durations:
  // Circle: default 1000ms (Anime.js v4 default)
  // Triangle: 750ms
  // Square: default 1000ms
  
  // Total Timeline calculation based on positions:
  // Circle: 0 -> 1000
  // Square: 250 -> 1250
  // Triangle: 350 -> 1100
  // Max end time is 1250ms
  
  const totalDuration = 1250;
  
  const circleStart = 0;
  const circleDur = 1000;
  
  const squareStart = 250;
  const squareDur = 1000;
  
  const triangleStart = 350;
  const triangleDur = 750;

  return (
    <AnimeTimeline
      autoplay={false}
      enabled={Boolean(circleWAAPI && triangleWAAPI && squareWAAPI)}
      entries={entries}
    >
      {({ controls, state }) => (
        <DemoSection title="Timeline: Sync WAAPI Animations">
          <TimelineDemoFrame
            title="Sync WAAPI animations"
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
            {/* Square (Bottom Left) */}
            <AnimeWAAPI
              translateX="15rem"
              rotateZ={360}
              autoplay={false}
              onReady={(api: AnimeWAAPIRef) => setSquareWAAPI(api.animation)}
            >
              <div 
                className="absolute left-6 w-16 h-16 bg-demo-accent rounded-2xl demo-stage-glow z-10"
              ></div>
            </AnimeWAAPI>

            {/* Triangle (Top) */}
            <AnimeWAAPI
              translateX="15rem"
              translateY={[0, '-1.5rem', 0]}
              ease="out(4)"
              duration={750}
              autoplay={false}
              onReady={(api: AnimeWAAPIRef) => setTriangleWAAPI(api.animation)}
            >
              <div 
                className="absolute left-12 w-0 h-0 border-l-35 border-l-transparent border-r-35 border-r-transparent border-b-60 border-b-demo-accent demo-stage-drop-glow z-20 -translate-y-8"
              ></div>
            </AnimeWAAPI>

            {/* Circle (Bottom Right) */}
            <AnimeWAAPI
              translateX="15rem"
              autoplay={false}
              onReady={(api: AnimeWAAPIRef) => setCircleWAAPI(api.animation)}
            >
              <div 
                className="absolute left-16 w-16 h-16 bg-demo-accent rounded-full demo-stage-glow z-30 flex items-center justify-center border-2 border-demo-accent"
              >
                <div className="w-6 h-6 rounded-full border-4 border-demo-bg"></div>
              </div>
            </AnimeWAAPI>
          </div>
        </div>

        {/* Timeline Visualization (Overlapping Bars) */}
        <div className="relative w-full h-24 flex flex-col justify-end gap-2 px-12">
          {/* Bar 1 (Circle) */}
          <div 
            className="h-3 bg-demo-accent/20 rounded-full relative"
            style={{ width: `${(circleDur / totalDuration) * 100}%`, marginLeft: `${(circleStart / totalDuration) * 100}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-demo-accent/20 rounded-full border-2 border-demo-accent/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-demo-accent"></div>
            </div>
            <div 
              className="absolute top-0 left-0 h-full bg-demo-accent demo-stage-glow-strong rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, (state.currentTime / circleDur) * 100))}%` }}
            />
          </div>

          {/* Bar 2 (Triangle) */}
          <div 
            className="h-3 bg-demo-accent/20 rounded-full relative"
            style={{ width: `${(triangleDur / totalDuration) * 100}%`, marginLeft: `${(triangleStart / totalDuration) * 100}%` }}
          >
            <div className="absolute -left-10 -top-2 w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-18 border-b-demo-accent/40"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-demo-accent demo-stage-glow-strong rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((state.currentTime - triangleStart) / triangleDur) * 100))}%` }}
            />
          </div>

          {/* Bar 3 (Square) */}
          <div 
            className="h-3 bg-demo-accent/20 rounded-full relative"
            style={{ width: `${(squareDur / totalDuration) * 100}%`, marginLeft: `${(squareStart / totalDuration) * 100}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-demo-accent/20 rounded-lg border-2 border-demo-accent/40 shadow-inner"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-demo-accent demo-stage-glow-strong rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((state.currentTime - squareStart) / squareDur) * 100))}%` }}
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
            <span className="text-xs text-demo-text-muted font-bold tracking-widest uppercase">WAAPI animations can be synchronised to a timeline using the sync() method.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-demo-accent"></div>
            <span className="text-xs text-demo-text-muted font-bold tracking-widest uppercase">Demonstrating precise overlapping timing control.</span>
          </div>
        </div>
          </TimelineDemoFrame>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default SyncWAAPIAnimationsDemo;
