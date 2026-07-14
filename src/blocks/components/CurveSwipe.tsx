import { memo, useRef, useState } from 'react';
import { AnimeMorph, type AnimeMorphRef } from '@/lib/react-animejs';

const BASE_PATH = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
const CURVE_PATH = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
const TOP_PATH = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

export const CurveSwipe = memo(function CurveSwipe({ className = '' }: { className?: string }) {
  const morphRef = useRef<AnimeMorphRef>(null);
  const [isRaised, setIsRaised] = useState(true);

  return (
    <div
      className={`relative h-[min(72vh,560px)] min-h-96 overflow-hidden rounded-2xl border border-landing-border/60 bg-[#0e100f] ${className}`}
    >
      <button
        type="button"
        aria-label={isRaised ? 'Lower curve' : 'Raise curve'}
        className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
        onClick={() => {
          if (isRaised) {
            morphRef.current?.controls.reverse();
          } else {
            morphRef.current?.controls.play();
          }
          setIsRaised((current) => !current);
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="curve-swipe-gradient"
              x1="0"
              y1="0"
              x2="99"
              y2="99"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.2" stopColor="rgb(255, 135, 9)" />
              <stop offset="0.7" stopColor="rgb(247, 189, 248)" />
            </linearGradient>
          </defs>
          <AnimeMorph
            ref={morphRef}
            to={[CURVE_PATH, TOP_PATH]}
            duration={500}
            autoplay={false}
            ease="linear"
            onReady={(api: AnimeMorphRef) => {
              // Start in the raised/end state, matching the CodePen.
              api.controls.seek(api.getAnimation()?.duration ?? 500);
            }}
          >
            <path
              className="curve-swipe-path"
              d={BASE_PATH}
              fill="url(#curve-swipe-gradient)"
              stroke="url(#curve-swipe-gradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </AnimeMorph>
        </svg>
        <span className="relative z-10 landing-font-mono text-[10px] tracking-[0.25em] uppercase text-white/70">
          {isRaised ? 'click to lower' : 'click to raise'}
        </span>
      </button>
    </div>
  );
});

export default CurveSwipe;
