/**
 * BlurTiltStack — a port of Arunakeshavaiah's CodePen "Animation Card Stack",
 * rebuilt on react-animejs.
 *
 * Every concept from the original pen maps to the library like this:
 *
 *  - `pin: true` + `end: '+=5 × 100vh'` → the stack sits on a `sticky` stage
 *    50px below the box top (the pen's `start: 'top top+=50'`), inside a
 *    self-contained scroll box whose track gives one stage-height of travel
 *    per card — the pen's per-viewport pacing, scoped to the box.
 *  - `scrub: true` (direct 1:1, no damping) → bare `scrub` on the scene.
 *  - the label/tween stack → one data table evaluated per frame: each card
 *    after the first fades in and rises 200px into place, while the card just
 *    covered blurs to 5px and tilts ±7° (direction alternating per card) and
 *    stays there — no settle segment, the covered stack keeps its tilt.
 *    Easing is out-quad per tween.
 *
 * The pen's `transition: all 0.5s` on the cards is not ported: CSS
 * transitions fight per-frame scrubbed writes (double easing). The scene
 * routes progress through `onFrame` — per-frame writes straight to
 * `style.transform` / `style.filter` / `style.opacity`, no React re-render.
 */
import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { eases, ScrollScene, utils } from '@shakibdshy/react-animejs';

const { clamp, lerp } = utils;

const CARD_COUNT = 5;
/** The pen's per-card pastel bodies. */
const CARD_COLORS = ['#52b2cf', '#e5a36f', '#9cadce', '#d4afb9', '#5452cf'];
/** The pen's stage: a 600px column, full viewport height, overflow hidden. */
const STAGE_HEIGHT = 'min(70vh, 640px)';
/**
 * The pen pins with the container 50px below the viewport top
 * (`start: 'top top+=50'`) over its gray section — the box keeps a 60px
 * strip below the pin for the same breathing room.
 */
const TOP_GAP = 50;
const BOTTOM_GAP = 60;
const BOX_HEIGHT = `calc(${STAGE_HEIGHT} + ${TOP_GAP + BOTTOM_GAP}px)`;
/** The pen's `end: '+=cards × 100vh'` — the band (track minus box) is one
 *  stage-height per card, so the track carries one extra stage. */
const TRACK_HEIGHT = `calc(${STAGE_HEIGHT} * ${CARD_COUNT + 1} + ${TOP_GAP + BOTTOM_GAP}px)`;

type CardProp = 'y' | 'opacity' | 'blur' | 'rotation';
type CardState = Record<CardProp, number>;
/** One tween: animate the card's current values toward `to` over [at, at + 1]. */
type Tween = { card: number; at: number; to: Partial<CardState> };

/** The pen tweens all segments with duration 1, positioned at whole numbers. */
const TWEEN_DURATION = 1;
/** Total timeline length: the last segment ends at 5 units. */
const TIMELINE_END = CARD_COUNT;

/** The pen's `gsap.set` initial pose: card 1 in place, the rest 200px low. */
const BASE_STATE: CardState[] = [
  { y: 0, opacity: 1, blur: 0, rotation: 0 },
  { y: 200, opacity: 0, blur: 0, rotation: 0 },
  { y: 200, opacity: 0, blur: 0, rotation: 0 },
  { y: 200, opacity: 0, blur: 0, rotation: 0 },
  { y: 200, opacity: 0, blur: 0, rotation: 0 },
];

/**
 * The pen's timeline, chronologically. Each arriving card fades and rises
 * while its predecessor blurs and tilts aside; the tilt direction alternates
 * (-7, +7, -7, +7) and covered cards keep both effects.
 */
const TIMELINE: Tween[] = [
  { card: 1, at: 1, to: { y: 0, opacity: 1 } },
  { card: 0, at: 1, to: { blur: 5, rotation: -7 } },
  { card: 2, at: 2, to: { y: 0, opacity: 1 } },
  { card: 1, at: 2, to: { blur: 5, rotation: 7 } },
  { card: 3, at: 3, to: { y: 0, opacity: 1 } },
  { card: 2, at: 3, to: { blur: 5, rotation: -7 } },
  { card: 4, at: 4, to: { y: 0, opacity: 1 } },
  { card: 3, at: 4, to: { blur: 5, rotation: 7 } },
];

