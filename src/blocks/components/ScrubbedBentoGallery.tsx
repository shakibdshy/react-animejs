/**
 * ScrubbedBentoGallery — a port of GSAP's "Scrubbed Bento Gallery".
 *
 * The whole sequence lives inside one self-contained scroll box, in a single
 * continuous motion (no duplicate elements, no handoff hiccup):
 *
 *  1. ZOOM (pinned): a 3×3 bento grid fills the box; as you scroll, the grid's
 *     track sizes interpolate from compact (33%) to huge (100%). Because the
 *     grid stays centered inside the fullscreen stage (`overflow: hidden`),
 *     only the CENTER cell stays visible and zooms to fill the box — every
 *     other cell scatters off-canvas. The stage is `sticky`, so it pins for
 *     the whole zoom. This is the exact GSAP mechanic: animate only the grid
 *     tracks; centering + clipping does the rest.
 *
 *  2. REVEAL (natural): once the zoom track scrolls past, the sticky pin
 *     releases and the SAME fullscreen stage (now showing only the hero) slides
 *     up *naturally* with the scroll — exactly like a normal page — revealing
 *     the content section underneath. One element, one continuous scroll.
 *
 * Self-contained: the scroll happens inside the box (scoped via the
 * `container` option), so it never hijacks the Blocks page scroll. Per-tick
 * progress arrives through the observer's `onFrame` channel and is written
 * straight to the DOM (grid tracks, fades, chrome) — reactive `state` only
 * moves on transitions, so a 60fps zoom must not read it.
 */
import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { useAnimeOnScroll, utils } from '@shakibdshy/react-animejs';

const { lerp, clamp } = utils;

/** Bento track sizes (the "initial" gallery). 3 cols × 3 rows fit the box.
 *  Units are % of the stage so the zoom clips to the container, not the page. */
const BENTO_COL = 33; // %
const BENTO_ROW = 33; // %

/** Final track sizes. 3×100% × 3×100% = 3× the stage. Centered inside an
 *  `overflow: hidden` stage, only the CENTER cell stays visible and fills it. */
const FINAL_COL = 100; // %
const FINAL_ROW = 100; // %

/** The zoom completes by this point of observer progress; the remainder holds
 *  the fullscreen hero so it breathes before the pin releases. */
const ZOOM_END = 0.82;

/** The 9 grid cells (3 cols × 3 rows). The CENTER cell — index 4 (row 1,
 *  col 1) — is the hero that zooms to fill the stage. Real photography via
 *  Lorem Picsum with fixed seeds, so each tile is a distinct stable image. */
const HERO = 4; // the cell that becomes the zoom target
const img = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const HERO_SEED = 'bento-aurora';
// Bento variety: alternate landscape (3:2) and portrait (2:3) sources so the
// gallery reads as a mix of orientations, not a wall of identical squares.
// The hero is a wide 16:9 landscape — that's the one that zooms to full width.
const LAND_W = 800;
const LAND_H = 560;
const PORT_W = 560;
const PORT_H = 800;
type Cell = { src: string; label: string; orient: 'land' | 'port' | 'hero' };
const CELLS: Cell[] = [
  { src: img('bento-river', LAND_W, LAND_H), label: '01', orient: 'land' },
  { src: img('bento-peaks', PORT_W, PORT_H), label: '02', orient: 'port' },
  { src: img('bento-forest', LAND_W, LAND_H), label: '03', orient: 'land' },
  { src: img('bento-dunes', PORT_W, PORT_H), label: '04', orient: 'port' },
  { src: img(HERO_SEED, 1600, 900), label: 'Hero', orient: 'hero' }, // index 4 — full-width zoom target
  { src: img('bento-coast', LAND_W, LAND_H), label: '06', orient: 'land' },
  { src: img('bento-canyon', PORT_W, PORT_H), label: '07', orient: 'port' },
  { src: img('bento-meadow', LAND_W, LAND_H), label: '08', orient: 'land' },
  { src: img('bento-glacier', PORT_W, PORT_H), label: '09', orient: 'port' },
];

