/**
 * HungryTigerLanding — a complete brand landing page rendered inside the
 * blocks gallery, and a study in applying one primitive's choreography to an
 * entire page rather than a single effect.
 *
 * The page is a full-viewport poster in miniature: oversized condensed display
 * type on a rust canvas, pill-shaped controls, dotted rules between bands, and
 * the product sitting raw on the canvas with no frame. Structure follows the
 * other nested-scroll blocks — a bounded `min(74vh, 640px)` scroller with
 * `overscroll-contain` — so it reads as a sibling of the existing set.
 *
 * Driven entirely by react-animejs:
 *   - `SplitText` + `animate()` + `stagger()` cascade the hero headline in per
 *     character, and replay whenever the stage scrolls back to the top
 *   - `IntersectionObserver` rooted in the stage reveals each band on scroll
 *   - `<Anime>` keyframes arc the jar into the bag button on `BUY NOW`
 *
 * Two deliberate departures from the gallery's own conventions:
 *   - The palette is scoped to this block via `--ht-*` custom properties so the
 *     site theme toggle cannot reach it. Nothing is added to the global token
 *     layer.
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
  useRef,
  useState,
} from 'react';
import {
  animate,
  Anime,
  SplitText,
  type SplitTextRef,
  stagger,
} from '@shakibdshy/react-animejs';

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
} as const;

const STAGE_HEIGHT = 'min(74vh, 640px)';

const HERO_TITLE = 'BOLD FLAVOR';
const HERO_EYEBROW = 'FIRE ROASTED INDIAN SAUCE';

/**
 * Bands of the page. `flip` mirrors the two-column composition so consecutive
 * sections alternate which side the headline occupies.
 */
const PRODUCT_BANDS = [
  {
    key: 'angle',
    eyebrow: 'The blend',
    headline: 'A NEW ANGLE OF FLAVOR',
    caption:
      'DISCOVER HOW OUR CREAMY TOMATO BLEND AND AUTHENTIC SPICES ELEVATE EVERY MEAL',
    badges: [{ label: 'Creamy tomato', tone: 'primary' }, { label: 'Medium heat', tone: 'secondary' }],
    heat: 'HEAT 02',
    flavour: 'tomato',
  },
  {
    key: 'tandoor',
    eyebrow: 'The method',
    headline: 'ROASTED IN THE TANDOOR',
    caption:
      'CHARCOAL, CLAY AND TIME. EVERY JAR IS FIRE-ROASTED TO A DEEP, UNEVEN CHAR',
    badges: [{ label: 'Tandoor fire', tone: 'primary' }, { label: 'Slow roasted', tone: 'secondary' }],
    heat: 'HEAT 03',
    flavour: 'char',
  },
] as const;

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

type BadgeTone = 'primary' | 'secondary' | 'alert';

/** Badge fills. Never white — the palette is warm-only by rule. */
const TONE_STYLE: Record<BadgeTone, CSSProperties> = {
  primary: {
    background: PALETTE.gold,
    color: PALETTE.clove,
    border: `1px solid ${PALETTE.gold}`,
  },
  alert: {
    background: PALETTE.chili,
    color: PALETTE.clove,
    border: `1px solid ${PALETTE.chili}`,
  },
  secondary: {
    background: PALETTE.spice,
    color: PALETTE.gold,
    border: `1px solid ${PALETTE.cardamom}`,
  },
};

function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className="ht-label rounded-full px-3 py-1.5" style={TONE_STYLE[tone]}>
      {label}
    </span>
  );
}

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

