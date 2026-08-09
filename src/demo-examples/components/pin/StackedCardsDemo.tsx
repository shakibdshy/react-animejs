/**
 * StackedCardsDemo — the GSAP stacked-cards effect reproduced with react-animejs.
 *
 * Mechanic (matches GSAP ScrollTrigger pin:true stacked cards):
 * A single pinned container holds all N cards stacked at the same position.
 * The container pins for (N-1) viewport-heights of scroll — that scroll runway
 * is the shared progress (0→1). Each card derives its own recede from a slice
 * of that shared progress: card i is "active" during slice i, and recedes
 * (opacity 1→0, y 0→−25%, z 0→−800px, rotateX 0→80deg) as slice i+1 advances.
 *
 * One pinned container (not per-card pins) is the key — per-card pinning with
 * pinSpacing:false collapses the runway; a shared runway gives each transition
 * its own scroll distance.
 */

import { useMemo, useState } from 'react';
import { Power } from 'lucide-react';
import { useAnimeOnScroll } from '@shakibdshy/react-animejs';

const CARDS = [
  { label: 'Origins', tint: '#22d3ee' },
  { label: 'Signal', tint: '#a78bfa' },
  { label: 'Velocity', tint: '#f472b6' },
  { label: 'Depth', tint: '#34d399' },
  { label: 'Resonance', tint: '#fbbf24' },
  { label: 'Aperture', tint: '#60a5fa' },
  { label: 'Cascade', tint: '#fb7185' },
  { label: 'Horizon', tint: '#2dd4bf' },
];

/**
 * Recede transform for a card being covered: 0 = fully visible, 1 = receded.
 * The tilt is intentionally subtle so the card stays readable while the next
 * one slides over it; the fade is applied separately and back-loaded so the
 * card only disappears once it's been substantially covered.
 */
function recedeTransform(p: number): string {
  const clamped = Math.max(0, Math.min(1, p));
  const scale = 1 - clamped * 0.07;
  const y = -12 * clamped;
  const rotateX = 35 * clamped;
  return `translateY(${y}%) scale(${scale}) rotateX(${rotateX}deg)`;
}

/** Ease that holds near 0 then ramps up — used so a card stays opaque until
 *  the next one has mostly covered it, then fades quickly. */
function backLoadedEase(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  // cubic ease-in: slow start, fast finish.
  return clamped * clamped * clamped;
}

