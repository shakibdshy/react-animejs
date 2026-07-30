/**
 * AddToCard — fly a product into the basket along a curved arc.
 *
 * On "Add to cart", a clone of the product sprite launches from the card and
 * travels to the basket. The arc is built from three keyframes: origin → a
 * mid-point lifted above both endpoints (the "pop up") → the basket. anime.js
 * smooths the keyframed `translateX`/`translateY` with an `outQuad`/`inQuad`
 * pairing so the sprite eases out, peaks, and settles into the basket.
 *
 * Driven entirely by react-animejs: the flying sprite is animated with the
 * declarative `<Anime>` component; the basket bumps with `<Anime>` on impact.
 */
import {
  memo,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Anime } from '@shakibdshy/react-animejs';

interface Flyer {
  id: number;
  /** start center, in viewport coords */
  from: { x: number; y: number };
  /** basket center, in viewport coords */
  to: { x: number; y: number };
  /** arc height (lift above the straight line) */
  lift: number;
  /** product label / emoji shown on the flyer */
  label: string;
}

const DURATION = 750;
const PRODUCT_LABEL = '🧢';

export const AddToCard = memo(function AddToCard({ className = '' }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const flyerIdRef = useRef(0);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [count, setCount] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  const handleAdd = useCallback(() => {
      const card = cardRef.current;
      const basket = basketRef.current;
      if (!card || !basket) return;

      const cardRect = card.getBoundingClientRect();
      const basketRect = basket.getBoundingClientRect();

      const from = { x: cardRect.left + cardRect.width / 2, y: cardRect.top + cardRect.height / 2 };
      const to = { x: basketRect.left + basketRect.width / 2, y: basketRect.top + basketRect.height / 2 };

      // Arc lift: the midpoint sits above the higher of the two endpoints by
      // at least ~140px (scaled by horizontal distance for a flatter arc when
      // they're vertically aligned). This guarantees the sprite visibly pops up
      // regardless of card/basket geometry.
      const lift = 140 + Math.abs(to.x - from.x) * 0.35;

      const flyer: Flyer = {
        id: ++flyerIdRef.current,
        from,
        to,
        lift,
        label: PRODUCT_LABEL,
      };
      setFlyers((f) => [...f, flyer]);
    },
    [],
  );

  const handleArrive = useCallback((id: number) => {
    setFlyers((f) => f.filter((x) => x.id !== id));
    setCount((c) => c + 1);
    setPulseKey((k) => k + 1);
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-surface/40 ${className}`}
      style={{ minHeight: 360 }}
    >
      <div className="relative z-10 flex min-h-90 items-center justify-between gap-8 p-8">
        {/* Product card */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-landing-border bg-landing-bg/60 text-5xl shadow-lg shadow-landing-accent/10">
            {PRODUCT_LABEL}
          </div>
          <div className="text-center">
            <p className="landing-font-display text-sm font-semibold text-landing-fg">Snapback Cap</p>
            <p className="landing-font-mono text-[10px] tracking-widest uppercase text-landing-muted">$32.00</p>
          </div>
          <button
            ref={cardRef}
            onClick={handleAdd}
            className="cursor-pointer rounded-full border border-landing-accent bg-landing-accent px-5 py-2 landing-font-mono text-[11px] font-semibold uppercase tracking-widest text-landing-bg transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            Add to cart
          </button>
        </div>

        {/* Basket */}
        <div className="relative flex flex-col items-center gap-2">
          <div
            ref={basketRef}
            className="flex h-24 w-24 items-center justify-center rounded-2xl border border-landing-border bg-landing-bg/60 text-4xl"
          >
            🧺
            {/* Pulse ring on arrival */}
            <Anime
              key={pulseKey}
              autoplay
              duration={420}
              ease="outExpo"
              scale={[{ to: 1, duration: 0 }, { to: 1.25, duration: 220 }, { to: 1, duration: 200 }]}
              opacity={[{ to: 0, duration: 0 }, { to: 0.9, duration: 120 }, { to: 0, duration: 300 }]}
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-landing-accent"
            >
              <span className="block h-full w-full" />
            </Anime>
          </div>
          <span className="landing-font-mono text-[10px] tracking-widest uppercase text-landing-muted">
            Cart · {count}
          </span>
        </div>
      </div>

      {/* Flying sprites layer — fixed to viewport, above everything. */}
      {flyers.map((f) => (
        <Flyer key={f.id} flyer={f} onArrive={() => handleArrive(f.id)} />
      ))}

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          click add to cart · arcs into the basket
        </span>
      </div>
    </div>
  );
});

/**
 * The flying sprite. `<Anime>` animates translateX/translateY through three
 * keyframes that describe the arc: origin → lifted midpoint → basket.
 */
const Flyer = memo(function Flyer({ flyer, onArrive }: { flyer: Flyer; onArrive: () => void }) {
  const mid = {
    x: (flyer.from.x + flyer.to.x) / 2,
    y: Math.min(flyer.from.y, flyer.to.y) - flyer.lift,
  };

  return (
    <Anime
      autoplay
      duration={DURATION}
      ease="outQuad"
      onComplete={onArrive}
      // Three-point arc: start → lifted midpoint → basket.
      translateX={[
        { to: flyer.from.x, duration: 0 },
        { to: mid.x, duration: DURATION * 0.5, ease: 'outQuad' },
        { to: flyer.to.x, duration: DURATION * 0.5, ease: 'inQuad' },
      ]}
      translateY={[
        { to: flyer.from.y, duration: 0 },
        { to: mid.y, duration: DURATION * 0.5, ease: 'outQuad' },
        { to: flyer.to.y, duration: DURATION * 0.5, ease: 'inQuad' },
      ]}
      scale={[
        { to: 1, duration: 0 },
        { to: 1.15, duration: DURATION * 0.5, ease: 'outQuad' },
        { to: 0.35, duration: DURATION * 0.5, ease: 'inQuad' },
      ]}
      opacity={[
        { to: 1, duration: 0 },
        { to: 1, duration: DURATION * 0.7 },
        { to: 0.9, duration: DURATION * 0.3 },
      ]}
    >
      <span
        className="pointer-events-none fixed top-0 left-0 z-50 block text-3xl"
        style={{ transform: 'translate(0,0)' }}
      >
        {flyer.label}
      </span>
    </Anime>
  );
});

export default AddToCard;