/** A single flying jar, animated along a three-keyframe arc. */
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

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export const HungryTigerLanding = memo(function HungryTigerLanding({
  className = '',
}: {
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLButtonElement>(null);
  const heroSplitRef = useRef<SplitTextRef>(null);
  const heroReadyRef = useRef(false);

  const [cartCount, setCartCount] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flyers, setFlyers] = useState<
    { id: number; from: { x: number; y: number }; to: { x: number; y: number }; lift: number }[]
  >([]);
  const flyerIdRef = useRef(0);

  /** Per-character cascade, replayed on demand (see the scroll listener). */
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

  // Replay the hero cascade whenever the stage returns to the top, so a reader
  // who scrolled past it can see it again without a control bar.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let wasScrolled = false;
    const onScroll = () => {
      const atTop = stage.scrollTop <= 4;
      if (!atTop) {
        wasScrolled = true;
        return;
      }
      if (wasScrolled && heroReadyRef.current) {
        wasScrolled = false;
        playHeroEntrance();
      }
    };
    stage.addEventListener('scroll', onScroll, { passive: true });
    return () => stage.removeEventListener('scroll', onScroll);
  }, [playHeroEntrance]);

  // Reveal each band the first time it enters the stage. Rooted in the stage so
  // only this block's scroll drives it, not the page.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.band;
          if (key) setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
          observer.unobserve(entry.target);
        }
      },
      { root: stage, threshold: 0.25 },
    );
    stage.querySelectorAll('[data-band]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleBuy = useCallback(() => {
    const hero = buyRef.current;
    const bag = bagRef.current;
    if (!hero || !bag) return;

    const heroRect = hero.getBoundingClientRect();
    const bagRect = bag.getBoundingClientRect();
    const from = {
      x: heroRect.left + heroRect.width / 2,
      y: heroRect.top + heroRect.height / 2,
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

        /* Focus is a border-colour shift only — the brand has no focus ring. */
        .ht-input {
          border: 1px solid var(--ht-cardamom);
          transition: border-color 200ms ease-out;
        }
        .ht-input:focus {
          border-color: var(--ht-gold);
        }

        /* Reveal bands on scroll — no elevation, no shadow, colour shift only. */
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

      {/* Scroll box — the self-contained scroller. */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Hungry Tiger brand landing page"
        className="relative w-full overflow-y-auto overscroll-contain"
        style={{ height: STAGE_HEIGHT }}
      >
        {/* Nav */}
        <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <span className="ht-type ht-heading-sm">HUNGRY TIGER</span>
          <div className="flex items-center gap-2">
            <GhostButton>SAUCE</GhostButton>
            <GhostButton>RECIPES</GhostButton>
            <GhostButton>ABOUT</GhostButton>
          </div>
        </nav>

        {/* Hero — animates on mount rather than on scroll, so it carries no
            `data-reveal`: the scroll-reveal CSS would otherwise hold it at
            opacity 0 forever. */}
        <header className="ht-band relative flex flex-col items-center px-6 pb-14 text-center">
          <BotanicalWatermark seed={1} style={{ width: 190, height: 316, left: -40, top: -30 }} />
          <Anime
            autoplay
            duration={640}
            ease="outQuad"
            opacity={[0, 1]}
            translateY={[14, 0]}
            className="relative"
          >
            <div className="flex flex-col items-center">
              <span className="ht-eyebrow">{HERO_EYEBROW}</span>
              <p
                className="ht-sub mt-4 max-w-md"
                style={{ color: PALETTE.gold, opacity: 0.82 }}
              >
                FIRE-ROASTED INDIAN SAUCE, GROUNDED IN CHAR AND SPICE
              </p>
              <div className="mt-6" ref={buyRef}>
                <FilledButton onClick={handleBuy}>BUY NOW</FilledButton>
              </div>
            </div>
          </Anime>
          <SplitText ref={heroSplitRef} params={{ chars: true }} onReady={handleSplitReady}>
            <h2 className="ht-type ht-display relative mt-3 mb-0">{HERO_TITLE}</h2>
          </SplitText>
          <Anime
            autoplay
            duration={780}
            ease="outExpo"
            opacity={[0, 1]}
            translateY={[30, 0]}
            className="relative mt-10 block"
          >
            <Jar flavour="tomato" style={{ width: 132, height: 220 }} />
          </Anime>
        </header>

        <DottedRule />

        {/* Product bands — alternating asymmetric compositions. */}
        {PRODUCT_BANDS.map((band, index) => {
          const isRevealed = revealed[band.key] === true;
          const isFlipped = index % 2 !== 0;
          return (
            <div key={band.key}>
              <section
                data-band={band.key}
                data-revealed={isRevealed}
                className={`ht-band relative flex flex-col items-center gap-8 px-6 py-14 sm:px-10 ${
                  isFlipped ? 'sm:flex-row-reverse' : 'sm:flex-row'
                }`}
              >
                <BotanicalWatermark
                  seed={index + 2}
                  style={{
                    width: 150,
                    height: 250,
                    right: isFlipped ? 0 : 'auto',
                    left: isFlipped ? 'auto' : 0,
                    top: -20,
                  }}
                />
                <div className="relative flex-1" data-reveal>
                  <span className="ht-caption" style={{ opacity: 0.75 }}>
                    {band.eyebrow}
                  </span>
                  <h3 className="ht-type ht-heading-lg mt-2">{band.headline}</h3>
                  <p className="ht-sub mt-4 max-w-md" style={{ opacity: 0.8 }}>
                    {band.caption}
                  </p>
                  <div
                    className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-[6px] p-4"
                    style={{ background: PALETTE.spice, border: `1px solid ${PALETTE.cardamom}` }}
                  >
                    {band.badges.map((badge) => (
                      <Badge key={badge.label} label={badge.label} tone={badge.tone} />
                    ))}
                    <Badge label={band.heat} tone="alert" />
                  </div>
                </div>
                <div className="shrink-0" data-reveal>
                  <Jar flavour={band.flavour} style={{ width: 108, height: 180 }} />
                </div>
              </section>
              <DottedRule />
            </div>
          );
        })}

        {/* Email capture */}
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
      </div>

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
          className="relative flex h-12 w-12 items-center justify-center rounded-full"
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
          scroll the stage · buy now flies the jar into the bag
        </span>
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-landing-muted/60">
          SplitText + IntersectionObserver
        </span>
      </div>
    </div>
  );
});

export default HungryTigerLanding;