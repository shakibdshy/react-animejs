/**
 * CardDeckStack — a port of Urvashi Jain's CodePen "Stack cards animation on
 * scroll", rebuilt on react-animejs.
 *
 * Every concept from the original pen maps to the library like this:
 *
 *  - `pin: true` + `start: 'top-=50px top'` + `end: '+=2000'` → the deck sits
 *    on a `sticky` stage offset 50px from the box top (the pen's start gap),
 *    inside a scroll box 180px taller than the stage: the strip below the pin
 *    stays white and arrived cards hang into it, like the page showing under
 *    the pen's pinned container. The track absorbs both gutters, so pinned
 *    travel stays exactly the pen's 2000px.
 *  - `scrub: 1` (seconds to catch up) → `scrub={0.5}` on the scene: the
 *    library's damped chase smooths raw progress into smoothed progress and
 *    rewinds to 0 above the band (halved for the smaller stage).
 *  - the pen's label/tween stack → one data table evaluated per frame: each
 *    tween eases from the value its card holds when the playhead reaches it,
 *    with the original library's default out-quad easing (`eases.outQuad`).
 *    Cards 2–4 slide up from `yPercent: 75 / opacity: 0` while the card just
 *    covered scales down (0.925 / 0.95 / 0.98) and rises slightly; a final
 *    segment settles the deck at `opacity: 0.9` for the covered cards. The
 *    pen's no-op spacing tweens are dropped, and its `setActiveNav` callbacks
 *    are not ported — they call a function the pen never defines.
 *
 * The scene routes progress through `onFrame` — per-frame writes straight to
 * `style.transform` / `style.opacity`, no React re-render per frame.
 */
import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { eases, ScrollScene, utils } from '@shakibdshy/react-animejs';

const { clamp, lerp } = utils;

const CARD_COUNT = 4;
/** The pen's card gradient — one identity for the whole deck. */
const CARD_GRADIENT = 'linear-gradient(-40deg, #d754ad 0%, #f96785 67%, #fe7333 100%)';
/** The pen's stacked top offsets (px), one step per deeper card. */
const TOP_OFFSETS = [0, 30, 60, 90];
/** The pen's stage: a 70vh-tall, 80%-wide deck of rounded gradient cards. */
const STAGE_HEIGHT = 'min(70vh, 640px)';
/**
 * The pen pins with the deck ~50px below the viewport top (`top-=50px`) and
 * leaves the white page visible under the pinned container — the box keeps
 * both gutters: the stage sticks 50px down, and the box runs 130px past the
 * stage so arrived cards (deepest hang: 90px) overlay white, not the edge.
 */
const TOP_GAP = 50;
const BOTTOM_GAP = 130;
const BOX_HEIGHT = `calc(${STAGE_HEIGHT} + ${TOP_GAP + BOTTOM_GAP}px)`;
/** The pen's `end: '+=2000'` — track minus box = 2000px of travel, exactly. */
const TRACK_HEIGHT = `calc(${STAGE_HEIGHT} + ${TOP_GAP + BOTTOM_GAP + 2000}px)`;

type DeckProp = 'y' | 'scale' | 'opacity';
type DeckState = Record<DeckProp, number>;
type Tween = { card: number; prop: DeckProp; at: number; to: number };

/** One default-duration tween = 0.5 timeline units in the pen. */
const TWEEN_DURATION = 0.5;
/** Total timeline length (the pen's last tween ends at 4.7 units). */
const TIMELINE_END = 4.7;

/** The pose the pen's CSS + `immediateRender` start values produce. */
const BASE_STATE: DeckState[] = [
  { y: 0, scale: 1, opacity: 1 }, // card 1 rests in place
  { y: 75, scale: 1, opacity: 0 }, // cards 2–4 start hidden below
  { y: 75, scale: 1, opacity: 0 },
  { y: 75, scale: 1, opacity: 0 },
];