export const BlurTiltStack = memo(function BlurTiltStack({
  className = '',
}: {
  className?: string;
}) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  /** The ported timeline: replayed from progress, one write per card. */
  const applyFrame = useCallback((p: number) => {
    const cards = cardsRef.current;
    if (cards.length === 0) return;

    const s = clamp(p, 0, 1) * TIMELINE_END;
    const state = BASE_STATE.map((base) => ({ ...base }));
    for (const tween of TIMELINE) {
      const local = clamp((s - tween.at) / TWEEN_DURATION, 0, 1);
      if (local === 0) continue;
      const current = state[tween.card];
      for (const [prop, to] of Object.entries(tween.to) as [CardProp, number][]) {
        current[prop] = lerp(current[prop], to, eases.outQuad(local));
      }
    }

    for (let i = 0; i < CARD_COUNT; i++) {
      const card = cards[i];
      if (!card) continue;
      const { y, opacity, blur, rotation } = state[i];
      card.style.transform = `translate3d(0, ${y}px, 0) rotate(${rotation}deg)`;
      card.style.filter = `blur(${blur}px)`;
      card.style.opacity = `${opacity}`;
    }
  }, []);

  // Initial hidden-below pose before the first scroll frame lands (SSR-safe).
  useLayoutEffect(() => {
    applyFrame(0);
  }, [applyFrame]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      {/* One scene owns the observer: 1:1 scrub, rewind, cleanup. */}
      <ScrollScene<HTMLDivElement, HTMLDivElement>
        enter={{ target: 'top', container: 'top' }}
        leave={{ target: 'bottom', container: 'bottom' }}
        scrub
        onFrame={(p) => {
          applyFrame(p);
          if (barRef.current) barRef.current.style.width = `${Math.round(p * 100)}%`;
          if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
        }}
      >
        {({ targetRef, containerRef }) => (
          /* ── Self-contained scroll box (the pen's gray section) ─────────── */
          <div
            ref={containerRef}
            tabIndex={0}
            role="region"
            aria-label="Blur tilt card stack scroll animation"
            className="relative w-full overflow-y-auto overscroll-contain"
            style={{ height: BOX_HEIGHT, backgroundColor: '#cfcfcf', color: '#2c292e' }}
          >
            {/* Tall track: the observed target; one stage-height per card. */}
            <div ref={targetRef} className="relative" style={{ height: TRACK_HEIGHT }}>
              {/* Sticky stage = the pen's pin, held TOP_GAP below the box top
                  like the pen's `start: 'top top+=50'`. */}
              <div className="sticky w-full" style={{ top: TOP_GAP, height: STAGE_HEIGHT }}>
                <div className="relative mx-auto h-full" style={{ width: 'min(600px, 90%)' }}>
                  {CARD_COLORS.map((color, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        cardsRef.current[i] = el;
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        zIndex: i + 1,
                        willChange: 'transform, opacity, filter',
                        // The pose before the first scroll frame (SSR-safe).
                        transform: `translate3d(0, ${BASE_STATE[i].y}px, 0)`,
                        opacity: BASE_STATE[i].opacity,
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          boxSizing: 'border-box',
                          width: '100%',
                          height: 350,
                          padding: 30,
                          borderRadius: 20,
                          backgroundColor: color,
                        }}
                      >
                        <h2 className="m-0" style={{ fontSize: '2.5em' }}>
                          Card {i + 1}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollScene>

      {/* Progress + hint footer, outside the scroll box. */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · covered cards blur and tilt aside
        </span>
        <div className="flex items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-landing-border/50">
            <div
              ref={barRef}
              className="h-full rounded-full bg-landing-accent"
              style={{ width: '0%' }}
            />
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

export default BlurTiltStack;
