/**
 * ButterScroll — five clips rest in the slots of a hero sentence above a
 * dark video-editor timeline; scrolling drops each clip into its cell and
 * assembles the track. Built entirely from library components:
 *
 *  - `<SplitText>` (words) feeds two parallel `<AnimeTimeline>` /
 *    `<SplitTextEntry>` pairs for the intro: words fade in (0.6s outQuad,
 *    60ms stagger) while their fill colorizes from transparent to #111 and a
 *    per-word glow (hue 180° + 15° per word, stamped into `--glow-h`) fades
 *    out through `--glow-a` (1.4s inCubic). The intro pose is written onto
 *    the split words in a layout effect so it lands before the first paint.
 *  - one `<Anime autoplay>` per clip fades it in (600ms outQuad, 150ms
 *    stagger).
 *  - one `<ScrollScene>` observes the editor section against the window
 *    (`enter`/`leave` + `scrub={1}` — a number is seconds-to-catch-up,
 *    ADR-0001, which is where the butter comes from). Its `onFrame` callback
 *    drives the whole flight: clip i leaves its slot at i * 0.1 and lands in
 *    its cell over 1.0 on a cubic inOut, while a ±12° sine inOut sway rides
 *    the same span — every frame writes `style.transform` directly, so the
 *    scene costs zero React re-renders.
 *  - `measure()` captures each slot↔cell offset once and re-captures on mount,
 *    window resize, and font load; both sections scroll together, so the
 *    offsets only move when layout does.
 */
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Anime,
  AnimeTimeline,
  ScrollScene,
  SplitText,
  SplitTextEntry,
  utils,
} from '@shakibdshy/react-animejs';
import type { SplitTextRef } from '@shakibdshy/react-animejs';

const { clamp, lerp } = utils;

const CELL_COUNT = 5;

/** The flight timeline: clip i leaves its slot at i * FLIGHT_STAGGER and
 *  lands in its cell over FLIGHT_DURATION, with a sway that runs out and
 *  back over that same span. */
const FLIGHT_DURATION = 1;
const FLIGHT_STAGGER = 0.1;
const TIMELINE_LENGTH = FLIGHT_DURATION + (CELL_COUNT - 1) * FLIGHT_STAGGER;

/** Cubic inOut for the flight, sine inOut for the sway, evaluated per frame. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Per-word intro glow: the hue walks 180° + 15° per word. */
const GLOW_HUE_START = 180;
const GLOW_HUE_STEP = 15;
const GLOW_SHADOW = '0 0 8px hsl(var(--glow-h) 100% 60% / var(--glow-a))';

/** The clip track: two stills + three looping videos. */
const CELLS = [
  {
    type: 'img',
    src: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=600&h=600&fit=crop',
  },
  { type: 'video', src: 'https://assets.mixkit.co/videos/32645/32645-720.mp4' },
  { type: 'video', src: 'https://assets.mixkit.co/videos/3840/3840-720.mp4' },
  {
    type: 'img',
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=600&fit=crop',
  },
  { type: 'video', src: 'https://assets.mixkit.co/videos/4447/4447-720.mp4' },
];

const MEDIA_CLASS =
  'block size-full rounded-[24%] object-cover [transform-origin:top_left] will-change-transform';

