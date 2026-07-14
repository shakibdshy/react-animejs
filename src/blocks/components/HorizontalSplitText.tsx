/**
 * HorizontalSplitText — a port of GSAP's "ContainerAnimation SplitText" demo.
 *
 * A pinned, self-contained scroll box drives a long line of split text
 * horizontally as you scroll vertically (scrubbed via `useAnimeOnScroll`).
 * Each character settles in with a random vertical offset + rotation — GSAP's
 * `containerAnimation` trick, where a char's reveal is tied to its *horizontal*
 * screen position rather than the page scroll. We replicate the nested scroll
 * by computing every char's screen-X from the single scroll progress and easing
 * it to rest with a `back.out` curve (anime.js `utils` + `SplitText`).
 */
import { memo, useCallback, useEffect, useRef } from 'react';
import { SplitText, useAnimeOnScroll, utils } from '@/lib/react-animejs';
import { SplitTextRef } from '@/lib/react-animejs/components';

const { clamp, random } = utils;

/** The displayed line. Kept on one row; the box scrolls it horizontally. */
const TEXT =
  'The containerAnimation property lets us create ScrollTriggered animations inside a horizontally scrolling container — nested scroll, where every character settles in based on its position on screen.';

/** Scroll distance of the inner track relative to the visible stage. */
const TRACK_HEIGHT = '420%';

/** back.out(n) — overshoots past 1 then eases back, matching GSAP's
 *  `ease: "back.out(1.2)"` on the per-char reveal. */
function backOut(t: number, s = 1.2): number {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
}

export const HorizontalSplitText = memo(function HorizontalSplitText({
  className = '',
}: {
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitTextRef>(null);

  // Per-char baseline screen-X (relative to the stage) captured at translate 0,
  // plus a stable random (y, rotation) assigned once per char.
  const baselineXRef = useRef<number[]>([]);
  const randomsRef = useRef<{ y: number; r: number }[]>([]);
  const charsRef = useRef<HTMLElement[]>([]);

  // Master scrub: the tall track travels through the box; progress 0→1 drives
  // the horizontal translate. Scoped to the box so the page scroll is untouched.
  const { ref: trackRef, state } = useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
    container: boxRef,
    enter: { target: 'top', container: 'top' },
    leave: { target: 'bottom', container: 'bottom' },
    onUpdate: (observer) => applyFrame(observer.progress ?? 0),
  });

  const handleReady = useCallback(() => {
    const split = splitRef.current?.split;
    const stage = stageRef.current;
    if (!split || !stage) return;

    const chars = (split.chars as HTMLElement[]) ?? [];
    charsRef.current = chars;

    // Assign a stable random offset to each char (GSAP's "random(-200,200)" /
    // "random(-20,20)" mapped into px + degrees).
    randomsRef.current = chars.map(() => ({
      y: random(-160, 160),
      r: random(-22, 22),
    }));

    const stageRect = stage.getBoundingClientRect();
    // Capture each char's screen-X at rest (translate 0) so subsequent frames
    // only add the live horizontal translate. Robust to SplitText's nesting.
    baselineXRef.current = chars.map((c) => {
      const cr = c.getBoundingClientRect();
      return cr.left - stageRect.left;
    });

    applyFrame(0);
  }, []);

  // Recompute baselines on resize so the math stays correct after layout shifts.
  useEffect(() => {
    const onResize = () => handleReady();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [handleReady]);

  // One frame: translate the text horizontally by `progress`, then settle each
  // char based on where it currently sits across the stage (nested-scroll feel).
  const applyFrame = useCallback((p: number) => {
    const text = splitRef.current?.$target;
    const stage = stageRef.current;
    const chars = charsRef.current;
    if (!text || !stage || chars.length === 0) return;

    const stageW = stage.clientWidth;
    const maxX = Math.max(0, text.scrollWidth - stageW);
    const x = -p * maxX; // progress 0 → no translate, 1 → fully crossed
    text.style.transform = `translateX(${x}px)`;

    const vw = stageW;
    const band = vw * 0.7; // reveal band: right edge (100%) → 30% from left

    for (let i = 0; i < chars.length; i++) {
      const charX = baselineXRef.current[i] + x;
      // t = 0 when the char's left hits the right edge, 1 when it reaches 30%.
      const t = clamp((vw - charX) / band, 0, 1);
      const factor = 1 - backOut(t); // 1 at start (offset) → 0 when settled
      const { y, r } = randomsRef.current[i];
      chars[i].style.transform = `translateY(${factor * y}px) rotate(${factor * r}deg)`;
    }
  }, []);

  const p = clamp(state.progress, 0, 1);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      {/* Scroll box — the self-contained scroller (like ScrubbedBentoGallery). */}
      <div
        ref={boxRef}
        className="relative w-full overflow-y-auto"
        style={{ height: 'min(78vh, 620px)' }}
      >
        {/* Tall track: the observed target that travels through the box. */}
        <div ref={trackRef} style={{ height: TRACK_HEIGHT }} className="relative">
          {/* Sticky stage pins the text on screen for the whole horizontal scrub. */}
          <div
            ref={stageRef}
            className="sticky top-0 flex w-full items-center overflow-hidden bg-landing-surface"
            style={{ height: 'min(78vh, 620px)' }}
          >
            <SplitText ref={splitRef} params={{ chars: true, words: true }} onReady={handleReady}>
              <h3
                className="heading-xl m-0 whitespace-nowrap font-semibold leading-[1.1] text-landing-fg"
                style={{
                  display: 'flex',
                  width: 'max-content',
                  gap: '4vw',
                  paddingLeft: '100vw',
                  fontSize: 'clamp(2rem, 10vw, 12rem)',
                  willChange: 'transform',
                }}
              >
                {TEXT}
              </h3>
            </SplitText>

            {/* Overlay copy that fades as the scrub takes over. */}
            <div className="pointer-events-none absolute inset-x-0 top-5 text-center">
              <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
                Horizontal · SplitText scrub
              </p>
              <h3 className="landing-font-display mt-2 text-base font-bold text-landing-fg drop-shadow">
                Scroll the box · text drifts sideways
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Progress + hint footer, outside the scroll box. */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · chars settle as they cross
        </span>
        <div className="flex items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-landing-border/50">
            <div
              className="h-full rounded-full bg-landing-accent"
              style={{ width: `${Math.round(p * 100)}%`, transition: 'width 60ms linear' }}
            />
          </div>
          <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70 tabular-nums">
            {Math.round(p * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
});

export default HorizontalSplitText;
