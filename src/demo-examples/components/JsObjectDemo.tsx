import React, { useMemo, useState } from 'react';
import { useAnime, utils } from '@/lib/react-animejs';
import { DemoSection } from './DemoSection';

/**
 * JsObjectDemo - Demonstrates targeting plain JavaScript objects
 */
export const JsObjectDemo: React.FC = () => {
  // The object we want to animate
  // We use useMemo to keep the object reference stable across renders
  const vector2D = useMemo(() => ({ x: 0, y: 0 }), []);
  
  // State to display the current values
  const [displayValues, setDisplayValues] = useState({ x: 0, y: 0 });

  const { controls } = useAnime({
    targets: vector2D,
    x: 100,
    y: 150,
    duration: 2000,
    direction: 'alternate',
    loop: true,
    autoplay: false,
    modifier: utils.round(0),
    onUpdate: () => {
      // Update our React state with the animated values from the object
      setDisplayValues({ x: vector2D.x, y: vector2D.y });
    }
  });

  return (
    <DemoSection title="JavaScript Object Targets">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-demo-card p-6 rounded-xl border border-demo-border w-full font-mono text-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500">const vector2D = {'{'}</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-indigo-400">x:</span>
              <span className="text-amber-400">{displayValues.x}</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-indigo-400">y:</span>
              <span className="text-amber-400">{displayValues.y}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{'}'};</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-40 bg-demo-card rounded-xl overflow-hidden border border-demo-border">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          {/* Visual representation of the vector */}
          <div 
            className="absolute w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            style={{ 
              left: `${displayValues.x}%`, 
              top: `${displayValues.y / 1.5}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={controls.play}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Play Animation
          </button>
          <button 
            onClick={controls.pause}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Pause
          </button>
        </div>
      </div>

      <div className="demo-info text-xs text-gray-500 mt-4">
        <p>Targets one or multiple JavaScript Objects. Any property of an object can be animated.</p>
      </div>
    </DemoSection>
  );
};

export default JsObjectDemo;
