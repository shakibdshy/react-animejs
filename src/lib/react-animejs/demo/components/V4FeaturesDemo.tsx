/**
 * V4FeaturesDemo - Demonstrates new Anime.js v4 features
 * (onRender, onBeforeUpdate, persist, refresh)
 */

import React, { useState, useRef } from 'react';
import { useAnime } from '../../hooks';
import type { JSAnimation } from '../../types';
import { DemoSection } from './DemoSection';

export const V4FeaturesDemo: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [beforeUpdateCount, setBeforeUpdateCount] = useState(0);
  const [lastValue, setLastValue] = useState(0);
  const [isPersisted, setIsPersisted] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const { controls, state } = useAnime({
    targets: boxRef,
    translateX: 250,
    rotate: '90deg',
    duration: 2000,
    autoplay: false,
    persist: isPersisted,
    onBeforeUpdate: () => {
      setBeforeUpdateCount(c => c + 1);
    },
    onRender: (instance) => {
      const anim = instance as JSAnimation;
      setRenderCount(c => c + 1);
      // Try to get a value from the instance
      const progress = anim.progress;
      setLastValue(progress);
    },
    onComplete: () => {
      console.log('Animation completed');
    }
  });

  return (
    <DemoSection title="Anime.js v4 Features">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex gap-4 items-center">
          <button 
            onClick={controls.play} 
            disabled={!state.paused && state.began && !state.completed}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md transition-colors"
          >
            Play
          </button>
          <button 
            onClick={controls.pause}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Pause
          </button>
          <button 
            onClick={controls.restart}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Restart
          </button>
          <button 
            onClick={controls.refresh}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            id="persist-checkbox"
            checked={isPersisted} 
            onChange={(e) => setIsPersisted(e.target.checked)} 
            className="rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="persist-checkbox" className="text-gray-300">Persist in engine</label>
        </div>

        <div className="h-20 flex items-center bg-[#1a1a24] rounded-lg p-4">
          <div 
            ref={boxRef}
            className="w-12 h-12 bg-indigo-500 rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#0f0f15] p-4 rounded-lg border border-[#2a2a3a]">
          <div className="text-gray-500">Before Update:</div>
          <div className="text-amber-400">{beforeUpdateCount}</div>
          <div className="text-gray-500">Render Count:</div>
          <div className="text-amber-400">{renderCount}</div>
          <div className="text-gray-500">Progress:</div>
          <div className="text-amber-400">{Math.round(lastValue * 100)}%</div>
          <div className="text-gray-500">State:</div>
          <div className="text-indigo-400">{state.completed ? 'Completed' : (state.paused ? 'Paused' : 'Playing')}</div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• <code>onBeforeUpdate</code> and <code>onRender</code> are new callbacks in v4.</p>
          <p>• <code>persist: true</code> prevents the animation from being removed from the engine when finished.</p>
          <p>• <code>controls.refresh()</code> can be used to recalculate values.</p>
        </div>
      </div>
    </DemoSection>
  );
};

export default V4FeaturesDemo;
