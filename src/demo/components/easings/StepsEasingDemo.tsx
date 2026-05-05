import React, { useMemo, useRef, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { steps } from '@/lib/react-animejs';
import { RotateCcw } from 'lucide-react';

export const StepsEasingDemo: React.FC = () => {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const boxRefs = useMemo(() => [ref0, ref1], []);
  const [stepCount, setStepCount] = useState(4);
  const [fromStart, setFromStart] = useState(false);

  const easing = useMemo(() => steps(stepCount, fromStart), [stepCount, fromStart]);

  const { controls, state, isPlaying } = useAnime({
    targets: boxRefs,
    translateX: '15rem',
    rotate: 360,
    duration: 2000,
    ease: easing,
    stagger: 100,
    autoplay: false,
    loop: true,
    alternate: true,
    deps: [stepCount, fromStart],
  });

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl lowercase">steps</h4>
          <p className="text-xs text-demo-text-muted mt-1">Discrete stepped animation</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={stepCount}
            onChange={(e) => setStepCount(Number(e.target.value))}
            className="bg-black/40 text-demo-accent text-xs border border-demo-accent/20 rounded px-2 py-1 outline-none"
          >
            {[2, 3, 4, 5, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n} steps
              </option>
            ))}
          </select>
          <button
            onClick={() => setFromStart(!fromStart)}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter transition-all ${
              fromStart
                ? 'bg-demo-accent text-demo-bg'
                : 'bg-demo-card text-demo-text-secondary hover:text-white'
            }`}
          >
            {fromStart ? 'start' : 'end'}
          </button>
          <button
            onClick={() => controls.restart()}
            className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-demo-bg rounded-2xl p-8 relative min-h-50 flex items-center justify-start overflow-hidden border border-demo-border/50">
        <div className="flex flex-col gap-4 w-full">
          {boxRefs.map((ref, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[10px] text-demo-text-muted font-mono w-8">#{i + 1}</span>
              <div
                ref={ref}
                className="w-10 h-10 bg-[#10b981] rounded shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              />
            </div>
          ))}
        </div>
        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-12 h-12 bg-demo-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <div className="translate-x-0.5 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-demo-bg" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-[10px] text-demo-text-secondary font-mono bg-black/30 p-2.5 rounded-lg border border-demo-border overflow-x-auto">
        <code className="text-demo-accent/80">
          steps({stepCount}
          {fromStart ? ', true' : ''})
        </code>
      </div>
    </div>
  );
};
