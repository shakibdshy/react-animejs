import React, { useRef } from 'react';
import { useAnime } from '../../hooks';
import { AnimeTimeline } from '../../components';
import { DemoSection } from './DemoSection';

/**
 * TimelineAnimationsDemo - Demonstrates adding and syncing animations in a timeline
 */
export const TimelineAnimationsDemo: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  // 1. Create an external animation using useAnime (synced later)
  const { animation: externalCircleAnim, isReady: isCircleReady } = useAnime({
    targets: circleRef,
    translateX: '15rem',
    duration: 1000,
    autoplay: false,
    ease: 'easeInOutQuad'
  });

  const entries = [
    { target: externalCircleAnim, position: 0 },
    {
      targets: triangleRef,
      translateX: '15rem',
      rotate: '1turn',
      duration: 500,
      alternate: true,
      loop: 2,
      position: '+=0',
    },
    {
      targets: squareRef,
      translateX: '15rem',
      duration: 800,
      position: '+=0',
    },
  ];

  // Total duration: 1000 (circle) + 1000 (triangle 500*2) + 800 (square) = 2800ms
  const totalDuration = 2800;
  const bar1Width = (1000 / totalDuration) * 100;
  const bar2Width = (1000 / totalDuration) * 100;
  const bar3Width = (800 / totalDuration) * 100;

  return (
    <AnimeTimeline autoplay={false} enabled={isCircleReady} entries={entries}>
      {({ controls, state }) => (
        <DemoSection title="Timeline: Add & Sync Animations">
          <div className="flex flex-col gap-10 w-full bg-[#1a180a] p-10 rounded-3xl border border-[#2a2610] shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-amber-500 font-bold text-xl uppercase tracking-widest">ADD ANIMATIONS</h3>
              <div className="flex gap-4">
                <button 
                  onClick={controls.restart}
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                  title="Restart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
                <button 
                  onClick={state.paused ? controls.play : controls.pause}
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                >
                  {state.paused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  )}
                </button>
              </div>
            </div>

        {/* Animation Stage */}
        <div className="relative h-64 w-full bg-[#0a0905] rounded-2xl border border-[#2a2610] p-6 overflow-hidden shadow-inner">
          {/* Shapes Pyramid Structure */}
          <div className="relative w-full h-full flex items-center">
            {/* Square (Bottom Left) */}
            <div 
              ref={squareRef} 
              className="absolute left-6 w-16 h-16 bg-amber-500 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.4)] z-10"
            ></div>

            {/* Triangle (Top) */}
            <div 
              ref={triangleRef} 
              className="absolute left-12 w-0 h-0 border-l-35 border-l-transparent border-r-35 border-r-transparent border-b-60 border-b-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] z-20 -translate-y-8"
            ></div>

            {/* Circle (Bottom Right) */}
            <div 
              ref={circleRef} 
              className="absolute left-16 w-16 h-16 bg-amber-500 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] z-30 flex items-center justify-center border-2 border-amber-400"
            >
              <div className="w-6 h-6 rounded-full border-4 border-[#0a0905]"></div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative w-full h-24 flex flex-col justify-end gap-3 px-12">
          {/* Bar 1 (Circle) */}
          <div 
            className="h-3 bg-amber-900/20 rounded-full relative"
            style={{ width: `${bar1Width}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-amber-500/20 rounded-full border-2 border-amber-500/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            </div>
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, (state.currentTime / 1000) * 100))}%` }}
            />
          </div>

          {/* Bar 2 (Triangle) */}
          <div 
            className="h-3 bg-amber-900/20 rounded-full relative"
            style={{ width: `${bar2Width}%`, marginLeft: `${bar1Width}%` }}
          >
            <div className="absolute -left-10 -top-2 w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-18 border-b-amber-500/40"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((state.currentTime - 1000) / 1000) * 100))}%` }}
            />
          </div>

          {/* Bar 3 (Square) */}
          <div 
            className="h-3 bg-amber-900/20 rounded-full relative"
            style={{ width: `${bar3Width}%`, marginLeft: `${bar1Width + bar2Width}%` }}
          >
            <div className="absolute -left-10 -top-1 w-6 h-6 bg-amber-500/20 rounded-lg border-2 border-amber-500/40 shadow-inner"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, ((state.currentTime - 2000) / 800) * 100))}%` }}
            />
          </div>

          {/* Current position marker */}
          <div 
            className="absolute bottom-0 w-0.5 h-full bg-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.6)] z-20"
            style={{ left: `${state.progress * 100}%` }}
          />
        </div>

            <div className="space-y-3 pt-6 border-t border-[#2a2610]">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <span className="text-xs text-amber-600 font-bold tracking-widest uppercase">TIMELINE.SYNC(ANIMATION) FOR PRE-EXISTING ANIMATIONS.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <span className="text-xs text-amber-600 font-bold tracking-widest uppercase">TIMELINE.ADD(TARGETS, PARAMS) FOR DIRECT SEGMENT CREATION.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <span className="text-xs text-amber-600 font-bold tracking-widest uppercase">PYRAMID STRUCTURE COMPOSITION WITH SEQUENCED MOVEMENT.</span>
              </div>
            </div>
          </div>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default TimelineAnimationsDemo;
