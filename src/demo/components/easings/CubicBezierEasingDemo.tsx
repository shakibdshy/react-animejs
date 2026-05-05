import React, { useMemo, useRef, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { cubicBezier } from '@/lib/react-animejs';
import { RotateCcw } from 'lucide-react';

const bezierPresets = [
  { name: 'easeInOut', values: [0.42, 0, 0.58, 1] as [number, number, number, number] },
  { name: 'easeOut', values: [0, 0, 0.58, 1] as [number, number, number, number] },
  { name: 'easeIn', values: [0.42, 0, 1, 1] as [number, number, number, number] },
  { name: 'snap', values: [0.5, 0, 0.9, 0.3] as [number, number, number, number] },
  { name: 'smooth', values: [0.1, 0.7, 0.5, 1] as [number, number, number, number] },
  { name: 'anticipate', values: [0.7, 0.1, 0.5, 0.9] as [number, number, number, number] },
];

export const CubicBezierEasingDemo: React.FC = () => {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const boxRefs = useMemo(() => [ref0, ref1, ref2], []);
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = bezierPresets[presetIndex];
  const easing = useMemo(() => cubicBezier(...preset.values), [presetIndex]);

  const { controls, state, isPlaying } = useAnime({
    targets: boxRefs,
    translateX: '15rem',
    duration: 2000,
    ease: easing,
    stagger: 200,
    autoplay: false,
    loop: true,
    alternate: true,
    deps: [presetIndex],
  });

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl lowercase">cubicBezier</h4>
          <p className="text-xs text-demo-text-muted mt-1">
            Custom Bézier curves for precise control
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={presetIndex}
            onChange={(e) => setPresetIndex(Number(e.target.value))}
            className="bg-black/40 text-demo-accent text-xs border border-demo-accent/20 rounded px-2 py-1 outline-none"
          >
            {bezierPresets.map((p, i) => (
              <option key={p.name} value={i}>
                {p.name}
              </option>
            ))}
          </select>
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
                className="w-10 h-10 bg-demo-accent rounded-lg shadow-[0_0_15px_rgba(255,209,26,0.2)]"
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
        <code className="text-demo-accent/80">cubicBezier({preset.values.join(', ')})</code>
      </div>
    </div>
  );
};
