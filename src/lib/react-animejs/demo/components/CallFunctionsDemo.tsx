import React, { useState, useCallback } from 'react';
import { useAnimeTimeline } from '../../hooks';
import { DemoSection } from './DemoSection';

/**
 * CallFunctionsDemo - Demonstrates the timeline.call() feature
 * allowing to execute functions at specific points in the timeline.
 */
export const CallFunctionsDemo: React.FC = () => {
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [valC, setValC] = useState('');

  const resetValues = useCallback(() => {
    setValA('');
    setValB('');
    setValC('');
  }, []);

  const { controls, state } = useAnimeTimeline(
    { 
      autoplay: false,
      duration: 1500,
      onBegin: resetValues,
    },
    [
      { callback: () => setValA('A'), position: 0 },
      { callback: () => setValB('B'), position: 800 },
      { callback: () => setValC('C'), position: 1200 },
    ]
  );

  return (
    <DemoSection title="Call functions">
      <div className="flex flex-col gap-8 w-full">
        {/* LCD Style Displays */}
        <div className="flex justify-between gap-4">
          <Display label="function A" value={valA} />
          <Display label="function B" value={valB} />
          <Display label="function C" value={valC} />
        </div>

        {/* Progress Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#555] font-mono">
            <span>Timeline Progress</span>
            <span>{Math.round(state.progress * 100)}%</span>
          </div>
          <div className="relative h-1.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-[#2a2a3a]">
            <div 
              className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${state.progress * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={controls.play}
            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Play
          </button>
          <button 
            onClick={() => {
              resetValues();
              controls.restart();
            }}
            className="flex-1 px-4 py-2.5 bg-[#2a2a3a] hover:bg-[#3a3a4a] text-white text-sm font-medium rounded-lg transition-all active:scale-95 border border-[#3a3a4a]"
          >
            Restart
          </button>
        </div>
      </div>
    </DemoSection>
  );
};

interface DisplayProps {
  label: string;
  value: string;
}

const Display = ({ label, value }: DisplayProps) => (
  <div className="flex flex-col gap-2.5 flex-1 min-w-0">
    <span className="text-[10px] uppercase tracking-widest text-[#888] font-mono font-semibold truncate">
      {label}
    </span>
    <div className="h-20 bg-[#050508] border border-[#2a2a3a] rounded-xl flex items-center justify-center relative overflow-hidden group">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] pointer-events-none" />
      
      {/* Glow background */}
      <div className={`absolute inset-0 bg-amber-500/5 transition-opacity duration-300 ${value ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* LCD Character */}
      <span className={`text-4xl font-mono font-bold transition-all duration-200 ${value ? 'text-amber-500 scale-110' : 'text-[#1a1a24]'} [text-shadow:0_0_15px_rgba(245,158,11,0.4)]`}>
        {value || '0'}
      </span>

      {/* Subtle border highlight */}
      <div className={`absolute inset-0 border border-amber-500/20 rounded-xl transition-opacity duration-300 ${value ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  </div>
);
