/**
 * ScrollImageComparison — a finite, container-scoped before/after reveal.
 *
 * The comparison stage lives in a fixed-height, independently scrollable panel.
 * AnimeScroll observes that panel's target and maps progress to two opposing
 * transforms: the after panel enters from the right while its image enters from
 * the left, keeping the image aligned instead of squashing it as the reveal grows.
 */
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Anime, AnimeScroll, utils } from '@/lib/react-animejs';

const { clamp } = utils;

const svgImage = (id: string, before: boolean) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="sky-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${before ? '#141d25' : '#ffb36b'}"/>
          <stop offset=".55" stop-color="${before ? '#30495b' : '#e85d5a'}"/>
          <stop offset="1" stop-color="${before ? '#0c1016' : '#40253d'}"/>
        </linearGradient>
        <linearGradient id="ground-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${before ? '#263541' : '#673f4b'}"/>
          <stop offset="1" stop-color="${before ? '#080b10' : '#171629'}"/>
        </linearGradient>
        <radialGradient id="sun-${id}" cx="72%" cy="23%" r="34%">
          <stop offset="0" stop-color="${before ? '#b9c8d3' : '#fff2a6'}" stop-opacity=".95"/>
          <stop offset="1" stop-color="${before ? '#b9c8d3' : '#fff2a6'}" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain-${id}">
          <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 .12"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#sky-${id})"/>
      <rect width="1600" height="900" fill="url(#sun-${id})"/>
      <path d="M0 530 C260 430 340 560 590 470 S1040 380 1600 510 V900 H0Z" fill="url(#ground-${id})"/>
      <path d="M0 665 C210 570 360 700 600 625 S1060 520 1600 640" fill="none" stroke="${before ? '#b1c0ca' : '#f8c27b'}" stroke-opacity=".55" stroke-width="16"/>
      <path d="M0 735 C260 640 420 780 720 700 S1120 610 1600 720" fill="none" stroke="${before ? '#d2dbe0' : '#ffe5af'}" stroke-opacity=".2" stroke-width="4"/>
      <circle cx="280" cy="220" r="82" fill="${before ? '#d4e0e6' : '#ffdd8b'}" opacity=".13"/>
      <circle cx="280" cy="220" r="54" fill="${before ? '#d4e0e6' : '#ffdd8b'}" opacity=".2"/>
      <g fill="none" stroke="${before ? '#d4e0e6' : '#ffd9ab'}" stroke-opacity=".22" stroke-width="3">
        <path d="M90 180H510"/><path d="M130 225H470"/><path d="M170 270H430"/>
      </g>
      <rect width="1600" height="900" filter="url(#grain-${id})" opacity=".35"/>
    </svg>
  `)}`;

const BEFORE_IMAGE = svgImage('before', true);
const AFTER_IMAGE = svgImage('after', false);

export interface ScrollImageComparisonProps {
  /** Image shown before the reveal starts. */
  before?: string;
  /** Image shown after the reveal completes. */
  after?: string;
  className?: string;
}

export const ScrollImageComparison = memo(function ScrollImageComparison({
  before = BEFORE_IMAGE,
  after = AFTER_IMAGE,
  className = '',
}: ScrollImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Scroll image comparison"
        className="relative h-[min(72vh,640px)] overflow-y-auto overscroll-contain border-b border-white/10 bg-landing-bg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-landing-accent"
      >
        <AnimeScroll<HTMLDivElement, HTMLDivElement>
          container={containerRef}
          enter={{ target: 'top', container: 'top' }}
          leave={{ target: 'bottom', container: 'bottom' }}
          enabled={ready}
        >
          {({ ref: trackRef, progress }) => {
            const reveal = clamp(progress, 0, 1);
            const afterOffset = (1 - reveal) * 100;
            const imageOffset = -afterOffset;

            return (
              <div ref={trackRef} className="relative h-[240%]">
                <div className="sticky top-0 h-[min(72vh,640px)] overflow-hidden bg-landing-surface">
                  <div className="absolute inset-0">
                    <img
                      src={before}
                      alt="Before color grade"
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ transform: `translate3d(${afterOffset}%, 0, 0)` }}
                    >
                      <img
                        src={after}
                        alt="After color grade"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ transform: `translate3d(${imageOffset}%, 0, 0)` }}
                        draggable={false}
                      />
                    </div>

                    <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-start justify-between sm:inset-x-8 sm:top-7">
                      <div className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 backdrop-blur-md">
                        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
                          before / raw light
                        </span>
                      </div>
                      <div className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 backdrop-blur-md">
                        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
                          after / color grade
                        </span>
                      </div>
                    </div>

                    <Anime
                      opacity={[0, 1]}
                      translateY={[18, 0]}
                      duration={700}
                      ease="outQuad"
                      autoplay
                      enabled={ready}
                    >
                      <div className="pointer-events-none absolute inset-x-5 bottom-6 z-20 sm:inset-x-8 sm:bottom-8">
                        <p className="landing-font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                          Scroll comparison / 01
                        </p>
                        <h3 className="landing-font-display mt-2 max-w-xl text-3xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-5xl">
                          Scroll to reveal the other side.
                        </h3>
                      </div>
                    </Anime>

                    <div className="pointer-events-none absolute bottom-5 right-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
                      <ChevronDown className="h-4 w-4 animate-bounce text-white/55" />
                      <span className="landing-font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
                        keep scrolling
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </AnimeScroll>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-landing-surface/70 px-5 py-4 sm:px-8">
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-landing-muted/75">
          pinned stage → opposing image transforms
        </span>
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.2em] text-landing-accent">
          finite / scrubbed
        </span>
      </div>
    </div>
  );
});

export default ScrollImageComparison;
