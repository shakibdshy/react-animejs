/**
 * HungryTigerLanding — a complete brand landing page rendered inside the
 * blocks gallery, ported from the reference Hungry Tiger scroll film: one
 * product pinned center-stage while display bands scrub past it, the jar
 * tumbling through each cut, settling for the ingredient line, then tipping
 * to pour into the WHAT'S INSIDE split panel.
 *
 * Structure is the gallery's nested-scroll idiom — a bounded
 * `min(74vh, 640px)` scroller with `overscroll-contain`, inside which a
 * `ScrollScene` observes a six-stage track holding a sticky stage. Progress
 * routes through `onFrame` only: per-frame writes straight to
 * `style.transform` / `style.opacity`, no React re-render (the same
 * data-table evaluation the other scrubbed blocks use). `scrub` is bare —
 * direct 1:1 like the film's scroll linkage; the jar has no lag to hide.
 *
 * Driven entirely by react-animejs:
 *   - `ScrollScene` + `scrub` drives the whole choreography from one progress
 *     value: hero lift-away, four display bands, the sauce pour, and the
 *     split panel rise
 *   - `SplitText` + `animate()` + `stagger()` cascade the hero headline in
 *     per character, replaying whenever the scene returns to its start
 *   - `<Anime>` keyframes arc the jar into the bag button from either
 *     `BUY NOW` (hero or mid-page)
 *   - `IntersectionObserver` rooted in the stage still reveals the email
 *     capture and footer, which scroll in normally after the scene ends
 *
 * Two deliberate departures from the gallery's own conventions:
 *   - The palette is scoped to this block via `--ht-*` custom properties so
 *     the site theme toggle cannot reach it. The split panel's pink is lifted
 *     from the reference film's WHAT'S INSIDE band and scoped here too.
 *   - Display type is scaled down (195px -> 120px) to fit the stage-height
 *     convention. Small UI sizes stay at 11-18px, where the brand spec's
 *     legibility floor lives.
 */
import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  animate,
  Anime,
  ScrollScene,
  SplitText,
  type SplitTextRef,
  stagger,
  utils,
} from '@shakibdshy/react-animejs';

const { clamp, lerp } = utils;

/* ------------------------------------------------------------------ *
 * Brand tokens
 *
 * Scoped to `.ht-root`. Deliberately not promoted to the site's global
 * token layer: this is one block's palette, not the gallery's.
 * ------------------------------------------------------------------ */
const PALETTE = {
  gold: '#faae33',
  rust: '#823513',
  saffron: '#9f531b',
  spice: '#402011',
  clove: '#281006',
  cardamom: '#6b2e12',
  chili: '#d1255c',
  /** The reference film's WHAT'S INSIDE panel — warm-leaning pink. */
  blossom: '#e0517f',
} as const;

const STAGE_HEIGHT = 'min(74vh, 640px)';
/** Six stage-heights of track → five stage-heights of scrub travel. */
const TRACK_HEIGHT = `calc(${STAGE_HEIGHT} * 6)`;

const HERO_TITLE = 'BOLD FLAVOR';
const HERO_EYEBROW = 'FIRE ROASTED INDIAN SAUCE';

/* ------------------------------------------------------------------ *
 * Choreography tables
 *
 * One progress value p ∈ [0, 1] across the track. Bands open and close on
 * windows; the jar pose interpolates between keys. All evaluation happens
 * per frame in `applyFrame`.
 * ------------------------------------------------------------------ */

/** Normalised window [a, b] → eased 0..1. */
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
/** Smoothstep — the scrub's default easing for band moves. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The jar's pose, one key per cut. `rz` accumulates monotonically so the
 * tumble never snaps back on reverse; `ry` stays a shallow wobble — a full
 * Y flip would pass edge-on and blink the flat SVG out of sight.
 */
