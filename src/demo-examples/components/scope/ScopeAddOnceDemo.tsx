/**
 * ScopeAddOnceDemo - addOnce method demonstration
 *
 * Shows how to use AnimeScope component with addOnce for registering
 * a constructor that only runs once, even when media queries change.
 * Useful for one-time setup.
 *
 * @see https://animejs.com/documentation/scope/scope-methods/addonce
 */

import React, { useCallback, useState } from 'react';
import { DemoCard } from '../DemoCard';
import { AnimeScope } from '@shakibdshy/react-animejs';
import { animate } from 'animejs';
import { Zap } from 'lucide-react';

export const ScopeAddOnceDemo: React.FC = () => {
  const [runCount, setRunCount] = useState(0);
  const [onceCount, setOnceCount] = useState(0);
  const [key, setKey] = useState(0);

  const handleRestart = useCallback(() => {
    setRunCount(0);
    setOnceCount(0);
    setKey((k) => k + 1);
  }, []);

  return (
    <DemoCard
      title="addOnce method (Component)"
      description="Using AnimeScope component - register a constructor that runs only once via animateOnce prop, even when media queries change."
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs transition-all"
          >
            <Zap size={12} />
            Restart
          </button>
        </div>
      }
      controls={{
        restart: handleRestart,
      }}
      code={`// Declarative approach with AnimeScope component
<AnimeScope
  animateOnce={() => {
    // Runs ONLY ONCE, even on media changes
    animate(".once-box", { scale: [1, 1.2], loop: true });
  }}
  animate={() => {
    // Runs on every media query change or deps change
    animate(".add-box", { translateX: [0, 100], loop: true });
  }}
>
  {children}
</AnimeScope>`}
    >
      <div
        // Using key to force re-mount on restart
        key={key}
        className="w-full flex flex-col items-center gap-6"
      >
        {/* AnimeScope component - declarative approach */}
        <AnimeScope
          mediaQueries={{
            isSmall: '(max-width: 400px)',
          }}
          // animateOnce - runs only once, even on media query changes
          animateOnce={() => {
            setOnceCount((c) => c + 1);

            // This animation persists across media query changes
            animate('.once-box', {
              scale: [1, 1.2, 1],
              duration: 800,
              loop: true,
              ease: 'outElastic(1, 0.5)',
            });

          }}
          // animate - runs on every media query change
          animate={() => {
            setRunCount((c) => c + 1);

            animate('.add-box', {
              translateX: [0, 100],
              rotate: 360,
              duration: 1500,
              loop: true,
              alternate: true,
              ease: 'inOutQuad',
            });

          }}
        >
          {/* Animated elements */}
          <div className="flex gap-8 items-center min-h-20">
            <div className="flex flex-col items-center gap-2">
              <div className="add-box w-12 h-12 rounded-xl bg-linear-to-br from-demo-accent to-[#ff8c00] shadow-lg shadow-demo-accent/30" />
              <span className="text-[10px] text-demo-accent font-mono">animate</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="once-box w-12 h-12 rounded-xl bg-linear-to-br from-[#8b5cf6] to-[#7c3aed] shadow-lg shadow-violet-500/30" />
              <span className="text-[10px] text-violet-400 font-mono">animateOnce</span>
            </div>
          </div>
        </AnimeScope>

        {/* Run counts */}
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-demo-text-muted">animate runs:</span>
            <span className="font-mono text-demo-accent bg-demo-accent/10 px-2 py-0.5 rounded">
              {runCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-demo-text-muted">animateOnce runs:</span>
            <span className="font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
              {onceCount}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="text-[10px] text-demo-text-muted text-center max-w-sm">
          Restart to see both constructors run. Notice{' '}
          <code className="text-demo-accent">animate</code> increments but{' '}
          <code className="text-violet-400">animateOnce</code> stays at 1.
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeAddOnceDemo;
