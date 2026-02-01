import React, { useRef } from 'react';
import { useAnimeTimeline } from '../../hooks';
import { DemoSection } from './DemoSection';

/**
 * TimePositionDemo - Demonstrates different time position types
 * - Absolute (100)
 * - Addition ('+=100')
 * - Subtraction ('-=100')
 * - Multiplier ('*=.5')
 * - Previous end ('<')
 * - Previous start ('<<')
 * - Combined ('<<+=250')
 * - Label reference
 * - Stagger
 */
export const TimePositionDemo: React.FC = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);

  const { controls, state } = useAnimeTimeline(
    { 
      autoplay: false,
    },
    [
      // Label at the start
      { label: 'start', position: 0 },

      // 1. Absolute position - square at exactly 500ms
      { 
        targets: squareRef, 
        x: 180, 
        duration: 500, 
        position: 500 
      },

      // 2. Label reference - circle at 'start' label (0ms)
      { 
        targets: circleRef, 
        x: 180, 
        duration: 500, 
        position: 'start' 
      },

      // 3. Previous end position - triangle starts at the end of previous (circle)
      { 
        targets: triangleRef, 
        x: 180, 
        rotate: '1turn', 
        duration: 500, 
        position: '<-=250' 
      },
    ]
  );

  return (
    <DemoSection title="Time position">
      <div className="flex flex-col gap-6 w-full">
        {/* Shapes display area */}
        <div className="bg-[#1a1a24] p-6 rounded-xl border border-[#2a2a3a] relative min-h-35 flex items-end gap-4 justify-center">
          {/* Timeline marker line */}
          <div className="absolute left-6 right-6 top-8 bottom-8 border-l border-[#2a2a3a] border-dashed" />
          
          <div className="flex flex-col items-center gap-2 z-10">
            <div 
              ref={squareRef} 
              className="w-12 h-12 bg-indigo-500 rounded-sm shadow-lg"
            />
            <span className="text-[10px] text-[#888] font-mono">abs: 500ms</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 z-10">
            <div 
              ref={circleRef} 
              className="w-12 h-12 bg-purple-500 rounded-full shadow-lg"
            />
            <span className="text-[10px] text-[#888] font-mono">label: start</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 z-10">
            <div 
              ref={triangleRef}
              className="w-0 h-0 border-l-24 border-r-24 border-b-42 border-l-transparent border-r-transparent border-b-pink-500 shadow-lg"
            />
            <span className="text-[10px] text-[#888] font-mono">&lt;-=250</span>
          </div>
        </div>

        {/* Position types reference */}
        <div className="bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <h4 className="text-xs font-semibold text-indigo-400 mb-3 uppercase tracking-wider">Position Types</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <PositionType type="Absolute" example="100" description="Exactly 100ms" />
            <PositionType type="Addition" example="'+=100" description="100ms after last" />
            <PositionType type="Subtraction" example="-=100" description="100ms before end" />
            <PositionType type="Multiplier" example="*=.5" description="Half duration" />
            <PositionType type="Previous end" example="<" description="End of previous" />
            <PositionType type="Previous start" example="<<" description="Start of previous" />
            <PositionType type="Combined" example="<<+=250" description="Start + 250ms" />
            <PositionType type="Label" example="'My Label'" description="At label position" />
            <PositionType type="Stagger" example="stagger(10)" description="10ms per element" />
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#555] font-mono">
            <span>Timeline Progress</span>
            <span>{Math.round(state.progress * 100)}%</span>
          </div>
          <div className="relative h-1.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-[#2a2a3a]">
            <div 
              className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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
            onClick={controls.restart}
            className="flex-1 px-4 py-2.5 bg-[#2a2a3a] hover:bg-[#3a3a4a] text-white text-sm font-medium rounded-lg transition-all active:scale-95 border border-[#3a3a4a]"
          >
            Restart
          </button>
        </div>
      </div>
    </DemoSection>
  );
};

interface PositionTypeProps {
  type: string;
  example: string;
  description: string;
}

const PositionType = ({ type, example, description }: PositionTypeProps) => (
  <div className="flex flex-col gap-1 p-2 bg-[#1a1a24] rounded-md border border-[#2a2a3a]">
    <span className="text-[#888] font-semibold">{type}</span>
    <span className="text-amber-400">{example}</span>
    <span className="text-[#666]">{description}</span>
  </div>
);