type JarPose = { at: number; rz: number; ry: number; x: number; y: number; s: number };
const JAR_KEYS: JarPose[] = [
  { at: 0.0, rz: 0, ry: 0, x: 0, y: 85, s: 0.94 },
  { at: 0.14, rz: 0, ry: 6, x: 0, y: 85, s: 1.0 },
  { at: 0.3, rz: -360, ry: -10, x: 26, y: -12, s: 1.1 },
  { at: 0.46, rz: -720, ry: 12, x: -26, y: 4, s: 1.16 },
  { at: 0.62, rz: -810, ry: -8, x: -70, y: -16, s: 1.02 },
  { at: 0.78, rz: -1080, ry: 10, x: 50, y: 30, s: 1.08 },
  { at: 0.9, rz: -1230, ry: -6, x: -8, y: 85, s: 0.9 },
  { at: 1.0, rz: -1230, ry: -6, x: -8, y: 88, s: 0.9 },
];

function poseAt(p: number): JarPose {
  let i = 0;
  while (i < JAR_KEYS.length - 2 && p > JAR_KEYS[i + 1].at) i++;
  const a = JAR_KEYS[i];
  const b = JAR_KEYS[i + 1];
  const t = smooth(seg(p, a.at, b.at));
  return {
    at: p,
    rz: lerp(a.rz, b.rz, t),
    ry: lerp(a.ry, b.ry, t),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    s: lerp(a.s, b.s, t),
  };
}

/* ------------------------------------------------------------------ *
 * Presentational atoms
 * ------------------------------------------------------------------ */

/** Dotted gold rule. Replaces whitespace-only separation between bands. */
function DottedRule() {
  return (
    <div className="flex items-center gap-4 px-6 py-2 sm:px-10" aria-hidden="true">
      <span className="h-px flex-1" style={{ borderTop: `1px dotted ${PALETTE.gold}` }} />
      <span className="h-px flex-1" style={{ borderTop: `1px dotted ${PALETTE.gold}` }} />
    </div>
  );
}

/** Ghost outline pill — the block's default control. */
function GhostButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="ht-label rounded-full px-[17px] py-2 transition-colors duration-200 hover:bg-[rgba(250,174,51,0.14)]"
      style={{ border: `1px solid ${PALETTE.gold}`, color: PALETTE.gold }}
    >
      {children}
    </button>
  );
}

/** Filled pill — the only filled button in the system. */
function FilledButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ht-label rounded-full px-5 py-[10px] transition-opacity duration-200 hover:opacity-90"
      style={{ background: PALETTE.gold, border: `1px solid ${PALETTE.gold}`, color: PALETTE.clove }}
    >
      {children}
    </button>
  );
}

type Flavour = 'tomato' | 'char';

/**
 * The product. Inline vector art sitting directly on the canvas — the brand's
 * imagery rule is that the product is never framed, plated or cornered. The
 * gold rim along the left edge suggests a backlight.
 */
const Jar = memo(function Jar({
  flavour,
  className = '',
  style,
}: {
  flavour: Flavour;
  className?: string;
  style?: CSSProperties;
}) {
  const body = flavour === 'char' ? PALETTE.clove : PALETTE.spice;
  const lid = flavour === 'char' ? PALETTE.cardamom : PALETTE.saffron;

  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      style={style}
      role="img"
      aria-label={`Hungry Tiger ${flavour} sauce jar`}
    >
      {/* Lid */}
      <rect x="34" y="8" width="52" height="26" rx="7" fill={lid} />
      <rect x="30" y="30" width="60" height="10" rx="5" fill={PALETTE.saffron} />
      {/* Body */}
      <path d="M22 44h76v132a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14Z" fill={body} />
      {/* Label band */}
      <rect x="22" y="86" width="76" height="52" fill={PALETTE.rust} />
      <rect x="22" y="86" width="76" height="52" fill="none" stroke={PALETTE.cardamom} strokeWidth="1" />
      <text
        x="60"
        y="110"
        textAnchor="middle"
        fill={PALETTE.gold}
        style={{ font: '700 13px Bebas Neue, sans-serif', letterSpacing: '0.04em' }}
      >
        HUNGRY
      </text>
      <text
        x="60"
        y="126"
        textAnchor="middle"
        fill={PALETTE.gold}
        style={{ font: '700 13px Bebas Neue, sans-serif', letterSpacing: '0.04em' }}
      >
        TIGER
      </text>
      {/* Warm rim highlight — backlight, not elevation */}
      <path
        d="M30 46h6v126a8 8 0 0 1-6 8Z"
        fill={PALETTE.gold}
        opacity="0.5"
      />
    </svg>
  );
});

