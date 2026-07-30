import React from 'react';
import { useAnime } from '@shakibdshy/react-animejs';
import { DemoSection } from './DemoSection';

/**
 * CssSelectorDemo - Demonstrates targeting DOM elements using CSS selectors
 */
export const CssSelectorDemo: React.FC = () => {
  // We use the selector property to target elements by class or ID
  // Note: useAnime with selector targets elements within the nearest AnimeProvider scope
  const { controls } = useAnime({
    selector: '.css-selector-square',
    translateX: '17rem',
    duration: 1500,
    loop: true,
    autoplay: false,
    ease: 'inOutQuad'
  });

  const { controls: rotateControls } = useAnime({
    selector: '#css-selector-id',
    rotate: '1turn',
    duration: 1500,
    loop: true,
    autoplay: false,
    ease: 'inOutQuad'
  });

  const { controls: scaleControls } = useAnime({
    selector: '.row:nth-child(3) .css-selector-square',
    scale: [1, 0.5, 1],
    duration: 1500,
    loop: true,
    autoplay: false,
    ease: 'inOutQuad'
  });

  const handlePlayAll = () => {
    controls.play();
    rotateControls.play();
    scaleControls.play();
  };

  const handlePauseAll = () => {
    controls.pause();
    rotateControls.pause();
    scaleControls.pause();
  };

  return (
    <DemoSection title="CSS Selector Targets">
      <div className="flex flex-col gap-4 w-full">
        <div className="medium row flex items-center gap-4 bg-demo-card p-4 rounded-lg">
          <div className="css-selector-square w-12 h-12 bg-indigo-500 rounded-sm"></div>
          <span className="text-xs text-gray-400">.css-selector-square</span>
        </div>
        <div className="medium row flex items-center gap-4 bg-demo-card p-4 rounded-lg">
          <div id="css-selector-id" className="css-selector-square w-12 h-12 bg-purple-500 rounded-sm"></div>
          <span className="text-xs text-gray-400">#css-selector-id</span>
        </div>
        <div className="medium row flex items-center gap-4 bg-demo-card p-4 rounded-lg">
          <div className="css-selector-square w-12 h-12 bg-pink-500 rounded-sm"></div>
          <span className="text-xs text-gray-400">.row:nth-child(3) .css-selector-square</span>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          onClick={handlePlayAll}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
        >
          Play All
        </button>
        <button 
          onClick={handlePauseAll}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          Pause All
        </button>
      </div>

      <div className="demo-info text-xs text-gray-500 mt-4">
        <p>Targets one or multiple DOM Elements using a CSS selector via the <code>selector</code> option.</p>
      </div>
    </DemoSection>
  );
};

export default CssSelectorDemo;
