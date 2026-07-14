/**
 * ScrollBatchGallery — a React/Anime.js port of GSAP's
 * `ScrollTrigger.batch()` demo.
 *
 * IntersectionObserver supplies the scroll-enter events. A short queueing
 * window groups elements that enter together, then Anime.js animates only that
 * batch with its native `stagger()` utility.
 */
import { memo, useEffect, useRef } from 'react';
import { animate, stagger } from '@/lib/react-animejs';

const img = (seed: string, w = 800, h = 450) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

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

const BATCH_INTERVAL = 100;

export const ScrollBatchGallery = memo(function ScrollBatchGallery({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const pending = new Set<Element>();
    const animations = new Set<{ cancel: () => void }>();
    let flushTimer: ReturnType<typeof setTimeout> | undefined;

    const flush = () => {
      flushTimer = undefined;
      if (pending.size === 0) return;

      const batch = Array.from(pending);
      pending.clear();

      const animation = animate(batch, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 1000,
        delay: stagger(200),
        ease: 'outSine',
      });

      animations.add(animation);
      void animation.then(() => animations.delete(animation));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          observer.unobserve(entry.target);
          pending.add(entry.target);
        }

        if (pending.size > 0 && flushTimer === undefined) {
          flushTimer = setTimeout(flush, BATCH_INTERVAL);
        }
      },
      {
        root,
        // Start just before the element reaches the visible area, like a
        // ScrollTrigger start near the bottom of the viewport.
        rootMargin: '0px 0px -8% 0px',
      },
    );

    root.querySelectorAll<HTMLElement>('[data-batch-item]').forEach((item) =>
      observer.observe(item),
    );

    return () => {
      observer.disconnect();
      if (flushTimer !== undefined) clearTimeout(flushTimer);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
          ScrollTrigger.batch · sequential enter
        </p>
        <h3 className="landing-font-display mt-2 text-lg font-bold text-landing-fg">
          Keep scrolling · images enter in batches
        </h3>
      </div>

      <div
        ref={containerRef}
        className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-6 pb-12 sm:grid-cols-2 lg:grid-cols-3"
        style={{ maxHeight: 'min(72vh, 640px)', overflowY: 'auto' }}
      >
        {ITEMS.map((item) => (
          <figure
            key={item.label}
            data-batch-item
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

      <div className="flex items-center justify-center px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · entering items are batched and staggered
        </span>
      </div>
    </div>
  );
});

export default ScrollBatchGallery;
