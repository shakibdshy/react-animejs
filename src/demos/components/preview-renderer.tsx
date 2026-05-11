import { memo, useEffect, useRef } from 'react';
import { getPreviewAnimId } from '../data';
import { useAnime } from '@/lib/react-animejs/hooks';

interface PreviewRendererProps {
  demoIndex: number;
  className?: string;
}

function StaggerBoxesPreview() {
  useAnime({
    selector: '.demo-prev-box',
    opacity: [0, 1],
    translateY: [10, 0],
    scale: [0.7, 1],
    stagger: 100,
    duration: 500,
    ease: 'outBack' as never,
  });

  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="demo-prev-box w-8 h-8 rounded-md bg-landing-accent flex items-center justify-center text-[12px] font-bold text-landing-bg"
        >
          ✦
        </div>
      ))}
    </div>
  );
}

function SvgPulsePreview() {
  useAnime({
    selector: '.demo-prev-pulse-circle',
    r: [8, 20],
    opacity: [0.6, 0],
    duration: 1200,
    ease: 'outQuad' as never,
    loop: true,
    delay: 500,
  });

  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle
        className="demo-prev-pulse-circle"
        cx="22"
        cy="22"
        r="8"
        fill="none"
        stroke="var(--color-landing-accent)"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function CounterPreview() {
  const targetRef = useRef({ val: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      const { val } = targetRef.current;
      if (spanRef.current) {
        spanRef.current.textContent = Math.round(val).toString();
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  useAnime({
    targets: targetRef.current,
    val: 100,
    duration: 2000,
    ease: 'outQuad' as never,
    loop: true,
    delay: 500,
  });

  return (
    <span
      ref={spanRef}
      className="landing-font-mono text-[36px] font-bold text-landing-accent tabular-nums"
    >
      0
    </span>
  );
}

function BarsGrowPreview() {
  useAnime({
    selector: '.demo-prev-bar',
    scaleX: [0, 1],
    duration: 600,
    stagger: 150,
    ease: 'outCubic' as never,
    loop: true,
    delay: 800,
  });

  return (
    <div className="flex flex-col gap-1.5 w-17.5 items-center">
      {[20, 35, 50].map((w, i) => (
        <div
          key={i}
          className="demo-prev-bar rounded-[3px] bg-landing-accent origin-left"
          style={{ width: w, height: 5 }}
        />
      ))}
    </div>
  );
}

function RingOrbitPreview() {
  return (
    <div className="w-12 h-12 rounded-full border-2 border-landing-accent relative">
      <div className="absolute inset-1.5 rounded-full border-2 border-landing-accent/40" />
      <div className="w-2 h-2 rounded-full bg-landing-accent absolute -top-1 left-1/2 -translate-x-1/2 animate-[orbit_3s_linear_infinite]" />
    </div>
  );
}

function BounceDotsPreview() {
  useAnime({
    selector: '.demo-prev-dot',
    opacity: [0.3, 1],
    translateY: [20, 0],
    stagger: 120,
    duration: 600,
    ease: 'outQuad' as never,
    loop: true,
    delay: 600,
  });

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="demo-prev-dot w-3 h-3 rounded-full bg-landing-accent"
          style={{ opacity: 0.3 + i * 0.25 }}
        />
      ))}
    </div>
  );
}

function ScaleBoxPreview() {
  useAnime({
    selector: '.demo-prev-scale-box',
    scale: [0.3, 1],
    opacity: [0, 1],
    duration: 600,
    ease: 'outBack' as never,
    loop: true,
    delay: 800,
  });

  return (
    <div className="demo-prev-scale-box w-18 h-18 rounded-lg bg-landing-accent flex items-center justify-center text-2xl text-landing-bg font-bold">
      ⋮
    </div>
  );
}

function CubeRotatePreview() {
  return (
    <div className="w-12 h-12 relative" style={{ transformStyle: 'preserve-3d', perspective: 200 }}>
      <div
        className="animate-[cubeRotate_4s_linear_infinite] w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
          <div
            key={face}
            className={`absolute w-12 h-12 border-2 border-landing-accent rounded flex items-center justify-center text-[10px] font-bold text-landing-accent bg-landing-accent/10 cube-face-${face}`}
          >
            {face[0].toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipRevealPreview() {
  useAnime({
    selector: '.demo-prev-clip',
    clipPath: ['circle(0%)', 'circle(70%)'],
    duration: 800,
    ease: 'inOutCubic' as never,
    loop: true,
    direction: 'alternate',
    delay: 800,
  });

  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-landing-accent/10">
      <div
        className="demo-prev-clip w-full h-full flex items-center justify-center text-xl bg-landing-accent text-landing-bg"
        style={{ clipPath: 'circle(0%)' }}
      >
        ✦
      </div>
    </div>
  );
}

function ScramblePreview() {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const original = 'React';
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!spanRef.current) return;
      const progress = frame / 30;
      let result = '';
      for (let i = 0; i < original.length; i++) {
        result +=
          i < progress * original.length
            ? original[i]
            : chars[Math.floor(Math.random() * chars.length)];
      }
      spanRef.current.textContent = result;
      frame++;
      if (frame > 35) {
        spanRef.current.textContent = original;
        frame = 0;
        timer = setTimeout(tick, 1000);
        return;
      }
      timer = setTimeout(tick, 50);
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <span ref={spanRef} className="landing-font-mono text-sm text-landing-accent tracking-wide">
      React
    </span>
  );
}

const previewComponents: Record<string, React.FC> = {
  'stagger-boxes': StaggerBoxesPreview,
  'svg-pulse': SvgPulsePreview,
  counter: CounterPreview,
  'bars-grow': BarsGrowPreview,
  'ring-orbit': RingOrbitPreview,
  'bounce-dots': BounceDotsPreview,
  'scale-box': ScaleBoxPreview,
  'cube-rotate': CubeRotatePreview,
  'clip-reveal': ClipRevealPreview,
  scramble: ScramblePreview,
};

export const PreviewRenderer = memo(function PreviewRenderer({
  demoIndex,
  className,
}: PreviewRendererProps) {
  const animId = getPreviewAnimId(demoIndex);
  const Component = previewComponents[animId];

  if (!Component) return null;

  return (
    <div
      className={`h-35 flex items-center justify-center relative overflow-hidden bg-landing-accent/5 ${className ?? ''}`}
    >
      <Component />
    </div>
  );
});
