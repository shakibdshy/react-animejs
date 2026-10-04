/**
 * StackedCardsReveal — a port of the GSAP pen "stacked cards reveal w/
 * scrolltrigger" (inspired by hildenkaira.fi), rebuilt on react-animejs.
 *
 * Every ScrollTrigger concept maps to the library like this:
 *
 *  - `pin: true` + `end: '+= innerHeight * cards.length'` → the card stage is
 *    `sticky` inside a tall scroll track (N + 1 × the box height), so it pins
 *    for exactly N × stageHeight of scroll — the pen's travel, scoped to a
 *    self-contained scroll box instead of the page.
 *  - `scrub: 1` → `scrub={0.25}` on the scene: the library's damped chase
 *    (seconds-to-catch-up) smooths progress and rewinds to 0 above the band,
 *    the pen's buttery scrub feel with zero hand-written frame code.
 *  - the `gsap.timeline()` tween stack → one `applyFrame(progress)` function
 *    evaluating the same math: card i flies off (y → −stageHeight,
 *    z → +120, rotate → stable random tilt) during segment i while every card
 *    above it shifts one slot forward (40px / −150px per slot); the final
 *    segment pushes the last card toward the camera (z → +150).
 *
 * The scene routes progress through `onFrame` — per-frame writes straight to
 * `style.transform`, no React re-render per frame.
 */
import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { ScrollScene, utils } from '@shakibdshy/react-animejs';

const { clamp, lerp } = utils;

const CARD_COUNT = 5;
/** The pen's timeline geometry: each slot is +40px y / −150px z. */
const STEP_Y = 40;
const STEP_Z = 150;
/** A flying card backs off toward the viewer to STEP_Z * 0.8, as in the pen. */
const FLY_Z = STEP_Z * 0.8;
/** Total timeline length is N units (one unit per card). Track = (N + 1)H so
 *  the pinned travel is exactly N × stage height, like the pen's `end`. */
const TRACK_HEIGHT = `${(CARD_COUNT + 1) * 100}%`;
const STAGE_HEIGHT = 'min(74vh, 640px)';

/** The pen's card palette. */
const BG_COLORS = ['#c6d3e6', '#dce6c6', '#e6cdd6', '#d6d4e7', '#ebe4b7'];

/** The pen's cards: verbatim copy + Unsplash photography. */
const CARDS = [
  {
    text: 'A blue boat moored in clear water beside a white terrace with flowers.',
    img: 'https://images.unsplash.com/photo-1786125800918-a4ebc6c39ce4?q=80&w=500&auto=format&fit=crop',
  },
  {
    text: 'Boats moored in the harbor of Corricella on the island of Procida, Italy.',
    img: 'https://images.unsplash.com/photo-1786125800935-6db298816e09?q=80&w=500&auto=format&fit=crop',
  },
  {
    text: 'Silhouetted figures on a bench watching golden sunset over water.',
    img: 'https://images.unsplash.com/photo-1785882135046-dc711e5eb2e8?q=80&w=500&auto=format&fit=crop',
  },
  {
    text: 'Rippling blue water in a tiled swimming pool.',
    img: 'https://images.unsplash.com/photo-1786051164107-822ce7eada8f?q=80&w=500&auto=format&fit=crop',
  },
  {
    text: 'A person sitting on a chair in a dark arched doorway facing a yellow building.',
    img: 'https://images.unsplash.com/photo-1786125800822-c0bd817ed060?q=80&w=500&auto=format&fit=crop',
  },
];

/** The pen's page copy, kept verbatim. */
const INTRO =
  'The mornings were slow, the afternoons were sunny, and somehow every day felt a little longer than the one before.';

/** The pen's decorative checkered rule under main/footer sections. */
function CheckeredRule() {
  return (
    <div
      aria-hidden
      className="mx-auto"
      style={{
        width: 100,
        height: 20,
        backgroundImage:
          'repeating-conic-gradient(currentcolor 0 90deg, transparent 90deg 180deg)',
        backgroundSize: '30px 20px',
        backgroundRepeat: 'round no-repeat',
      }}
    />
  );
}

