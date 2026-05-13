import { memo, useRef } from 'react';
import { AnimeTimeline } from '@/lib/react-animejs/components';
import { DemoButton, PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

export const TimelinesPreview = memo(function TimelinesPreview(_props: PreviewProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const sqRef = useRef<HTMLDivElement>(null);

  const entries = [
    {
      targets: circleRef,
      translateX: [0, 60, 0],
      duration: 1200,
      ease: 'inOutQuad',
      position: 0,
    },
    {
      targets: diamondRef,
      translateX: [0, 60, 0],
      rotate: ['0turn', '0.5turn', '0turn'],
      duration: 1200,
      ease: 'inOutQuad',
      position: 0,
    },
    {
      targets: sqRef,
      translateX: [0, 60, 0],
      scale: [1, 1.15, 1],
      duration: 1200,
      ease: 'inOutQuad',
      position: 200,
    },
  ];

  const totalMs = 1400;
  const step1Pct = (1200 / totalMs) * 100;
  const step2Pct = (200 + 1200) / totalMs * 100 > 100 ? 100 : ((200 + 1200) / totalMs) * 100;

  return (
    <AnimeTimeline autoplay={false} entries={entries}>
      {({ controls, state }) => {
        const pct = state.progress * 100;
        const activeStep = pct <= 0 ? -1 : pct <= step1Pct ? 0 : pct < step2Pct ? 1 : 2;

        return (
          <PreviewCard
            title="Timeline"
            description="Sequenced multi-step animation"
            controls={
              <DemoButton onClick={() => controls.restart()} variant="accent" small>
                Play
              </DemoButton>
            }
          >
            <div
              className="flex flex-col gap-5 w-full"
              role="group"
              aria-label="Timeline animation preview"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-full flex justify-center h-12 items-center overflow-hidden">
                    <div
                      ref={circleRef}
                      className="w-8 h-8 rounded-full border-[1.5px] border-landing-accent bg-landing-accent/10 shadow-[0_0_8px_var(--landing-accent,oklch(0.58_0.16_35))/0.15]"
                    />
                  </div>
                  <span
                    className={cn(
                      'landing-font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-300',
                      activeStep === 0 ? 'text-landing-accent' : 'text-landing-muted/40'
                    )}
                  >
                    Translate
                  </span>
                </div>

                <div className="w-px h-10 bg-landing-border/50 self-start mt-1 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-full flex justify-center h-12 items-center overflow-hidden">
                    <div
                      ref={diamondRef}
                      className="w-7 h-7 rotate-45 rounded-[3px] border-[1.5px] border-landing-accent-dim bg-landing-accent-dim/10"
                    />
                  </div>
                  <span
                    className={cn(
                      'landing-font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-300',
                      activeStep === 1 ? 'text-landing-accent' : 'text-landing-muted/40'
                    )}
                  >
                    Rotate
                  </span>
                </div>

                <div className="w-px h-10 bg-landing-border/50 self-start mt-1 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-full flex justify-center h-12 items-center overflow-hidden">
                    <div
                      ref={sqRef}
                      className="w-8 h-8 rounded-lg border-[1.5px] border-landing-accent bg-landing-accent/10"
                    />
                  </div>
                  <span
                    className={cn(
                      'landing-font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-300',
                      activeStep === 2 ? 'text-landing-accent' : 'text-landing-muted/40'
                    )}
                  >
                    Slide
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div
                  className="relative h-0.75 rounded-full bg-landing-border overflow-visible"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Timeline progress: ${Math.round(pct)}%`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-landing-accent rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.25 h-1.25 rounded-full bg-landing-border"
                    style={{ left: `${step1Pct}%`, marginLeft: '-2.5px' }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.25 h-1.25 rounded-full bg-landing-border"
                    style={{ left: `${step2Pct}%`, marginLeft: '-2.5px' }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-landing-accent shadow-[0_0_6px_var(--landing-accent,oklch(0.58_0.16_35))/0.4]"
                    style={{ left: `${pct}%`, marginLeft: '-4px' }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="landing-font-mono text-[8px] text-landing-muted/30 tabular-nums">
                    0ms
                  </span>
                  <span className="landing-font-mono text-[8px] text-landing-accent/70 tabular-nums">
                    {Math.round(state.progress * totalMs)}ms
                  </span>
                  <span className="landing-font-mono text-[8px] text-landing-muted/30 tabular-nums">
                    {totalMs}ms
                  </span>
                </div>
              </div>
            </div>
          </PreviewCard>
        );
      }}
    </AnimeTimeline>
  );
});
