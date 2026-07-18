/**
 * LayeredPinningLoop — a self-contained react-animejs take on GreenSock's
 * layered pinning ScrollTrigger demo.
 *
 * Each panel is sticky at the top of the scroll box, so later panels layer
 * over earlier ones while the browser keeps the scroll gesture continuous.
 */
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Layers3 } from 'lucide-react';
import { Anime, AnimeScroll, utils } from '@/lib/react-animejs';

const { clamp } = utils;

const PANEL_COUNT = 5;
const TRACK_HEIGHT = `${PANEL_COUNT * 100}%`;

type LoopPanel = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  surface: string;
};

const PANELS: LoopPanel[] = [
  {
    number: '01',
    eyebrow: 'Signal / 01',
    title: 'Start with intent.',
    description: 'A scroll sequence that gives every panel its own moment in the spotlight.',
    accent: '#ff5a36',
    surface: '#17100e',
  },
  {
    number: '02',
    eyebrow: 'Signal / 02',
    title: 'Let layers build.',
    description: 'Sticky positioning keeps the scene pinned while the next chapter arrives on top.',
    accent: '#ffb547',
    surface: '#17150d',
  },
  {
    number: '03',
    eyebrow: 'Signal / 03',
    title: 'Hold the frame.',
    description:
      'A focused stage, deliberate contrast, and a little breathing room for the motion.',
    accent: '#64d5ff',
    surface: '#0d161b',
  },
  {
    number: '04',
    eyebrow: 'Signal / 04',
    title: 'Shift the rhythm.',
    description:
      'A steady scroll rhythm lets each transition land without forcing the browser to jump.',
    accent: '#b29cff',
    surface: '#131020',
  },
  {
    number: '05',
    eyebrow: 'Signal / 05',
    title: 'Return to the source.',
    description:
      'The finite sequence ends cleanly after the final layer, ready for the next block on the page.',
    accent: '#73e0a6',
    surface: '#0e1713',
  },
];

export const LayeredPinningLoop = memo(function LayeredPinningLoop({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  return (
    <AnimeScroll<HTMLDivElement, HTMLDivElement>
      container={containerRef}
      enter={{ target: 'top', container: 'top' }}
      leave={{ target: 'bottom', container: 'bottom' }}
      enabled={ready}
    >
      {({ ref: trackRef, progress }) => {
        const normalizedProgress = clamp(progress, 0, 0.999999);
        const activeIndex = Math.min(PANEL_COUNT - 1, Math.floor(normalizedProgress * PANEL_COUNT));
        const activePanel = PANELS[activeIndex];

        return (
          <div
            className={`relative overflow-hidden rounded-2xl border border-landing-border/60 bg-[#070808] text-landing-fg ${className}`}
          >
            <div
              ref={containerRef}
              className="relative w-full overflow-y-auto overscroll-contain"
              style={{ height: 'min(74vh, 640px)' }}
            >
              <div ref={trackRef} className="relative" style={{ height: TRACK_HEIGHT }}>
                {PANELS.map((panel, index) => {
                  return (
                    <section
                      key={`${panel.number}-${index}`}
                      className="sticky top-0 flex items-center overflow-hidden"
                      style={{
                        height: `${100 / PANEL_COUNT}%`,
                        zIndex: index + 1,
                        backgroundColor: panel.surface,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-60"
                        style={{
                          background: `radial-gradient(circle at 72% 28%, ${panel.accent}28, transparent 42%)`,
                        }}
                      />
                      <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-between px-7 py-8 transition-all duration-500 sm:px-12 sm:py-12">
                        <div className="flex items-start justify-between gap-5">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20"
                            style={{ color: panel.accent }}
                          >
                            <Layers3 className="h-5 w-5" />
                          </div>
                          <span
                            className="landing-font-mono text-[10px] uppercase tracking-[0.28em]"
                            style={{ color: panel.accent }}
                          >
                            {panel.eyebrow}
                          </span>
                        </div>

                        <div className="max-w-2xl">
                          <span
                            className="landing-font-mono text-[clamp(4rem,14vw,10rem)] font-semibold leading-none tracking-[-0.09em] opacity-20"
                            style={{ color: panel.accent }}
                          >
                            {panel.number}
                          </span>
                          <h3 className="landing-font-display -mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            {panel.title}
                          </h3>
                          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                            {panel.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                          <span className="landing-font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                            Layered pin · {String(index + 1).padStart(2, '0')} / {PANEL_COUNT}
                          </span>
                          <span className="h-px w-20" style={{ backgroundColor: panel.accent }} />
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>

              <Anime
                opacity={[0, 1]}
                translateY={[18, 0]}
                duration={700}
                ease="outQuad"
                autoplay
                enabled={ready}
              >
                <div className="pointer-events-none absolute inset-x-0 top-5 z-30 flex flex-col items-center text-center">
                  <p className="landing-font-mono text-[10px] uppercase tracking-[0.28em] text-landing-accent">
                    Layered pinning · finite stack
                  </p>
                  <h3 className="landing-font-display mt-2 text-base font-bold text-white/90 drop-shadow">
                    Scroll to stack the panels
                  </h3>
                  <ArrowDown className="mt-3 h-4 w-4 animate-bounce text-white/40" />
                </div>
              </Anime>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 bg-[#0b0d0d] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-landing-accent" />
                <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">
                  wheel inside the stage · five pinned layers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-100"
                    style={{
                      width: `${Math.round(normalizedProgress * 100)}%`,
                      backgroundColor: activePanel.accent,
                    }}
                  />
                </div>
                <span className="landing-font-mono min-w-12 text-right text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {activePanel.number} / {PANEL_COUNT}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    </AnimeScroll>
  );
});

export default LayeredPinningLoop;
