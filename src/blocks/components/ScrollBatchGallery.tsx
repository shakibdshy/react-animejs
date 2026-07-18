/**
 * ScrollBatchGallery — a React/Anime.js port of GSAP's
 * `ScrollTrigger.batch()` demo.
 *
 * IntersectionObserver supplies the scroll-enter events. A short queueing
 * window groups elements that enter together, then Anime.js animates only that
 * batch with its native `stagger()` utility.
 */
import { memo, useRef } from 'react';
import { AnimeBatch, stagger } from '@/lib/react-animejs';

const img = (seed: string, w = 800, h = 450) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SUBJECTS = [
  'Quentin',
  'Elizabeth',
  'Alex',
  'Morgan',
  'Sam',
  'Riley',
  'Jamie',
  'Casey',
  'Jordan',
  'Taylor',
  'Avery',
  'Maya',
  'Noah',
  'Sage',
  'Robin',
  'Kai',
  'Remy',
  'Drew',
];

const ITEMS = SUBJECTS.map((title, index) => ({
  src: img(`batch-${title.toLowerCase()}`),
  label: String(index + 1).padStart(2, '0'),
  title,
}));

export const ScrollBatchGallery = memo(function ScrollBatchGallery({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Batched scroll gallery"
        className="mx-auto max-h-[min(72vh,640px)] max-w-6xl overflow-y-auto px-6 pb-12"
      >
        <AnimeBatch
          rootRef={containerRef}
          interval={100}
          rootMargin="0px 0px -8% 0px"
          animation={{
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 1000,
            delay: stagger(200),
            ease: 'outSine',
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((item) => (
              <figure
                key={item.label}
                data-anime-batch
                className="relative aspect-video overflow-hidden rounded-lg border border-landing-border/40 bg-landing-surface opacity-0"
              >
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-landing-bg/90 to-transparent p-3 pt-8">
                  <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-white/80">
                    {item.label}
                  </span>
                  <span className="landing-font-display text-sm font-bold text-landing-fg drop-shadow">
                    {item.title}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </AnimeBatch>
      </div>

      <div className="flex items-center justify-center px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · entering items are batched and staggered
        </span>
      </div>
    </div>
  );
});

export default ScrollBatchGallery;
