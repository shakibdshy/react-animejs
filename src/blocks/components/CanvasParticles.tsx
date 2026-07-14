import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  AnimeTimeline,
  type AnimeTimelineRef,
  stagger,
  type TimelineEntry,
} from '@/lib/react-animejs';

type Particle = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  image: HTMLImageElement;
};

type ParticleScene = {
  rotation: number;
};

const PARTICLE_COUNT = 99;
const PARTICLE_ASSET_COUNT = 21;

function createParticles(radius: number) {
  return Array.from({ length: PARTICLE_COUNT }, (_, index): Particle => {
    const angle = (index / PARTICLE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const image = new Image();

    image.src = `https://assets.codepen.io/16327/flair-${
      2 + (index % PARTICLE_ASSET_COUNT)
    }.png`;

    return {
      x: Math.cos(angle * 10) * radius,
      y: Math.sin(angle * 10) * radius,
      scale: 1.1,
      rotate: 0,
      image,
    };
  });
}

export const CanvasParticles = memo(function CanvasParticles({
  className = '',
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radiusRef = useRef(1000);
  const dimensionsRef = useRef({ width: 1, height: 1, pixelRatio: 1 });
  const timelineApiRef = useRef<AnimeTimelineRef | null>(null);
  const scene = useMemo<ParticleScene>(() => ({ rotation: 0 }), []);

  const particles = useMemo(
    () =>
      typeof window === 'undefined'
        ? []
        : createParticles(Math.max(window.innerWidth, window.innerHeight)),
    [],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height, pixelRatio } = dimensionsRef.current;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    particles.sort((a, b) => a.scale - b.scale);

    particles.forEach((particle) => {
      const imageWidth = particle.image.naturalWidth || particle.image.width;
      const imageHeight = particle.image.naturalHeight || particle.image.height;
      if (!imageWidth || !imageHeight) return;

      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(scene.rotation);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotate);
      context.drawImage(
        particle.image,
        0,
        0,
        imageWidth * particle.scale,
        imageHeight * particle.scale,
      );
      context.restore();
    });
  }, [particles, scene]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    dimensionsRef.current = { width, height, pixelRatio };
    radiusRef.current = Math.max(width, height);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    timelineApiRef.current?.controls.refresh();
    draw();
  }, [draw]);

  useEffect(() => {
    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    const imageLoadHandlers = particles.map((particle) => {
      particle.image.addEventListener('load', draw);
      return particle.image;
    });

    return () => {
      resizeObserver.disconnect();
      imageLoadHandlers.forEach((image) => image.removeEventListener('load', draw));
    };
  }, [draw, particles, resize]);

  const entries = useMemo<TimelineEntry[]>(
    () => [
      {
        targets: particles,
        x: [
          (_target: unknown, index = 0) => {
            const angle = (index / PARTICLE_COUNT) * Math.PI * 2 - Math.PI / 2;
            return Math.cos(angle * 10) * radiusRef.current;
          },
          0,
        ] as any,
        y: [
          (_target: unknown, index = 0) => {
            const angle = (index / PARTICLE_COUNT) * Math.PI * 2 - Math.PI / 2;
            return Math.sin(angle * 10) * radiusRef.current;
          },
          0,
        ] as any,
        scale: [1.1, 0],
        // Positive canvas angles rotate clockwise. Each particle keeps its
        // own repeating tween, matching the CodePen's staggered repeat model.
        rotate: [0, 3],
        duration: 5000,
        ease: 'inOutSine',
        delay: stagger(-50) as any,
        loop: true,
        position: 0,
      },
      {
        targets: scene,
        rotation: [0, Math.PI * 2],
        duration: 5000,
        ease: 'linear',
        loop: true,
        position: 0,
      },
    ],
    [particles, scene],
  );

  return (
    <div
      className={`relative h-[min(72vh,640px)] min-h-96 w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-[#0e100f] ${className}`}
    >
      <AnimeTimeline
        autoplay
        entries={entries}
        onUpdate={draw}
        onReady={(api) => {
          timelineApiRef.current = api;
          api.controls.seek(99);
          resize();
        }}
      >
        {({ controls, state }) => (
          <>
            <canvas
              ref={canvasRef}
              aria-label="Animated particle field"
              className="absolute inset-0 h-full w-full"
              onPointerUp={() => controls.setPlaybackRate(state.speed === 0 ? 1 : 0)}
            />
            <button
              type="button"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/30 px-4 py-2 landing-font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 backdrop-blur transition hover:border-white/30 hover:text-white"
              onClick={() => controls.setPlaybackRate(state.speed === 0 ? 1 : 0)}
            >
              {state.speed === 0 ? 'Resume field' : 'Pause field'}
            </button>
          </>
        )}
      </AnimeTimeline>
    </div>
  );
});

export default CanvasParticles;
