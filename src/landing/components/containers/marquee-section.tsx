import { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface MarqueeSectionProps {
  className?: string;
}

const API_TERMS = [
  '<FadeIn>',
  '<Stagger>',
  '<Timeline>',
  '<Reveal>',
  '<Parallax>',
  '<AnimeDraw>',
  '<AnimeLayout>',
  'useAnime',
  'useAnimeTimeline',
  'useAnimeOnScroll',
  'useSplitText',
  'stagger()',
  'spring()',
  'onScroll',
];

/**
 * Infinite editorial ticker — the API surface scrolled as a hairline band.
 * Pure CSS marquee (no JS), respects reduced motion. Sits between hero and
 * features as a visual divider that doubles as a capability list.
 */
export const MarqueeSection = memo(function MarqueeSection({
  className,
}: MarqueeSectionProps) {
  const row = [...API_TERMS, ...API_TERMS];

  return (
    <section
      className={cn(
        'relative border-y border-landing-border py-5 overflow-hidden',
        className
      )}
      aria-label="API surface"
    >
      <div className="landing-marquee">
        <ul className="landing-marquee__track">
          {row.map((term, i) => (
            <li key={i} className="landing-marquee__item">
              <span className="landing-font-mono text-[13px] tracking-[0.04em] text-landing-muted">
                {term}
              </span>
              <span className="text-landing-accent mx-6" aria-hidden="true">
                {'\u2726'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .landing-marquee {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .landing-marquee__track {
          display: inline-flex;
          align-items: center;
          margin: 0;
          padding: 0;
          list-style: none;
          white-space: nowrap;
          animation: landingMarquee 38s linear infinite;
          will-change: transform;
        }
        .landing-marquee__item {
          display: inline-flex;
          align-items: center;
        }
        .landing-marquee:hover .landing-marquee__track {
          animation-play-state: paused;
        }
        @keyframes landingMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-marquee__track { animation: none; }
        }
      `}</style>
    </section>
  );
});