export function StackedCardsDemo() {
  const [enabled, setEnabled] = useState(true);
  const last = CARDS.length - 1;

  // One pin for the whole stack. The container is a single h-screen viewport;
  // it pins at 'top top' and stays pinned for (N-1) viewport-heights via
  // endSpacing, so there is one viewport of scroll per card transition.
  const { ref, progress, isPinned } = useAnimeOnScroll<HTMLDivElement>({
    pin: enabled,
    pinStart: 'top top',
    pinEnd: 'top top',
    // (N-1) viewports of extra scroll distance = one per card transition.
    endSpacing: enabled ? last * (typeof window !== 'undefined' ? window.innerHeight : 800) : 0,
    pinSpacing: true,
    enabled,
  });

  const note = useMemo(
    () =>
      enabled
        ? `pin on — ${Math.round(progress * 100)}% through the stack`
        : 'pin off — cards scroll in natural document flow',
    [enabled, progress],
  );

  return (
    <div className="relative">
      {/* Floating control + telemetry. */}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-9999 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-demo-text-muted">
            {note}
          </span>
          <button
            onClick={() => setEnabled((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] transition-all ${
              enabled
                ? 'bg-demo-accent/20 text-demo-accent hover:bg-demo-accent/30'
                : 'bg-white/10 text-demo-text-secondary hover:bg-white/20'
            }`}
            title="Toggle pin enabled (acceptance check #5)"
          >
            <Power size={12} /> {enabled ? 'on' : 'off'}
          </button>
        </div>
      </div>

      {/*
        The hostile layout case: a <main> with overflow-x-hidden breaks
        position: sticky but NOT position: fixed. The pin engine uses fixed.
        perspective must NOT go on this ancestor (it would contain the fixed
        element); it goes on the pinned container itself below.
      */}
      <main className="overflow-x-hidden">
        {/* Pinned container: one viewport tall, holds the whole stack. */}
        <div
          ref={ref}
          className="relative flex h-screen w-full items-center justify-center px-6"
        >
          {/* perspective on the pinned container gives its children real depth
              without establishing a containing block for this element's own
              position:fixed (perspective on the fixed element itself is safe). */}
          <div
            className="relative h-[70vh] w-full max-w-3xl"
            style={{ perspective: '1200px' }}
          >
            {CARDS.map((card, i) => {
              // The stack is split into (N-1) transitions, one per scroll slice.
              // Transition k covers progress slice [k, k+1]/(N-1): card k recedes
              // while card k+1 rises to cover it. At most TWO cards are ever
              // visible — the current one and the one covering it. Every other
              // card is fully hidden so nothing peeks out from underneath.
              const sliceSize = last; // (N-1) slices across full progress
              const sliceStart = i / sliceSize; // progress where card i starts receding

              // Recede: how far card i has been pushed back. Driven by how far
              // we've scrolled past sliceStart, clamped to its own slice.
              let recedeRaw = 0;
              if (i < last) {
                recedeRaw = (progress - sliceStart) / (1 / sliceSize);
              }
              const recede = Math.max(0, Math.min(1, recedeRaw));

              // Enter: card i (i>0) rises from below during the PREVIOUS slice
              // [i-1, i]/(N-1), so it's in place by the time it becomes active.
              let enterRaw = 1;
              if (i > 0) {
                const enterStart = (i - 1) / sliceSize;
                enterRaw = (progress - enterStart) / (1 / sliceSize);
              }
              const enter = Math.max(0, Math.min(1, enterRaw));
              // Rise from 100% (fully below, clipped) → 0% (in place).
              const enterY = (1 - enter) * 100;

              // Back-loaded fade: stay opaque until the next card has mostly
              // covered this one, then fade out quickly.
              const fadeOpacity = i === last ? 1 : 1 - backLoadedEase(recede);

              // VISIBILITY: only the card currently in place AND the next card
              // (the one entering to cover it) are shown. Everything else is
              // hidden so deeper cards never peek out from underneath.
              // - card i is "current" once it has finished entering (enter≈1)
              //   and until it finishes receding (recede<1).
              // - card i is "entering" while 0 < enter < 1.
              const isCurrent = enter >= 1 && recede < 1;
              const isEntering = enter > 0 && enter < 1;
              const visible = isCurrent || isEntering;
              const displayOpacity = visible ? fadeOpacity : 0;

              return (
                <div
                  key={card.label}
                  className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl border"
                  style={{
                    borderColor: `${card.tint}40`,
                    background: `radial-gradient(120% 120% at 50% 0%, ${card.tint}22, rgba(8,8,14,0.92) 70%)`,
                    boxShadow: `0 30px 80px ${card.tint}1f`,
                    zIndex: 10 + i,
                    // Entering cards slide up from below; receding cards tilt back.
                    transform: `translateY(${enterY}%) ${recedeTransform(recede)}`,
                    opacity: displayOpacity,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className="mb-4 text-[11px] font-mono uppercase tracking-[0.4em]"
                    style={{ color: card.tint }}
                  >
                    {String(i + 1).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}
                  </div>
                  <h2 className="text-center text-5xl font-black uppercase tracking-widest text-white sm:text-7xl">
                    {card.label}
                  </h2>
                  <div className="mt-6 text-center text-xs text-demo-text-muted">
                    {i === 0 && progress < 0.05
                      ? 'Scroll to advance the stack'
                      : `card ${i + 1}${recede > 0.01 ? ` · receding ${Math.round(recede * 100)}%` : ''}`}
                  </div>
                  <div
                    className="absolute bottom-5 left-1/2 h-1 -translate-x-1/2 rounded-full transition-[width] duration-75"
                    style={{ width: `${Math.max(4, (i === 0 ? 1 - recede : enter) * 240)}px`, background: card.tint }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Trailing content so the page doesn't end abruptly after the stack. */}
        <section className="flex h-screen w-full flex-col items-center justify-center px-6 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-demo-text-muted">
            end of stack
          </div>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-widest text-white">
            {isPinned ? 'still pinned' : 'released'}
          </h2>
          <p className="mt-3 max-w-md text-sm text-demo-text-muted">
            The pinned container held {CARDS.length} cards across {last} viewport-heights of scroll.
            Scroll back up to replay the stack.
          </p>
        </section>
      </main>
    </div>
  );
}

export default StackedCardsDemo;

