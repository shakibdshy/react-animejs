import React, { useRef, useState, useCallback } from 'react';
import { DemoCard } from './DemoCard';
import { $, get, set, remove } from '@/lib/react-animejs/utils/anime-utils';

/**
 * Demo for DOM utility functions: $, get, set, cleanInlineStyles, remove
 */
export const DOMUtilitiesDemo: React.FC = () => {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const [box1Style, setBox1Style] = useState('');
  const [box2Style, setBox2Style] = useState('');
  const [box3Style, setBox3Style] = useState('');
  const [removed, setRemoved] = useState(false);

  const handleDollarSign = useCallback(() => {
    const el = $('.demo-box');
    if (el.length > 0) {
      setBox1Style('border-color: #ffd11a');
      setTimeout(() => setBox1Style(''), 1000);
    }
  }, []);

  const handleGet = useCallback(() => {
    if (box2Ref.current) {
      const transform = get(box2Ref.current, 'transform');
      setBox2Style(`transform: ${transform}`);
      setTimeout(() => setBox2Style(''), 1000);
    }
  }, []);

  const handleSet = useCallback(() => {
    const el = box3Ref.current;
    if (el) {
      set(el, {
        backgroundColor: '#ff6b6b',
        borderRadius: '50%',
      });
      setBox3Style('background: #ff6b6b; border-radius: 50%');
      setTimeout(() => {
        set(el, {
          backgroundColor: '#1a1a24',
          borderRadius: '8px',
        });
        setBox3Style('');
      }, 1000);
    }
  }, []);

  const handleCleanStyles = useCallback(() => {
    const el = box1Ref.current;
    if (el) {
      set(el, {
        opacity: '0.5',
        scale: '1.2',
      });
      setTimeout(() => {
        el.style.opacity = '';
        el.style.scale = '';
      }, 500);
    }
  }, []);

  const handleRemove = useCallback(() => {
    if (box2Ref.current && !removed) {
      remove(box2Ref.current);
      setRemoved(true);
      setTimeout(() => setRemoved(false), 2000);
    }
  }, [removed]);

  return (
    <DemoCard
      title="DOM Utilities"
      description="$, get, set, cleanInlineStyles, remove"
      code={`$(".demo-box") → ${box1Style ? 'Found & styled' : 'Click to test'}`}
    >
      <div className="w-full space-y-6">
        {/* $ Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400">$(selector, context)</span>
            <button
              onClick={handleDollarSign}
              className="text-xs bg-[#ffd11a] text-black px-3 py-1 rounded-full font-medium hover:bg-[#ffd11a]/80 transition-colors"
            >
              Query
            </button>
          </div>
          <div
            ref={box1Ref}
            className="demo-box w-full h-12 bg-[#2a2a3a] rounded-lg flex items-center justify-center text-xs text-slate-400 border-2 border-[#3a3a4a] transition-all duration-300"
            style={box1Style ? { borderColor: '#ffd11a' } : {}}
          >
            $(".demo-box") selects this element
          </div>
          <div className="mt-2">
            <button
              onClick={handleCleanStyles}
              className="text-xs bg-[#4ecdc4] text-black px-3 py-1 rounded-full font-medium hover:bg-[#4ecdc4]/80 transition-colors mr-2"
            >
              Clean Styles
            </button>
          </div>
        </div>

        {/* Get Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400">get(element, property)</span>
            <button
              onClick={handleGet}
              className="text-xs bg-[#45b7d1] text-black px-3 py-1 rounded-full font-medium hover:bg-[#45b7d1]/80 transition-colors"
            >
              Get Value
            </button>
          </div>
          <div
            ref={box2Ref}
            className="w-full h-12 bg-[#2a2a3a] rounded-lg flex items-center justify-center text-xs text-slate-400 border-2 border-[#3a3a4a] transition-all duration-300"
            style={box2Style ? { borderColor: '#45b7d1' } : {}}
          >
            Click "Get Value" to read transform
          </div>
          <div className="mt-2">
            <button
              onClick={handleRemove}
              className="text-xs bg-[#ff6b6b] text-white px-3 py-1 rounded-full font-medium hover:bg-[#ff6b6b]/80 transition-colors"
            >
              Remove Element
            </button>
          </div>
        </div>

        {/* Set Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400">set(element, properties)</span>
            <button
              onClick={handleSet}
              className="text-xs bg-[#96ceb4] text-black px-3 py-1 rounded-full font-medium hover:bg-[#96ceb4]/80 transition-colors"
            >
              Set Styles
            </button>
          </div>
          <div
            ref={box3Ref}
            className="w-full h-12 bg-[#2a2a3a] rounded-lg flex items-center justify-center text-xs text-slate-400 border-2 border-[#3a3a4a] transition-all duration-300"
            style={box3Style ? { backgroundColor: '#ff6b6b', borderRadius: '50%' } : {}}
          >
            Click "Set Styles" to change shape
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