export const ButterScroll = memo(function ButterScroll({ className = '' }: { className?: string }) {
  const splitRef = useRef<SplitTextRef>(null);
  const slotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);

  /** Slot↔cell offsets in layout space, captured by measure(). */
  const flightRef = useRef<{ x: number[]; y: number[]; scale: number[] }>({
    x: [],
    y: [],
    scale: [],
  });
  const lastProgressRef = useRef(0);
  /** Set at mount when the user prefers reduced motion; freezes the flight. */
  const reducedMotionRef = useRef(false);

  /** The ported timeline, reversed: one segment per clip, evaluated from
   *  progress. The measured offsets point from a clip's cell to its slot, so
   *  progress 0 holds the clip in the slot (translate + scaled down) and
   *  progress 1 lands it back on its cell (identity transform). */
  const applyFrame = useCallback((p: number) => {
    const flight = flightRef.current;
    const time = p * TIMELINE_LENGTH;

    for (let i = 0; i < CELL_COUNT; i++) {
      const media = mediaRefs.current[i];
      if (!media) continue;

      const start = i * FLIGHT_STAGGER;
      const t = clamp((time - start) / FLIGHT_DURATION, 0, 1);

      const eased = easeInOutCubic(t);
      const x = lerp(flight.x[i] ?? 0, 0, eased);
      const y = lerp(flight.y[i] ?? 0, 0, eased);
      const scale = lerp(flight.scale[i] ?? 1, 1, eased);

      // The ±12° sway: runs out to the tilt over the first half, back over
      // the second — both halves on the sine inOut curve.
      const tilt = i % 2 === 0 ? 12 : -12;
      const rotation = t <= 0.5 ? tilt * sineInOut(t * 2) : tilt * (1 - sineInOut((t - 0.5) * 2));

      media.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
    }
  }, []);

  const handleFrame = useCallback(
    (p: number) => {
      if (reducedMotionRef.current) return;
      lastProgressRef.current = p;
      applyFrame(p);
    },
    [applyFrame]
  );

  /** Capture each slot's offset from its cell, re-read whenever layout can
   *  move them. */
  const measure = useCallback(() => {
    const flight = flightRef.current;
    for (let i = 0; i < CELL_COUNT; i++) {
      const slot = slotsRef.current[i];
      const cell = cellsRef.current[i];
      if (!slot || !cell) continue;
      const s = slot.getBoundingClientRect();
      const c = cell.getBoundingClientRect();
      flight.x[i] = s.left - c.left;
      flight.y[i] = s.top - c.top;
      flight.scale[i] = cell.offsetWidth > 0 ? slot.offsetWidth / cell.offsetWidth : 1;
    }
  }, []);

  // SplitText splits in its own layout effect, which runs before this one —
  // so the words exist here before the first paint. Stamp each word's glow
  // hue + shadow, and hold the intro pose the two timelines animate from.
  useLayoutEffect(() => {
    const words = splitRef.current?.split?.words;
    if (words) {
      words.forEach((word, i) => {
        const el = word as HTMLElement;
        el.style.setProperty('--glow-h', String(GLOW_HUE_START + i * GLOW_HUE_STEP));
        el.style.setProperty('--glow-a', '1');
        el.style.textShadow = GLOW_SHADOW;
        el.style.opacity = '0';
        el.style.color = 'rgba(0, 0, 0, 0)';
      });
    }
    measure();
    applyFrame(0);
  }, [measure, applyFrame]);

  // Slots move when Inter Tight finishes loading or the viewport changes —
  // re-capture the offsets and re-pose the current frame.
  useEffect(() => {
    let cancelled = false;
    const reflow = () => {
      if (cancelled) return;
      measure();
      applyFrame(lastProgressRef.current);
    };
    document.fonts?.ready.then(reflow);
    window.addEventListener('resize', reflow);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', reflow);
    };
  }, [measure, applyFrame]);

  // Reduced motion: hold the assembled end pose — clips stay in their cells,
  // videos hold their first frame — instead of the scroll-driven flight and
  // sway. Read once at mount to match the library's own prefersReducedMotion()
  // semantics. The word intro is opacity/color only, so it runs either way.
  useLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    reducedMotionRef.current = true;
    for (const media of mediaRefs.current) {
      if (media instanceof HTMLVideoElement) media.pause();
    }
    applyFrame(1);
  }, [applyFrame]);

  return (
    <ScrollScene<HTMLDivElement>
      enter={{ target: 'top', container: 'bottom' }}
      leave={{ target: 'bottom', container: 'bottom' }}
      scrub={1}
      onFrame={handleFrame}
    >
      {({ targetRef }) => (
        <div
          className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg ${className}`}
        >
          {/* Inter Tight, scoped to this block. */}
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&display=swap');`}
          </style>

          <div
            style={{
              background: 'radial-gradient(circle at 50% 0%, #ffffff, #f1f0ec)',
              color: '#111',
              fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {/* ── Hero: the sentence with its five clip slots ────────────── */}
            <section className="grid min-h-screen place-items-center px-[5vw]">
              <AnimeTimeline autoplay defaults={{ duration: 600, ease: 'outQuad' }}>
                <SplitText ref={splitRef} params={{ words: true }}>
                  <h1 className="max-w-[16em] text-center text-[clamp(2rem,5vw,5rem)] leading-[1.1] font-medium tracking-[-0.04em] text-balance">
                    Reel{' '}
                    <span
                      ref={(el) => {
                        slotsRef.current[0] = el;
                      }}
                      aria-hidden
                      className="mx-[0.08em] inline-block h-[1.1em] w-[1.1em] align-middle"
                    />{' '}
                    is the video{' '}
                    <span
                      ref={(el) => {
                        slotsRef.current[1] = el;
                      }}
                      aria-hidden
                      className="mx-[0.08em] inline-block h-[1.1em] w-[1.1em] align-middle"
                    />{' '}
                    editor where creators{' '}
                    <span
                      ref={(el) => {
                        slotsRef.current[2] = el;
                      }}
                      aria-hidden
                      className="mx-[0.08em] inline-block h-[1.1em] w-[1.1em] align-middle"
                    />{' '}
                    cut, remix{' '}
                    <span
                      ref={(el) => {
                        slotsRef.current[3] = el;
                      }}
                      aria-hidden
                      className="mx-[0.08em] inline-block h-[1.1em] w-[1.1em] align-middle"
                    />{' '}
                    and animate ideas{' '}
                    <span
                      ref={(el) => {
                        slotsRef.current[4] = el;
                      }}
                      aria-hidden
                      className="mx-[0.08em] inline-block h-[1.1em] w-[1.1em] align-middle"
                    />{' '}
                    right on the timeline.
                  </h1>
                </SplitText>
                <SplitTextEntry
                  splitRef={splitRef}
                  splitMode="words"
                  opacity={[0, 1]}
                  stagger={60}
                />
              </AnimeTimeline>

              {/* Runs beside the fade above: fill colorizes while the glow
                  bleeds out — the second half of the intro. */}
              <AnimeTimeline autoplay defaults={{ duration: 1400, ease: 'inCubic' }}>
                <SplitTextEntry
                  splitRef={splitRef}
                  splitMode="words"
                  color={['rgba(0, 0, 0, 0)', '#111']}
                  {...{ '--glow-a': [1, 0] }}
                  stagger={60}
                />
              </AnimeTimeline>
            </section>

            {/* ── Editor: the dark timeline; the observed target ─────────── */}
            <section ref={targetRef} className="grid h-screen place-items-center px-[5vw]">
              <div
                className="w-full max-w-[1100px] rounded-[32px] bg-[#141414] p-5 text-sm text-[#8a8a8a]"
                style={{ boxShadow: '0 40px 80px -30px rgba(0, 0, 0, 0.5)' }}
              >
                {/* Toolbar */}
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className="grid size-10 place-items-center rounded-[10px] bg-[#2a2a2a]"
                  >
                    <span className="h-3 w-2.5 border-x-[3px] border-x-white" />
                  </div>
                  <div>
                    <b className="font-normal text-white">00:01.25</b> / 00:12
                  </div>
                  <div className="border-l border-[#333] pl-4">
                    Dur{' '}
                    <b className="rounded-lg bg-[#2a2a2a] px-2 py-1.5 font-normal text-white">5s</b>{' '}
                    sec
                  </div>
                </div>

                {/* Ruler */}
                <div
                  className="relative mt-5 mb-[22px] flex justify-between pt-1.5 pb-3.5 text-xs"
                  style={{
                    background:
                      'repeating-linear-gradient(to right, #3a3a3a 0 1px, transparent 1px 3.5714%) bottom / 100% 8px no-repeat',
                  }}
                >
                  <div className="absolute top-0 right-[54%] bottom-0 left-[8%] rounded-md border-x-2 border-y-0 border-[#555] bg-white/[0.08]" />
                  <span>0s</span>
                  <span>1s</span>
                  <span>2s</span>
                  <span>3s</span>
                  <span>4s</span>
                  <span>5s</span>
                  <span>6s</span>
                  <span>7s</span>
                </div>

                {/* Track */}
                <div className="grid grid-cols-5 gap-4">
                  {CELLS.map((cell, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        cellsRef.current[i] = el;
                      }}
                      className="aspect-square"
                    >
                      <Anime
                        ref={(el) => {
                          mediaRefs.current[i] = el as HTMLElement | null;
                        }}
                        autoplay
                        opacity={[0, 1]}
                        duration={600}
                        delay={i * 150}
                        ease="outQuad"
                      >
                        {cell.type === 'img' ? (
                          <img
                            src={cell.src}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className={MEDIA_CLASS}
                          />
                        ) : (
                          <video
                            src={cell.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-hidden
                            className={MEDIA_CLASS}
                          />
                        )}
                      </Anime>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Hint footer. */}
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
              scroll the page · five clips fly from the timeline into the sentence
            </span>
          </div>
        </div>
      )}
    </ScrollScene>
  );
});

export default ButterScroll;
