import { memo, useCallback, useRef, useState } from 'react';
import { AnimeDraw, AnimeMorph, AnimeMotionPath } from '@/lib/react-animejs/components';
import { DRAWABLE_SHAPES, MORPH_HEXAGON, MORPH_TRIANGLE, SUZUKA_TRACK_PATH } from './constants';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const SvgMorphPreview = memo(function SvgMorphPreview(_props: PreviewProps) {
  const targetRef = useRef<SVGPolygonElement | null>(null);
  const [shape, setShape] = useState<'triangle' | 'hexagon'>('triangle');

  const handleMorph = useCallback(() => {
    setShape((s) => (s === 'triangle' ? 'hexagon' : 'triangle'));
  }, []);

  return (
    <PreviewCard
      title="SVG Morph"
      description="Polygon path morphing via AnimeMorph"
      controls={
        <DemoButton onClick={handleMorph} variant="accent" small>
          Morph
        </DemoButton>
      }
    >
      <svg viewBox="0 0 200 160" className="w-36 h-28">
        <defs>
          <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-landing-accent, oklch(0.55 0.12 160))" />
            <stop offset="100%" stopColor="var(--color-landing-fg, oklch(0.25 0.02 260))" />
          </linearGradient>
        </defs>
        <AnimeMorph
          target={targetRef}
          duration={800}
          ease="inOutQuad"
          alternate
          loop
          autoplay
          deps={[shape]}
        >
          <polygon
            points={shape === 'triangle' ? MORPH_TRIANGLE : MORPH_HEXAGON}
            fill="url(#morphGrad)"
            stroke="var(--color-landing-accent, oklch(0.55 0.12 160))"
            strokeWidth="1.5"
            opacity="0.85"
          />
        </AnimeMorph>
        <polygon
          ref={targetRef}
          points={shape === 'triangle' ? MORPH_HEXAGON : MORPH_TRIANGLE}
          fill="none"
          stroke="none"
        />
      </svg>
    </PreviewCard>
  );
});

export const SvgDrawPreview = memo(function SvgDrawPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="SVG Draw" description="Staged stroke draw via AnimeDraw">
      <svg
        viewBox="0 0 304 112"
        className="w-52 h-20 overflow-visible"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="var(--color-landing-accent, oklch(0.55 0.12 160))" strokeWidth="2">
          {DRAWABLE_SHAPES.map((shape, index) => (
            <AnimeDraw
              key={index}
              draw={['0 0', '0 1', '1 1']}
              delay={index * 100}
              duration={2000}
              ease="inOutQuad"
              loop
              autoplay
            >
              {shape.type === 'path' ? <path d={shape.d} /> : <polyline points={shape.points} />}
            </AnimeDraw>
          ))}
        </g>
      </svg>
    </PreviewCard>
  );
});

export const SvgMotionPathPreview = memo(function SvgMotionPathPreview(_props: PreviewProps) {
  const trackRef = useRef<SVGPathElement | null>(null);

  return (
    <PreviewCard title="Motion Path" description="Car follows Suzuka track via AnimeMotionPath">
      <svg viewBox="0 0 304 112" className="w-52 h-20 overflow-visible">
        <path
          d={SUZUKA_TRACK_PATH}
          fill="none"
          stroke="var(--color-landing-border, oklch(0.85 0.01 260))"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <AnimeDraw draw="0 1" duration={5000} ease="linear" loop autoplay>
          <path
            ref={trackRef}
            d={SUZUKA_TRACK_PATH}
            fill="none"
            stroke="var(--color-landing-accent, oklch(0.55 0.12 160))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AnimeDraw>
        <AnimeMotionPath path={trackRef} duration={5000} ease="linear" loop autoplay>
          <g>
            <rect
              x="-9"
              y="-5"
              width="18"
              height="10"
              rx="3"
              fill="var(--color-landing-fg, oklch(0.25 0.02 260))"
            />
            <rect
              x="-3"
              y="-8"
              width="10"
              height="6"
              rx="2"
              fill="var(--color-landing-accent, oklch(0.55 0.12 160))"
            />
            <circle cx="-5" cy="6" r="2.2" fill="var(--color-landing-bg, oklch(0.98 0.005 90))" />
            <circle cx="5" cy="6" r="2.2" fill="var(--color-landing-bg, oklch(0.98 0.005 90))" />
          </g>
        </AnimeMotionPath>
      </svg>
    </PreviewCard>
  );
});
