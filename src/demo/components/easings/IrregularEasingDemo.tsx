import React, { useMemo, useRef, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { irregular } from '@/lib/react-animejs';
import { RotateCcw, Shuffle } from 'lucide-react';

export const IrregularEasingDemo: React.FC = () => {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const boxRefs = useMemo(() => [ref0, ref1, ref2], []);
  const [stepCount, setStepCount] = useState(10);
  const [randomness, setRandomness] = useState(1);

  const easing = useMemo(() => irregular(stepCount, randomness), [stepCount, randomness]);

  const { controls, state, isPlaying } = useAnime({
    targets: boxRefs,
    translateX: '15rem',
    rotate: 360,
    duration: 2000,
    ease: easing,
    stagger: 150,
    autoplay: false,
    loop: true,
    alternate: true,
    deps: [stepCount, randomness],
  });

  const randomize = () => {
    setStepCount(Math.floor(Math.random() * 15) + 5);
    setRandomness(Math.round((Math.random() * 2 + 0.5) * 10) / 10);
  };

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl lowercase">irregular</h4>
          <p className="text-xs text-demo-text-muted mt-1">Randomized stepped interpolation</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={randomize}
            className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors"
            title="Randomize"
          >
            <Shuffle className="w-4 h-4" />
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
                className="w-10 h-10 bg-[#f43f5e] rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.2)]"
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

      <div className="flex gap-4 mt-4">
        <div className="flex-1">
          <label className="text-[10px] text-demo-text-muted uppercase tracking-widest mb-1 block">
            Steps: {stepCount}
          </label>
          <input
            type="range"
            min={3}
            max={20}
            value={stepCount}
            onChange={(e) => setStepCount(Number(e.target.value))}
            className="w-full accent-demo-accent"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-demo-text-muted uppercase tracking-widest mb-1 block">
            Randomness: {randomness.toFixed(1)}
          </label>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={randomness}
            onChange={(e) => setRandomness(Number(e.target.value))}
            className="w-full accent-demo-accent"
          />
        </div>
      </div>

      <div className="mt-3 text-[10px] text-demo-text-secondary font-mono bg-black/30 p-2.5 rounded-lg border border-demo-border overflow-x-auto">
        <code className="text-demo-accent/80">
          irregular({stepCount}, {randomness.toFixed(1)})
        </code>
      </div>
    </div>
  );
};