/**
 * The pen's timeline, chronologically. Each entry animates the card's current
 * value toward `to` over [at, at + 0.5]; overlaps with its sibling slide are
 * kept (`-=0.3`), the no-op spacing tweens (`yPercent: 0, opacity: 1`) and
 * the broken `setActiveNav` callbacks are not ported.
 */
const TIMELINE: Tween[] = [
  // Slide 2 arrives; slide 1 recedes under it.
  { card: 1, prop: 'y', at: 0.5, to: 0 },
  { card: 1, prop: 'opacity', at: 0.5, to: 1 },
  { card: 0, prop: 'scale', at: 0.7, to: 0.925 },
  { card: 0, prop: 'y', at: 0.7, to: -0.75 },
  // Slide 3 arrives; slide 2 recedes under it.
  { card: 2, prop: 'y', at: 1.7, to: 0 },
  { card: 2, prop: 'opacity', at: 1.7, to: 1 },
  { card: 1, prop: 'scale', at: 1.9, to: 0.95 },
  { card: 1, prop: 'y', at: 1.9, to: -0.5 },
  // Slide 4 arrives; slide 3 recedes under it.
  { card: 3, prop: 'y', at: 2.9, to: 0 },
  { card: 3, prop: 'opacity', at: 2.9, to: 1 },
  { card: 2, prop: 'scale', at: 3.1, to: 0.98 },
  { card: 2, prop: 'y', at: 3.1, to: -0.4 },
  // The deck settles: covered cards dim and tuck in.
  { card: 0, prop: 'y', at: 3.8, to: -1.5 },
  { card: 0, prop: 'opacity', at: 3.8, to: 0.9 },
  { card: 1, prop: 'y', at: 4.0, to: -1.125 },
  { card: 1, prop: 'opacity', at: 4.0, to: 0.9 },
  { card: 2, prop: 'y', at: 4.2, to: -0.85 },
  { card: 2, prop: 'opacity', at: 4.2, to: 0.9 },
];

export const CardDeckStack = memo(function CardDeckStack({
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
      current[tween.prop] = lerp(current[tween.prop], tween.to, eases.outQuad(local));
    }

    for (let i = 0; i < CARD_COUNT; i++) {
      const card = cards[i];
      if (!card) continue;
      const { y, scale, opacity } = state[i];
      card.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
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
      {/* One scene owns the observer: scrub damping, rewind, cleanup. */}
      <ScrollScene<HTMLDivElement, HTMLDivElement>
        enter={{ target: 'top', container: 'top' }}
        leave={{ target: 'bottom', container: 'bottom' }}
        scrub={0.5}
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
            aria-label="Card deck stack scroll animation"
            className="relative w-full overflow-y-auto overscroll-contain"
            style={{ height: BOX_HEIGHT, backgroundColor: '#fff' }}
          >
            {/* Tall track: the observed target; travel = the pen's +=2000. */}
            <div ref={targetRef} className="relative" style={{ height: TRACK_HEIGHT }}>
              {/* Sticky stage = the pen's pin, held TOP_GAP below the box top
                  like the pen's `start: 'top-=50px top'`; overflow stays
                  visible so arrived cards hang into the white strip below. */}
              <div className="sticky w-full" style={{ top: TOP_GAP, height: STAGE_HEIGHT }}>
                <div className="relative mx-auto h-full" style={{ width: '80%' }}>
                  {TOP_OFFSETS.map((top, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        cardsRef.current[i] = el;
                      }}
                      className="absolute flex w-full items-center justify-center text-white"
                      style={{
                        top,
                        height: '100%',
                        // The pen stacks z upward: each slide covers the last.
                        zIndex: i + 1,
                        borderRadius: 50,
                        background: CARD_GRADIENT,
                        boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)',
                        willChange: 'transform, opacity',
                        // The pose before the first scroll frame (SSR-safe).
                        transform: `translate3d(0, ${BASE_STATE[i].y}%, 0)`,
                        opacity: BASE_STATE[i].opacity,
                      }}
                    >
                      <h1 className="m-0">Slide {i + 1}</h1>
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
          scroll inside the box · four slides stack into one deck
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

export default CardDeckStack;