/**
 * Faded botanical watermark. Near-invisible at rest — it only reads once the
 * eye settles, giving the surface its tandoor-wall texture without competing
 * with the type.
 */
function BotanicalWatermark({ seed, style }: { seed: number; style: CSSProperties }) {
  const paths = [
    'M60 10c14 18 14 42 0 60-14-18-14-42 0-60Z',
    'M60 130c14 18 14 42 0 60-14-18-14-42 0-60Z',
    'M20 70c22-8 46-4 62 10-20 10-44 8-62-10Z',
    'M100 70c-22-8-46-4-62 10 20 10 44 8 62-10Z',
  ];

  return (
    <svg
      viewBox="0 0 120 200"
      className="pointer-events-none absolute"
      style={{ ...style, zIndex: 0, opacity: 0.07, transform: `rotate(${seed * 24 - 30}deg)` }}
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} fill={PALETTE.gold} />
      ))}
      <circle cx="60" cy="100" r="7" fill={PALETTE.gold} />
    </svg>
  );
}

/**
 * A single flying jar, animated along a three-keyframe arc.
 */
const FlyingJar = memo(function FlyingJar({
  from,
  to,
  lift,
  flavour,
  onArrive,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  lift: number;
  flavour: Flavour;
  onArrive: () => void;
}) {
  const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
  const duration = 750;

  return (
    <Anime
      autoplay
      duration={duration}
      ease="outQuad"
      onComplete={onArrive}
      translateX={[
        { to: from.x, duration: 0 },
        { to: mid.x, duration: duration * 0.5, ease: 'outQuad' },
        { to: to.x, duration: duration * 0.5, ease: 'inQuad' },
      ]}
      translateY={[
        { to: from.y, duration: 0 },
        { to: mid.y, duration: duration * 0.5, ease: 'outQuad' },
        { to: to.y, duration: duration * 0.5, ease: 'inQuad' },
      ]}
      scale={[
        { to: 1, duration: 0 },
        { to: 1.15, duration: duration * 0.5, ease: 'outQuad' },
        { to: 0.35, duration: duration * 0.5, ease: 'inQuad' },
      ]}
      opacity={[
        { to: 1, duration: 0 },
        { to: 1, duration: duration * 0.7 },
        { to: 0.9, duration: duration * 0.3 },
      ]}
    >
      <span
        className="pointer-events-none fixed top-0 left-0 z-50 block"
        style={{ transform: 'translate(0,0)' }}
      >
        <Jar flavour={flavour} style={{ width: 46, height: 77 }} />
      </span>
    </Anime>
  );
});

