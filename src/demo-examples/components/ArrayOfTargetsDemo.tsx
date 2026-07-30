import React, { useMemo, useState } from 'react';
import { useAnime, utils } from '@shakibdshy/react-animejs';
import { DemoSection } from './DemoSection';

/**
 * ArrayOfTargetsDemo - Demonstrates targeting multiple types of targets simultaneously
 */
export const ArrayOfTargetsDemo: React.FC = () => {
  // A JS object target
  const vector2D = useMemo(() => ({ x: 0 }), []);
  
  // State to display the current value of the JS object
  const [jsValue, setJsValue] = useState(0);

  // We target both the JS object and DOM elements with the class '.array-target'
  const { controls } = useAnime({
    targets: [vector2D, '.array-target'],
    x: '17rem',
    duration: 2000,
    direction: 'alternate',
    loop: true,
    autoplay: false,
    // Using utils.roundPad as in the example
    modifier: (v: number) => utils.round(2)(v).toString().padStart(5, '0'),
    onRender: () => {
      // Update our React state with the animated values from the object
      setJsValue(vector2D.x as unknown as number);
    }
  });

  return (
    <DemoSection title="Array of Targets">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-demo-card p-4 rounded-lg">
            <div className="array-target w-12 h-12 bg-indigo-500 rounded-lg"></div>
            <span className="text-xs text-gray-400">.array-target (DOM)</span>
          </div>
          
          <div className="flex items-center gap-4 bg-demo-card p-4 rounded-lg">
            <div className="array-target w-12 h-12 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-400">.array-target (DOM)</span>
          </div>

          <div className="bg-demo-card p-4 rounded-lg border border-demo-border font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-indigo-400">vector2D.x (JS):</span>
              <span className="text-amber-400">{jsValue}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={controls.play}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Play All
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
        <p>Targets multiple valid Targets simultaneously by grouping them inside an Array. Any types of targets can be grouped together.</p>
      </div>
    </DemoSection>
  );
};

export default ArrayOfTargetsDemo;
