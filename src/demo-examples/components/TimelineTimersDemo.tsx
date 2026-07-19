import React, { useState } from 'react';
import { useAnimeTimer } from '@/lib/react-animejs/hooks';
import { AnimeTimeline } from '@/lib/react-animejs/components';
import { DemoSection } from './DemoSection';

/**
 * TimelineTimersDemo - Demonstrates adding and syncing timers in a timeline
 */
export const TimelineTimersDemo: React.FC = () => {
  const [timer01, setTimer01] = useState(0);
  const [timer02, setTimer02] = useState(0);
  const [timer03, setTimer03] = useState(0);

  // 1. Create an external timer using useAnimeTimer
  const { timer: externalTimer } = useAnimeTimer({
    duration: 1500,
    autoplay: false,
    onUpdate: (self) => setTimer01(Math.round(self.currentTime)),
  });

  // 2. Create a timeline that syncs the external timer and adds two more
  const entries = [
    { target: externalTimer, position: 0 },
    {
      duration: 500,
      onUpdate: (self: { currentTime: number }) =>
        setTimer02(Math.round(self.currentTime)),
      position: '+=0',
    },
    {
      duration: 1000,
      onUpdate: (self: { currentTime: number }) =>
        setTimer03(Math.round(self.currentTime)),
      position: '+=0',
    },
  ];

  // Total duration is 1500 + 500 + 1000 = 3000
  const totalDuration = 3000;
  const bar1Width = (1500 / totalDuration) * 100;
  const bar2Width = (500 / totalDuration) * 100;
  const bar3Width = (1000 / totalDuration) * 100;

  return (
    <AnimeTimeline autoplay={false} enabled={Boolean(externalTimer)} entries={entries}>
      {({ controls, state }) => (
        <DemoSection title="Timeline: Add & Sync Timers">
          <div className="flex flex-col gap-8 w-full bg-[#2a2610] p-8 rounded-2xl border border-[#4a4220]">
            <div className="flex justify-between items-center">
              <h3 className="text-amber-500 font-bold text-lg uppercase tracking-tight">Add timers</h3>
              <div className="flex gap-2">
                <button 
                  onClick={controls.restart}
                  className="p-2 hover:bg-[#3a3418] text-amber-500 rounded-lg transition-colors"
                  title="Restart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
                <button 
                  onClick={state.paused ? controls.play : controls.pause}
                  className="p-2 hover:bg-[#3a3418] text-amber-500 rounded-lg transition-colors"
                >
                  {state.paused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">timer 01</span>
            <div className="bg-[#1a180a] p-4 rounded-xl border border-[#3a3418] flex items-center justify-center">
              <div className="text-4xl font-mono text-amber-500 tabular-nums tracking-tighter opacity-90 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {timer01.toString().padStart(4, '0')}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">timer 02</span>
            <div className="bg-[#1a180a] p-4 rounded-xl border border-[#3a3418] flex items-center justify-center">
              <div className="text-4xl font-mono text-amber-500 tabular-nums tracking-tighter opacity-90 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {timer02.toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">timer 03</span>
            <div className="bg-[#1a180a] p-4 rounded-xl border border-[#3a3418] flex items-center justify-center">
              <div className="text-4xl font-mono text-amber-500 tabular-nums tracking-tighter opacity-90 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                {timer03.toString().padStart(4, '0')}
              </div>
            </div>
          </div>
            </div>

            <div className="relative w-full h-12 flex flex-col justify-end gap-1">
          {/* Bar 1 */}
          <div 
            className="h-1.5 bg-amber-900/30 rounded-full relative overflow-hidden"
            style={{ width: `${bar1Width}%` }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${(timer01 / 1500) * 100}%` }}
            />
          </div>

          {/* Bar 2 */}
          <div 
            className="h-1.5 bg-amber-900/30 rounded-full relative overflow-hidden"
            style={{ width: `${bar2Width}%`, marginLeft: `${bar1Width}%` }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${(timer02 / 500) * 100}%` }}
            />
          </div>

          {/* Bar 3 */}
          <div 
            className="h-1.5 bg-amber-900/30 rounded-full relative overflow-hidden"
            style={{ width: `${bar3Width}%`, marginLeft: `${bar1Width + bar2Width}%` }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${(timer03 / 1000) * 100}%` }}
            />
          </div>

          {/* Current position marker */}
          <div 
            className="absolute bottom-0 w-0.5 h-full bg-amber-500/50"
            style={{ left: `${state.progress * 100}%` }}
          />
            </div>

            <div className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-wide border-t border-[#3a3418] pt-4">
              <p>• Synchronises animations, timers, and callbacks together.</p>
              <p>• Visualizing individual segments within the global timeline progress.</p>
            </div>
          </div>
        </DemoSection>
      )}
    </AnimeTimeline>
  );
};

export default TimelineTimersDemo;
