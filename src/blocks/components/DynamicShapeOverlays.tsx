import { memo, useRef, useState } from 'react';
import { AnimeMorph, type AnimeMorphRef } from '@/lib/react-animejs';

// ── Path states ─────────────────────────────────────────────────────────────
// Every layer shares the same flat baseline and full-cover top state; only the
// intermediate "curve" keyframe differs per layer, so the cascade reads as a
// multi-step wave rather than four identical copies. All paths keep the same
// command signature (M V Q V z) so anime.js interpolates them smoothly.
const BASE_PATH = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
const TOP_PATH = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';
const LAYER_CURVES = [
  'M 0 100 V 42 Q 50 4 100 42 V 100 z',
  'M 0 100 V 54 Q 50 22 100 54 V 100 z',
  'M 0 100 V 62 Q 50 36 100 62 V 100 z',
  'M 0 100 V 50 Q 50 50 100 50 V 100 z',
];

const LAYER_DURATION = 900;
const LAYER_STAGGER = 180; // delay between successive layers starting (ms)

const GRADIENTS = [
  { id: 'dso-0', from: 'rgb(255, 135, 9)', to: 'rgb(255, 61, 119)' },
  { id: 'dso-1', from: 'rgb(247, 189, 248)', to: 'rgb(157, 123, 255)' },
  { id: 'dso-2', from: 'rgb(94, 234, 212)', to: 'rgb(59, 130, 246)' },
  { id: 'dso-3', from: 'rgb(251, 191, 36)', to: 'rgb(244, 114, 182)' },
];

/**
 * Dynamic Shape Overlays — a port of the codrops / GreenSock "SVG Shape
 * Overlays" effect: several stacked SVG path layers that cascade-morph from a
 * flat baseline up through a curve into full cover. Each layer is driven by its
 * own `AnimeMorph` (a 2-state `d` keyframe morph: baseline → curve → fill, same
 * primitive CurveSwipe uses). Clicking plays every layer with an incremental
 * stagger for a travelling-wave reveal; clicking again reverses the cascade.
 */
export const DynamicShapeOverlays = memo(function DynamicShapeOverlays({
  className = '',
}: {
  className?: string;
}) {
  const refs = useRef<AnimeMorphRef[]>([]);
  const [isCovered, setIsCovered] = useState(false);

  const setLayerRef =
    (index: number) => (api: AnimeMorphRef | null) => {
      if (api) refs.current[index] = api;
    };

  const toggle = () => {
    const layers = refs.current;
    if (!layers.length) return;
    // Play (cover) bottom → top with a stagger; reverse (reveal) top → bottom
    // so the same layer that covered last is the first uncovered.
    const order = isCovered ? [...layers.keys()].reverse() : [...layers.keys()];
    order.forEach((index, step) => {
      const api = layers[index];
      if (!api) return;
      window.setTimeout(() => {
        if (isCovered) api.controls.reverse();
        else api.controls.play();
      }, step * LAYER_STAGGER);
    });
    setIsCovered((current) => !current);
  };

  return (
    <div
      className={`relative h-[min(72vh,560px)] min-h-96 overflow-hidden rounded-2xl border border-landing-border/60 bg-[#0e100f] ${className}`}
    >
      {/* Stage content sits behind the overlays and gets covered / revealed. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="landing-font-display text-2xl font-bold tracking-tight text-white/90 md:text-3xl">
          Dynamic Shape Overlays
        </span>
        <span className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
          click to {isCovered ? 'reveal' : 'cover'}
        </span>
      </div>

      <button
        type="button"
        aria-label={isCovered ? 'Reveal stage' : 'Cover stage'}
        className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
        onClick={toggle}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            {GRADIENTS.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor={gradient.from} />
                <stop offset="1" stopColor={gradient.to} />
              </linearGradient>
            ))}
          </defs>
          {/* Layers paint bottom → top; each morphs baseline → curve → fill,
              staggered so they cascade like a wave. */}
          {LAYER_CURVES.map((curve, index) => (
            <AnimeMorph
              key={index}
              ref={setLayerRef(index)}
              to={[curve, TOP_PATH]}
              duration={LAYER_DURATION}
              autoplay={false}
              ease="inOutQuad"
            >
              <path d={BASE_PATH} fill={`url(#dso-${index})`} />
            </AnimeMorph>
          ))}
        </svg>
      </button>

      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 landing-font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
        AnimeMorph · SVG path morph
      </span>
    </div>
  );
});

export default DynamicShapeOverlays;