/** Ingredient chip — one of the three circular icons from the reference. */
function IngredientChip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-full"
      style={{ border: `1px solid ${PALETTE.gold}`, color: PALETTE.gold }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

/** Leaf veining laid over the veined headline — pure chrome, hidden from AT. */
function VeinOverlay() {
  return (
    <svg viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M14 2c10 16 10 34 0 52C4 36 4 18 14 2Z" fill={PALETTE.rust} />
      <path d="M52 4c10 16 10 34 0 52-10-16-10-34 0-52Z" fill={PALETTE.rust} />
      <path d="M92 2c10 16 10 34 0 52-10-16-10-34 0-52Z" fill={PALETTE.rust} />
      <path d="M0 30c22-8 44-5 60 8-18 8-42 6-60-8Z" fill={PALETTE.rust} />
      <path d="M120 26c-22-8-44-5-60 8 18 8 42 6 60-8Z" fill={PALETTE.rust} />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export const HungryTigerLanding = memo(function HungryTigerLanding({
  className = '',
}: {
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef<HTMLDivElement>(null);
  const unwrapRef = useRef<HTMLDivElement>(null);
  const crackRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const buyMidRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLButtonElement>(null);
  const heroSplitRef = useRef<SplitTextRef>(null);
  const heroReadyRef = useRef(false);
  const lastPRef = useRef(0);

  const [cartCount, setCartCount] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flyers, setFlyers] = useState<
    { id: number; from: { x: number; y: number }; to: { x: number; y: number }; lift: number }[]
  >([]);
  const flyerIdRef = useRef(0);

  /** Per-character cascade, replayed on demand (see `applyFrame`). */
  const playHeroEntrance = useCallback(() => {
    const chars = (heroSplitRef.current?.split?.chars as HTMLElement[]) ?? [];
    if (chars.length === 0) return;
    animate(chars, {
      opacity: [0, 1],
      translateY: ['0.45em', '0em'],
      duration: 720,
      delay: stagger(26),
      ease: 'outExpo',
    });
  }, []);

  const handleSplitReady = useCallback(() => {
    heroReadyRef.current = true;
    playHeroEntrance();
  }, [playHeroEntrance]);

  /**
   * The whole choreography, evaluated from one progress value. Every write
   * lands directly on `style` — no React state on this path (ADR-0002).
   */
  const applyFrame = useCallback(
    (p: number) => {
      // Hero lifts away like the reference's opening cut.
      const hero = heroLayerRef.current;
      if (hero) {
        const out = smooth(seg(p, 0.02, 0.14));
        hero.style.transform = `translate3d(0, ${-out * 62}%, 0)`;
        hero.style.opacity = `${1 - seg(p, 0.05, 0.14)}`;
        hero.style.pointerEvents = p < 0.05 ? 'auto' : 'none';
      }

      // Display bands: rise in, drift up and out. Inert unless visible.
      const bands: [HTMLDivElement | null, number, number, number, number][] = [
        // [el, in-start, in-end, out-start, out-end]
        [angleRef.current, 0.12, 0.2, 0.26, 0.32],
        [unwrapRef.current, 0.3, 0.38, 0.44, 0.5],
        [crackRef.current, 0.48, 0.56, 0.6, 0.66],
        [perspectiveRef.current, 0.62, 0.7, 0.74, 0.8],
      ];
      for (const [el, a, b, c, d] of bands) {
        if (!el) continue;
        const rise = smooth(seg(p, a, b));
        const fall = smooth(seg(p, c, d));
        const vis = Math.min(rise, 1 - fall);
        el.style.opacity = `${vis}`;
        el.style.transform = `translate3d(0, ${(1 - rise) * 70 - fall * 70}px, 0)`;
        el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
      }

      // The jar's tumble, one pose table.
      const jar = jarRef.current;
      if (jar) {
        const { rz, ry, x, y, s } = poseAt(p);
        jar.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rz}deg) rotateY(${ry}deg) scale(${s})`;
      }

      // The pour: jar tips, sauce streams, then the split panel rises over it.
      const stream = streamRef.current;
      if (stream) {
        const pour = smooth(seg(p, 0.78, 0.86));
        stream.style.transform = `scaleY(${pour})`;
        stream.style.opacity = `${seg(p, 0.77, 0.8)}`;
      }
      const inside = insideRef.current;
      if (inside) {
        const rise = smooth(seg(p, 0.86, 0.97));
        inside.style.transform = `translate3d(0, ${(1 - rise) * 105}%, 0)`;
      }

      // Replay the hero cascade when the scene returns to its start.
      if (heroReadyRef.current && lastPRef.current > 0.06 && p <= 0.02) {
        playHeroEntrance();
      }
      lastPRef.current = p;
    },
    [playHeroEntrance],
  );

  // Initial pose before the first scroll frame lands (SSR-safe).
  useLayoutEffect(() => {
    applyFrame(0);
  }, [applyFrame]);

  // Reveal the post-scene bands (email capture, footer) the first time they
  // enter the viewport. They scroll with the page below the stage, so the
  // observer roots at the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.band;
          if (key) setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 },
    );
    document.querySelectorAll('[data-band]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleBuy = useCallback((source: HTMLDivElement | null) => {
    const bag = bagRef.current;
    if (!source || !bag) return;

    const sourceRect = source.getBoundingClientRect();
    const bagRect = bag.getBoundingClientRect();
    const from = {
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
    };
    const to = { x: bagRect.left + bagRect.width / 2, y: bagRect.top + bagRect.height / 2 };

    setFlyers((current) => [
      ...current,
      { id: ++flyerIdRef.current, from, to, lift: 140 + Math.abs(to.x - from.x) * 0.35 },
    ]);
  }, []);

  const handleArrive = useCallback((id: number) => {
    setFlyers((current) => current.filter((f) => f.id !== id));
    setCartCount((c) => c + 1);
    setPulseKey((k) => k + 1);
  }, []);

  return (
    <div
      className={`ht-root relative overflow-hidden rounded-2xl border border-landing-border/60 ${className}`}
      style={{ background: PALETTE.rust }}
    >
      {/* Fonts and type scale, scoped to this block only. */}
      <style>{`
        /* @import must precede every other rule or the browser discards it. */
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;700&display=swap');

        .ht-root {
          --ht-gold: ${PALETTE.gold};
          --ht-rust: ${PALETTE.rust};
          --ht-spice: ${PALETTE.spice};
          --ht-clove: ${PALETTE.clove};
          --ht-cardamom: ${PALETTE.cardamom};
          --ht-display: clamp(3rem, 8.4vw, 120px);
          --ht-heading-lg: clamp(1.9rem, 4.4vw, 62px);
          --ht-heading: clamp(1.3rem, 2.8vw, 40px);
          --ht-heading-sm: clamp(1.05rem, 1.7vw, 22px);
          --ht-subheading: 18px;
          --ht-label-size: 13px;
          --ht-caption-size: 11px;
          color: var(--ht-gold);
          background: var(--ht-rust);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        /* One shared display face; each size overrides only the three
           metrics the brand couples to type size. */
        .ht-type {
          font-family: 'Bebas Neue', 'Inter', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          color: var(--ht-gold);
        }

        .ht-display {
          font-size: var(--ht-display);
          line-height: 0.8;
          letter-spacing: -0.017em;
        }

        .ht-heading-lg {
          font-size: var(--ht-heading-lg);
          line-height: 0.9;
          letter-spacing: -0.014em;
        }

        .ht-heading {
          font-size: var(--ht-heading);
          line-height: 0.95;
          letter-spacing: -0.01em;
        }

        .ht-heading-sm {
          font-size: var(--ht-heading-sm);
          line-height: 1.1;
          letter-spacing: -0.005em;
        }

        .ht-label {
          font-size: var(--ht-label-size);
          line-height: 1.2;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
        }

        .ht-caption {
          font-size: var(--ht-caption-size);
          line-height: 1.2;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .ht-sub {
          font-size: var(--ht-subheading);
          line-height: 1.2;
          letter-spacing: 0.01em;
          font-weight: 500;
        }

        .ht-eyebrow {
          font-size: var(--ht-label-size);
          line-height: 1.2;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--ht-gold);
        }

        /* The reference's UNWRAP THE ADVENTURE headline carries a leaf-veined
           fill. background-clip:text proved fragile inside the embedded
           style tag, so the veining is a watermark layered over solid type. */
        .ht-veined {
          position: relative;
        }
        .ht-veined > svg {
          position: absolute;
          inset: -8% -4%;
          width: 108%;
          height: 116%;
          opacity: 0.32;
        }

        /* Scrubbed bands are inert chrome — only their live buttons accept
           pointers, toggled per frame. */
        [data-ht-band] {
          pointer-events: none;
        }

        /* The stage's scrollbar, dressed for the brand: a slim gold thumb on
           a transparent track. The browser default is a white 17px strip
           that breaks the poster's full-bleed canvas. */
        .ht-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(250, 174, 51, 0.4) transparent;
        }
        .ht-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .ht-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .ht-scroll::-webkit-scrollbar-thumb {
          background: rgba(250, 174, 51, 0.35);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .ht-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 174, 51, 0.6);
          background-clip: padding-box;
        }

        /* Focus is a border-colour shift only — the brand has no focus ring. */
        .ht-input {
          border: 1px solid var(--ht-cardamom);
          transition: border-color 200ms ease-out;
        }
        .ht-input:focus {
          border-color: var(--ht-gold);
        }

        /* Reveal the post-scene bands on scroll — colour shift only. */
        .ht-band [data-reveal] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 620ms ease-out, transform 620ms ease-out;
        }
        .ht-band[data-revealed='true'] [data-reveal] {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* The scene owns the scroll box: container = the scroller, target =
          the six-stage track, sticky stage pinned within it. */}
      <ScrollScene<HTMLDivElement, HTMLDivElement>
        enter={{ target: 'top', container: 'top' }}
        leave={{ target: 'bottom', container: 'bottom' }}
        scrub
        onFrame={applyFrame}
      >
        {({ targetRef, containerRef }) => (
          <div
            ref={(el) => {
              scrollerRef.current = el;
              containerRef.current = el;
            }}
            tabIndex={0}
            role="region"
            aria-label="Hungry Tiger brand landing page"
            className="ht-scroll relative w-full overflow-y-auto overscroll-contain"
            style={{ height: STAGE_HEIGHT }}
          >
            {/* Six stage-heights of track → five of scrub travel. */}
            <div ref={targetRef} className="relative w-full" style={{ height: TRACK_HEIGHT }}>
              {/* Sticky stage — the reference's pinned shot. */}
              <div className="sticky top-0 w-full overflow-hidden" style={{ height: STAGE_HEIGHT }}>
                {/* Hero — nav, eyebrow, display line, first BUY NOW. Lifts
                    away on scrub like the reference's opening cut. */}
                <div
                  ref={heroLayerRef}
                  data-ht-band="hero"
                  className="absolute inset-0 z-10 flex flex-col"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <nav className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
                    <span className="ht-type ht-heading-sm">HUNGRY TIGER</span>
                    <div className="flex items-center gap-2">
                      <GhostButton>SAUCE</GhostButton>
                      <GhostButton>RECIPES</GhostButton>
                      <GhostButton>ABOUT</GhostButton>
                    </div>
                  </nav>
                  <div className="relative flex flex-1 flex-col items-center px-6 text-center">
                    <BotanicalWatermark seed={1} style={{ width: 190, height: 316, left: -40, top: -30 }} />
                    <span className="ht-eyebrow relative">{HERO_EYEBROW}</span>
                    <SplitText ref={heroSplitRef} params={{ chars: true }} onReady={handleSplitReady}>
                      <h2 className="ht-type ht-display relative mt-2 mb-0">{HERO_TITLE}</h2>
                    </SplitText>
                    <p
                      className="ht-sub relative mt-3 max-w-md"
                      style={{ color: PALETTE.gold, opacity: 0.82 }}
                    >
                      FIRE-ROASTED INDIAN SAUCE, GROUNDED IN CHAR AND SPICE
                    </p>
                    <div className="relative mt-5" ref={buyRef}>
                      <FilledButton onClick={() => handleBuy(buyRef.current)}>BUY NOW</FilledButton>
                    </div>
                  </div>
                  <DottedRule />
                </div>

                {/* A NEW ANGLE OF FLAVOR */}
                <div
                  ref={angleRef}
                  data-ht-band="angle"
                  className="absolute inset-0 z-[2] flex flex-col justify-center px-8 sm:px-14"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <h3 className="ht-type ht-display leading-[0.82]">
                    A NEW
                    <br />
                    ANGLE
                  </h3>
                  <p className="ht-caption mt-5 max-w-[240px]" style={{ opacity: 0.8 }}>
                    DISCOVER HOW OUR CREAMY TOMATO BLEND AND AUTHENTIC SPICES ELEVATE EVERY MEAL
                  </p>
                </div>

                {/* UNWRAP THE ADVENTURE — veined type */}
                <div
                  ref={unwrapRef}
                  data-ht-band="unwrap"
                  className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <h3 className="ht-type ht-heading-lg ht-veined leading-[0.9]">
                    <VeinOverlay />
                    UNWRAP THE
                    <br />
                    ADVENTURE
                  </h3>
                </div>

                {/* Ingredient moment */}
                <div
                  ref={crackRef}
                  data-ht-band="crack"
                  className="absolute inset-0 z-[2] flex flex-col items-center justify-end px-6 pb-[7%] text-center"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <div className="flex items-center gap-3">
                    <IngredientChip label="Garlic">
                      <path d="M12 4c2 3 5 5 5 9a5 5 0 0 1-10 0c0-4 3-6 5-9Z" />
                      <path d="M12 4v4" />
                    </IngredientChip>
                    <IngredientChip label="Signature masala">
                      <circle cx="8.5" cy="9" r="2.2" />
                      <circle cx="15.5" cy="9" r="2.2" />
                      <circle cx="12" cy="15.5" r="2.2" />
                    </IngredientChip>
                    <IngredientChip label="Tandoor pot">
                      <path d="M5 11h14a7 7 0 0 1-14 0Z" />
                      <path d="M9 8V6M12 8V5M15 8V6" />
                    </IngredientChip>
                  </div>
                  <p className="ht-caption mt-4 max-w-[300px]" style={{ opacity: 0.85 }}>
                    CRACK OPEN THE JAR AND YOU&apos;RE HIT WITH THE BOLD SCENT OF FENUGREEK, GARLIC,
                    AND OUR SIGNATURE MASALA BLEND
                  </p>
                </div>

                {/* A NEW PERSPECTIVE ON TASTE + mid-page BUY NOW */}
                <div
                  ref={perspectiveRef}
                  data-ht-band="perspective"
                  className="absolute inset-0 z-[2] flex flex-col"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <div className="flex flex-1 items-center justify-end px-8 sm:px-16">
                    <div className="max-w-[220px] text-right">
                      <p className="ht-caption" style={{ opacity: 0.85 }}>
                        BOLD FLAVORS, SMOOTH TEXTURES, AND A TIMELESS TASTE OF INDIAN TRADITION —
                        ALL IN ONE JAR.
                      </p>
                      <div className="mt-4 flex justify-end" ref={buyMidRef}>
                        <FilledButton onClick={() => handleBuy(buyMidRef.current)}>
                          BUY NOW
                        </FilledButton>
                      </div>
                    </div>
                  </div>
                  <h3 className="ht-type ht-heading-lg px-8 pb-6 leading-[0.85] sm:px-14">
                    A NEW
                    <br />
                    PERSPECTIVE
                  </h3>
                </div>

                {/* The pour — sauce falls from the tipped jar's mouth. */}
                <div
                  ref={streamRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute z-[6] w-[13px]"
                  style={{
                    left: 'calc(50% - 55px)',
                    top: 'calc(50% + 138px)',
                    height: 122,
                    transformOrigin: 'top center',
                    transform: 'scaleY(0)',
                    background: `linear-gradient(180deg, ${PALETTE.gold}, #d96c1f)`,
                    borderRadius: '0 0 10px 10px',
                    willChange: 'transform, opacity',
                  }}
                />

                {/* The jar — pinned center stage, above every band. */}
                <div
                  ref={jarRef}
                  className="absolute top-1/2 left-1/2 z-[8]"
                  style={{ willChange: 'transform' }}
                >
                  <Jar flavour="tomato" style={{ width: 118, height: 197 }} />
                </div>

                {/* WHAT'S INSIDE — the reference's split panel rises last. */}
                <div
                  ref={insideRef}
                  data-ht-band="inside"
                  className="absolute inset-x-0 bottom-0 z-20 flex h-[58%]"
                  style={{ transform: 'translate3d(0, 105%, 0)', willChange: 'transform' }}
                >
                  <div
                    className="relative flex flex-1 flex-col justify-center gap-3 px-7 sm:px-10"
                    style={{ background: PALETTE.clove }}
                  >
                    <h3 className="ht-type ht-heading-lg leading-[0.85]">
                      WHAT&apos;S
                      <br />
                      INSIDE
                    </h3>
                    <div className="[&>div]:!px-0">
                      <DottedRule />
                    </div>
                    <p className="ht-caption max-w-[260px]" style={{ opacity: 0.85 }}>
                      OUR TIKKA MASALA SAUCE IS MADE WITH REAL INGREDIENTS FOR REAL FLAVOR.
                    </p>
                  </div>
                  <div
                    className="relative hidden w-[42%] items-end justify-center sm:flex"
                    style={{ background: PALETTE.blossom }}
                  >
                    <BotanicalWatermark seed={3} style={{ width: 170, height: 284, right: -20, top: -20 }} />
                    <Jar flavour="tomato" style={{ width: 96, height: 160, marginBottom: '-12px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollScene>

      {/* Email capture — page flow below the stage. The scene's container
          holds only the track, so its scroll range ends exactly at the
          scene's leave point and the observer never overshoots it. */}
        <section
          data-band="capture"
          data-revealed={revealed.capture === true}
          className="ht-band relative flex flex-col items-center px-6 py-14 text-center"
        >
          <BotanicalWatermark seed={5} style={{ width: 170, height: 284, right: -30, bottom: -40 }} />
          <h3 className="ht-type ht-heading relative" data-reveal>
            NEVER MISS A DROP
          </h3>
          <div className="relative" data-reveal>
            <p className="ht-sub mt-3 max-w-sm" style={{ opacity: 0.8 }}>
              NEW BATCHES, LIMITED DROPS AND RECIPES — STRAIGHT TO YOUR INBOX
            </p>
          </div>
          <form
            className="relative mt-6 flex w-full max-w-sm items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
            data-reveal
          >
            <input
              type="email"
              aria-label="Email address"
              placeholder="EMAIL ADDRESS"
              className="ht-label ht-input min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 outline-none placeholder:text-current"
              style={{ color: PALETTE.gold }}
            />
            <FilledButton>JOIN</FilledButton>
          </form>
        </section>

        {/* Footer */}
        <DottedRule />
        <footer className="flex flex-col items-center gap-4 px-6 py-8">
          <span className="ht-type ht-heading-sm">HUNGRY TIGER</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GhostButton>CONTACT</GhostButton>
            <GhostButton>GAME</GhostButton>
            <GhostButton>SOCIAL</GhostButton>
          </div>
          <span className="ht-caption" style={{ opacity: 0.6 }}>
            © FIRE ROASTED, SMALL BATCH
          </span>
        </footer>

      {/* Floating bag — docked outside the scroller so it never scrolls away. */}
      <div className="pointer-events-none absolute right-5 bottom-5 z-30 flex flex-col items-center gap-1.5">
        <span
          className="ht-caption"
          style={{ color: PALETTE.gold, opacity: 0.8 }}
          aria-live="polite"
        >
          BAG · {cartCount}
        </span>
        <button
          ref={bagRef}
          type="button"
          aria-label={`Shopping bag, ${cartCount} items`}
          className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full"
          style={{ border: `1px solid ${PALETTE.gold}`, background: PALETTE.clove }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke={PALETTE.gold}
            strokeWidth="1.5"
            aria-label="Shopping bag"
            role="img"
          >
            <path d="M5 8h14l-1.2 12H6.2Z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {/* Impact pulse — a ring, not a glow; the system forbids effects. */}
          <Anime
            key={pulseKey}
            autoplay
            duration={420}
            ease="outExpo"
            scale={[{ to: 1, duration: 0 }, { to: 1.25, duration: 220 }, { to: 1, duration: 200 }]}
            opacity={[{ to: 0, duration: 0 }, { to: 0.9, duration: 120 }, { to: 0, duration: 300 }]}
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#faae33]"
          >
            <span className="block h-full w-full" />
          </Anime>
        </button>
      </div>

      {/* Flying jars, fixed to the viewport above everything. */}
      {flyers.map((f) => (
        <FlyingJar
          key={f.id}
          from={f.from}
          to={f.to}
          lift={f.lift}
          flavour="tomato"
          onArrive={() => handleArrive(f.id)}
        />
      ))}

      {/* Hint bar — matches the other blocks' footer convention. */}
      <div className="flex items-center justify-between gap-3 border-t border-landing-border/40 px-5 py-3">
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-landing-muted/60">
          scroll the stage · the jar tumbles, settles, and pours
        </span>
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-landing-muted/60">
          SplitText + ScrollScene + &lt;Anime&gt;
        </span>
      </div>
    </div>
  );
});

export default HungryTigerLanding;