export const StackedCardsReveal = memo(function StackedCardsReveal({
  className = '',
}: {
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rotationsRef = useRef<number[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  /** The ported timeline: one segment per card, evaluated from progress. */
  const applyFrame = useCallback((p: number) => {
    const stage = stageRef.current;
    const cards = cardsRef.current;
    if (!stage || cards.length === 0) return;

    if (rotationsRef.current.length === 0) {
      // The pen's `(Math.random() + 0.3) * 20 - 13`, drawn once per card.
      rotationsRef.current = CARDS.map(() => (Math.random() + 0.3) * 20 - 13);
    }

    const stageH = stage.clientHeight;
    const s = p * CARD_COUNT; // playhead in timeline units (0 → N)

    for (let i = 0; i < CARD_COUNT; i++) {
      const card = cards[i];
      if (!card) continue;

      const t = clamp(s - i, 0, 1); // this card's own segment progress
      const slot = i - Math.min(s, i); // stack slot while it hasn't flown

      let y: number;
      let z: number;
      if (i < CARD_COUNT - 1) {
        y = lerp(slot * STEP_Y, -stageH, t);
        z = lerp(slot * -STEP_Z, FLY_Z, t);
        const rot = rotationsRef.current[i] ?? 0;
        card.style.transform = `translate3d(0, ${y}px, ${z}px) rotate(${rot * t}deg)`;
      } else {
        // The last card never flies; the final segment pushes it forward.
        y = slot * STEP_Y;
        z = lerp(slot * -STEP_Z, STEP_Z, t);
        card.style.transform = `translate3d(0, ${y}px, ${z}px)`;
      }
    }
  }, []);

  // Initial stack pose before the first scroll frame lands (SSR-safe).
  useLayoutEffect(() => {
    applyFrame(0);
  }, [applyFrame]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      {/* The pen's Instrument Serif identity, scoped to this block. */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}
      </style>

      {/* One scene owns the observer: scrub damping, rewind, cleanup. */}
      <ScrollScene<HTMLDivElement, HTMLDivElement>
        enter={{ target: 'top', container: 'top' }}
        leave={{ target: 'bottom', container: 'bottom' }}
        scrub={0.25}
        onFrame={(p) => {
          applyFrame(p);
          if (barRef.current) barRef.current.style.width = `${Math.round(p * 100)}%`;
          if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
        }}
      >
        {({ targetRef, containerRef }) => (
          /* ── Self-contained scroll box (the pen's page) ────────────────── */
          <div
            ref={containerRef}
            tabIndex={0}
            role="region"
            aria-label="Stacked cards reveal scroll animation"
            className="relative w-full overflow-y-auto overscroll-contain"
            style={{
              height: STAGE_HEIGHT,
              backgroundColor: '#ececec',
              color: '#222',
              fontFamily: "'Instrument Serif', Georgia, serif",
              textWrap: 'pretty',
            }}
          >
            {/* The pen's intro paragraph. */}
            <div className="mx-auto max-w-200 px-6 pt-14 pb-10 text-center text-[clamp(1.25rem,2.5vw,1.9rem)] leading-snug sm:px-10">
              <p>{INTRO}</p>
              <div className="mt-10">
                <CheckeredRule />
              </div>
            </div>

            {/* Tall track: the observed target; travel = N × stage height. */}
            <div ref={targetRef} className="relative" style={{ height: TRACK_HEIGHT }}>
              {/* Sticky stage = the pen's pin (`start: 'center center'`). */}
              <div
                ref={stageRef}
                className="sticky top-0 flex w-full items-center justify-center overflow-hidden"
                style={{ height: STAGE_HEIGHT }}
              >
                <div
                  className="relative w-full max-w-152 px-6 pb-12"
                  style={{ perspective: '1200px' }}
                >
                  {CARDS.map((card, i) => {
                    const isLast = i === CARD_COUNT - 1;
                    return (
                      <div
                        key={i}
                        ref={(el) => {
                          cardsRef.current[i] = el;
                        }}
                        className="flex items-center gap-6 p-6"
                        style={{
                          backgroundColor: BG_COLORS[i],
                          zIndex: CARD_COUNT - i,
                          position: isLast ? 'relative' : 'absolute',
                          inset: isLast ? undefined : 0,
                          maxWidth: 600,
                          marginInline: 'auto',
                          aspectRatio: '4 / 3',
                          willChange: 'transform',
                          // The pen's `gsap.set` initial pose (SSR-safe too).
                          transform: `translate3d(0, ${i * STEP_Y}px, ${i * -STEP_Z}px)`,
                        }}
                      >
                        <span
                          aria-hidden
                          className="absolute top-6 left-6 italic"
                          style={{ fontSize: '2em', mixBlendMode: 'difference' }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1" style={{ fontSize: 'clamp(1rem, 1.2rem + 0.5vw, 1.5rem)' }}>
                          {card.text}
                        </div>
                        <img
                          src={card.img}
                          alt=""
                          loading="lazy"
                          draggable={false}
                          className="aspect-square w-1/2 object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* The pen's footer, revealed when the pin releases. */}
            <footer className="mx-auto max-w-200 px-6 pt-12 pb-16 text-center text-[clamp(1.25rem,2.5vw,1.9rem)] sm:px-10">
              <CheckeredRule />
              <p className="mt-8">The end.</p>
            </footer>
          </div>
        )}
      </ScrollScene>

      {/* Progress + hint footer, outside the scroll box. */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · five cards, one scrubbed timeline
        </span>
        <div className="flex items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-landing-border/50">
            <div ref={barRef} className="h-full rounded-full bg-landing-accent" style={{ width: '0%' }} />
          </div>
          <span
            ref={pctRef}
            className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70 tabular-nums"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
});

export default StackedCardsReveal;