export const ScrubbedBentoGallery = memo(function ScrubbedBentoGallery({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  /** One scrub frame: grid tracks + fades + chrome, written straight to the
   *  DOM. The non-hero cells read their opacity from the `--bento-fade` var
   *  on the grid, so one custom-property write fades all eight. */
  const applyFrame = useCallback((p: number) => {
    const grid = gridRef.current;
    if (!grid) return;

    const zoom = clamp(p / ZOOM_END, 0, 1);
    grid.style.width = `${lerp(BENTO_COL, FINAL_COL, zoom) * 3}%`;
    grid.style.height = `${lerp(BENTO_ROW, FINAL_ROW, zoom) * 3}%`;
    grid.style.setProperty('--bento-fade', String(lerp(1, 0, clamp(zoom * 1.6, 0, 1))));

    if (headingRef.current) {
      headingRef.current.style.opacity = String(lerp(1, 0, clamp(p * 2.5, 0, 1)));
    }
    if (barRef.current) barRef.current.style.width = `${Math.round(p * 100)}%`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
  }, []);

  // Initial compact-grid pose before the first scroll frame lands (SSR-safe).
  useLayoutEffect(() => {
    applyFrame(0);
  }, [applyFrame]);

  // One observer drives the zoom. `container` scopes the scroll to the box;
  // the tall zoom track is the target (it travels through the container, so
  // progress actually moves). enter/leave use the object form so the active
  // band spans the track's full travel: 0 at scroll start, 1 at scroll end.
  const { ref: zoomTrackRef } = useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
    container: containerRef,
    enter: { target: 'top', container: 'top' },
    leave: { target: 'bottom', container: 'bottom' },
    onFrame: applyFrame,
  });

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      {/* ── Scroll container ──────────────────────────────────────────
          The box you scroll inside. Everything (zoom + reveal) is scoped here
          so the Blocks page scroll is untouched. */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Scrubbed bento gallery"
        className="relative w-full overflow-y-auto"
        style={{ height: 'min(72vh, 640px)' }}
      >
        {/* ════════════════════════════════════════════════════════════
            PHASE 1 — ZOOM (pinned). The tall track is the observed target;
            the sticky fullscreen stage inside it pins the zoom on screen for
            the whole scroll. When the track's bottom passes the stage's
            bottom, the pin releases and the stage scrolls up naturally into
            the content section below. ONE element, continuous motion.
            ════════════════════════════════════════════════════════════ */}
        <div ref={zoomTrackRef} style={{ height: '260%' }} className="relative">
          <div
            className="sticky top-0 w-full overflow-hidden bg-landing-surface"
            style={{ height: 'min(72vh, 640px)' }}
          >
            {/* The gallery is sized to its TOTAL track footprint (colSize×3) and
                centered, so as tracks grow the grid overflows SYMMETRICALLY —
                only the center cell stays on-screen. (Using % tracks on a
                fixed-size container would overflow asymmetrically to the
                bottom-right, leaving the hero stranded in a corner.)
                flexShrink: 0 is load-bearing: the centered-overflow zoom needs
                the grid to actually exceed the flex container (default
                flex-shrink clamps it back to 100%, flattening the zoom). */}
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <div
                ref={gridRef}
                className="grid"
                style={{
                  flexShrink: 0,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  width: `${BENTO_COL * 3}%`,
                  height: `${BENTO_ROW * 3}%`,
                  gap: 0,
                }}
              >
                {CELLS.map((cell, i) => {
                  const isHero = i === HERO;
                  return (
                    <div
                      key={i}
                      className="relative flex items-center justify-center overflow-hidden bg-landing-surface"
                      style={{ opacity: isHero ? 1 : 'var(--bento-fade, 1)' }}
                    >
                      <img
                        src={cell.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                      {!isHero && (
                        <span className="landing-font-mono absolute bottom-1.5 left-2 text-[9px] tracking-[0.2em] uppercase text-white/80 drop-shadow">
                          {cell.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heading overlay — fades out early so the zoomed hero reads clean. */}
            <div
              ref={headingRef}
              className="pointer-events-none absolute inset-x-0 top-5 text-center"
              style={{ opacity: 1 }}
            >
              <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
                Scrubbed · Grid-track zoom
              </p>
              <h3 className="landing-font-display mt-2 text-base font-bold text-landing-fg drop-shadow">
                Keep scrolling · one image takes over
              </h3>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            PHASE 2 — REVEAL (natural). The zoom track has scrolled past, so
            the sticky pin released and the fullscreen hero above slid up with
            the scroll. This content section is the "next section or text" that
            flows in underneath — plain document flow, no animation needed.
            ════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-3xl px-8 py-16">
          <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
            The reveal
          </p>
          <h2 className="landing-font-display mt-3 text-3xl font-bold tracking-tight text-landing-fg md:text-4xl">
            One image, full focus.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-landing-muted">
            The bento collapsed into a single fullscreen frame as you scrolled, the hero held for a
            beat, then slid up to reveal this section — a pinned scrub sequence built entirely with{' '}
            <code className="landing-font-mono text-landing-accent">useAnimeOnScroll</code>: its{' '}
            <code className="landing-font-mono text-landing-accent">onFrame</code> channel drives the
            grid-track interpolation through{' '}
            <code className="landing-font-mono text-landing-accent">utils.lerp</code> with zero React
            re-renders per frame. No FLIP plugin, no manual requestAnimationFrame loop.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { k: 'useAnimeOnScroll', v: 'One observer scrubs the whole zoom, scoped to a container.' },
              { k: 'onFrame + utils.lerp', v: 'Per-frame track interpolation 33% → 100%, no re-renders.' },
              { k: 'sticky + clip', v: 'Centering + overflow turns track growth into a zoom-to-fill.' },
            ].map((f) => (
              <div
                key={f.k}
                className="rounded-xl border border-landing-border/60 bg-landing-surface/50 p-5"
              >
                <div className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-accent">
                  {f.k}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-landing-muted">{f.v}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Progress + hint footer, outside the scroll box. */}
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          scroll inside the box · bento zooms, hero holds, then reveals
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

export default ScrubbedBentoGallery;
