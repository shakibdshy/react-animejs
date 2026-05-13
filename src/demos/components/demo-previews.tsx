import { memo, useCallback, useRef, useState } from 'react';
import {
  useAnime,
  useAnimeTimer,
  useAnimeScramble,
  useAnimeDraggable,
  useAnimeOnScroll,
  useAnimatable,
} from '@/lib/react-animejs/hooks';
import {
  AnimeTimeline,
  AnimeMorph,
  AnimeDraw,
  AnimeMotionPath,
} from '@/lib/react-animejs/components';
import { ToggleSwitch } from '@/demo/components/common/ToggleSwitch';
import { SpinningCube } from '@/demo/components/common/SpinningCube';
import { Counter } from '@/demo/components/common/Counter';
import { Countdown } from '@/demo/components/common/Countdown';
import { ClipPathReveal } from '@/demo/components/common/ClipPathReveal';
import { AnimatedSlider } from '@/demo/components/common/AnimatedSlider';

const MORPH_TRIANGLE = '80,20 160,140 0,140';
const MORPH_HEXAGON = '120,0 200,40 200,120 120,160 40,120 40,40';

const SUZUKA_TRACK_PATH =
  'M189.142857,4 C227.456875,4 248.420457,4.00974888 256.864191,4.00974888 C263.817211,4.00974888 271.61219,3.69583517 274.986231,6.63061513 C276.382736,7.84531176 279.193529,11.3814152 280.479499,13.4815847 C281.719344,15.5064248 284.841964,20.3571626 275.608629,20.3571626 C265.817756,20.3571626 247.262478,19.9013915 243.955117,19.9013915 C239.27946,19.9013915 235.350655,24.7304885 228.6344,24.7304885 C224.377263,24.7304885 219.472178,21.0304113 214.535324,21.0304113 C207.18393,21.0304113 200.882842,30.4798911 194.124187,30.4798911 C186.992968,30.4798911 182.652552,23.6245972 173.457298,23.6245972 C164.83277,23.6245972 157.191045,31.5424105 157.191045,39.1815359 C157.191045,48.466779 167.088672,63.6623005 166.666679,66.9065088 C166.378668,69.1206889 155.842137,79.2568633 151.508744,77.8570506 C145.044576,75.7689355 109.126667,61.6405346 98.7556561,52.9785141 C96.4766876,51.0750861 89.3680347,39.5769094 83.4195005,38.5221785 C80.6048001,38.0231057 73.0179337,38.7426555 74.4158694,42.6956376 C76.7088819,49.1796531 86.3280337,64.1214904 87.1781062,66.9065088 C88.191957,70.2280995 86.4690152,77.0567847 82.2060607,79.2503488 C79.2489435,80.7719756 73.1324132,82.8858479 64.7015706,83.0708761 C55.1604808,83.2802705 44.4254811,80.401884 39.1722168,80.401884 C25.7762119,80.401884 24.3280517,89.1260466 22.476679,94.4501705 C21.637667,96.8629767 20.4337535,108 33.2301959,108 C37.8976087,108 45.0757044,107.252595 53.4789069,103.876424 C61.8821095,100.500252 122.090049,78.119656 128.36127,75.3523302 C141.413669,69.5926477 151.190142,68.4987755 147.018529,52.0784879 C143.007818,36.291544 143.396957,23.4057975 145.221196,19.6589263 C146.450194,17.1346449 148.420955,14.8552817 153.206723,15.7880203 C155.175319,16.1716965 155.097637,15.0525421 156.757598,11.3860986 C158.417558,7.71965506 161.842736,4.00974888 167.736963,4.00974888 C177.205308,4.00974888 184.938832,4 189.142857,4 Z';

const DRAWABLE_SHAPES = [
  {
    type: 'path' as const,
    d: 'M59 90V56.136C58.66 46.48 51.225 39 42 39c-9.389 0-17 7.611-17 17s7.611 17 17 17h8.5v17H42C23.222 90 8 74.778 8 56s15.222-34 34-34c18.61 0 33.433 14.994 34 33.875V90H59z',
  },
  { type: 'polyline' as const, points: '59 22.035 59 90 76 90 76 22 59 22' },
  {
    type: 'path' as const,
    d: 'M59 90V55.74C59.567 36.993 74.39 22 93 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90H59z',
  },
  { type: 'polyline' as const, points: '127 22.055 127 90 144 90 144 22 127 22' },
  {
    type: 'path' as const,
    d: 'M127 90V55.74C127.567 36.993 142.39 22 161 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z',
  },
  {
    type: 'path' as const,
    d: 'M118.5 22a8.5 8.5 0 1 1-8.477 9.067v-1.134c.283-4.42 3.966-7.933 8.477-7.933z',
  },
  {
    type: 'path' as const,
    d: 'M144 73c-9.389 0-17-7.611-17-17v-8.5h-17V56c0 18.778 15.222 34 34 34V73z',
  },
  {
    type: 'path' as const,
    d: 'M178 90V55.74C178.567 36.993 193.39 22 212 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z',
  },
  {
    type: 'path' as const,
    d: 'M263 73c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.18 0 16.58 7.4 17 17h-17v17h34V55.875C296.433 36.994 281.61 22 263 22c-18.778 0-34 15.222-34 34s15.222 34 34 34V73z',
  },
  {
    type: 'path' as const,
    d: 'M288.477 73A8.5 8.5 0 1 1 280 82.067v-1.134c.295-4.42 3.967-7.933 8.477-7.933z',
  },
];

type PreviewProps = Record<string, never>;

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function StatBlock({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-landing-border bg-landing-bg/60">
      <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted">
        {label}
      </span>
      <span
        className={cn(
          'landing-font-mono text-2xl font-bold',
          accent ? 'text-landing-accent' : 'text-landing-fg'
        )}
      >
        {value}
      </span>
    </div>
  );
}

function DemoButton({
  children,
  onClick,
  variant = 'ghost',
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'accent' | 'surface';
  disabled?: boolean;
  small?: boolean;
}) {
  const base = cn(
    'rounded-lg font-medium transition-all duration-200 cursor-pointer select-none',
    small ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs',
    disabled && 'opacity-30 cursor-not-allowed',
    variant === 'accent' && 'bg-landing-accent text-landing-bg hover:brightness-110',
    variant === 'surface' &&
      'bg-landing-surface border border-landing-border text-landing-fg hover:border-landing-accent/40 hover:text-landing-accent',
    variant === 'ghost' &&
      'text-landing-muted hover:text-landing-accent border border-landing-border hover:border-landing-accent/30'
  );
  return (
    <button onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

function PreviewCard({
  title,
  description,
  children,
  controls,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}) {
  return (
    <div className="bg-landing-bg/80 border border-landing-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-landing-border">
        <div>
          <span className="landing-font-display text-sm text-landing-fg">{title}</span>
          {description && (
            <span className="ml-2 text-[11px] text-landing-muted">{description}</span>
          )}
        </div>
        {controls && <div className="flex gap-1.5">{controls}</div>}
      </div>
      <div className="p-5 flex items-center justify-center min-h-40">{children}</div>
    </div>
  );
}

export const BasicAnimationPreview = memo(function BasicAnimationPreview(_props: PreviewProps) {
  const boxes = ['A', 'B', 'C', 'D', 'E'];
  const [running, setRunning] = useState(false);

  const { controls } = useAnime({
    selector: '.basic-anim-box',
    translateX: [
      { to: 120, duration: 600 },
      { to: 0, duration: 400 },
    ],
    scale: [
      { to: 1.2, duration: 300 },
      { to: 1, duration: 300 },
    ],
    stagger: 80,
    ease: 'inOutQuad',
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    setRunning(true);
    controls.restart();
    setTimeout(() => setRunning(false), 1200);
  }, [controls]);

  return (
    <PreviewCard
      title="Basic Animation"
      description="CSS selectors, stagger, easing"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" disabled={running} small>
          {running ? 'Playing...' : 'Play'}
        </DemoButton>
      }
    >
      <div className="flex gap-3">
        {boxes.map((b) => (
          <div
            key={b}
            className="basic-anim-box w-10 h-10 rounded-lg bg-landing-accent flex items-center justify-center landing-font-mono text-xs font-bold text-landing-bg"
          >
            {b}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});

export const SvgMorphPreview = memo(function SvgMorphPreview(_props: PreviewProps) {
  const targetRef = useRef<SVGPolygonElement | null>(null);
  const [shape, setShape] = useState<'triangle' | 'hexagon'>('triangle');

  const handleMorph = useCallback(() => {
    setShape((s) => (s === 'triangle' ? 'hexagon' : 'triangle'));
  }, []);

  return (
    <PreviewCard
      title="SVG Morph"
      description="Polygon path morphing via AnimeMorph"
      controls={
        <DemoButton onClick={handleMorph} variant="accent" small>
          Morph
        </DemoButton>
      }
    >
      <svg viewBox="0 0 200 160" className="w-36 h-28">
        <defs>
          <linearGradient id="morphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-landing-accent, oklch(0.55 0.12 160))" />
            <stop offset="100%" stopColor="var(--color-landing-fg, oklch(0.25 0.02 260))" />
          </linearGradient>
        </defs>
        <AnimeMorph
          target={targetRef}
          duration={800}
          ease="inOutQuad"
          alternate
          loop
          autoplay
          deps={[shape]}
        >
          <polygon
            points={shape === 'triangle' ? MORPH_TRIANGLE : MORPH_HEXAGON}
            fill="url(#morphGrad)"
            stroke="var(--color-landing-accent, oklch(0.55 0.12 160))"
            strokeWidth="1.5"
            opacity="0.85"
          />
        </AnimeMorph>
        <polygon
          ref={targetRef}
          points={shape === 'triangle' ? MORPH_HEXAGON : MORPH_TRIANGLE}
          fill="none"
          stroke="none"
        />
      </svg>
    </PreviewCard>
  );
});

export const SvgDrawPreview = memo(function SvgDrawPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="SVG Draw" description="Staged stroke draw via AnimeDraw">
      <svg
        viewBox="0 0 304 112"
        className="w-52 h-20 overflow-visible"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g stroke="var(--color-landing-accent, oklch(0.55 0.12 160))" strokeWidth="2">
          {DRAWABLE_SHAPES.map((shape, index) => (
            <AnimeDraw
              key={index}
              draw={['0 0', '0 1', '1 1']}
              delay={index * 100}
              duration={2000}
              ease="inOutQuad"
              loop
              autoplay
            >
              {shape.type === 'path' ? <path d={shape.d} /> : <polyline points={shape.points} />}
            </AnimeDraw>
          ))}
        </g>
      </svg>
    </PreviewCard>
  );
});

export const SvgMotionPathPreview = memo(function SvgMotionPathPreview(_props: PreviewProps) {
  const trackRef = useRef<SVGPathElement | null>(null);

  return (
    <PreviewCard title="Motion Path" description="Car follows Suzuka track via AnimeMotionPath">
      <svg viewBox="0 0 304 112" className="w-52 h-20 overflow-visible">
        <path
          d={SUZUKA_TRACK_PATH}
          fill="none"
          stroke="var(--color-landing-border, oklch(0.85 0.01 260))"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <AnimeDraw draw="0 1" duration={5000} ease="linear" loop autoplay>
          <path
            ref={trackRef}
            d={SUZUKA_TRACK_PATH}
            fill="none"
            stroke="var(--color-landing-accent, oklch(0.55 0.12 160))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AnimeDraw>
        <AnimeMotionPath path={trackRef} duration={5000} ease="linear" loop autoplay>
          <g>
            <rect
              x="-9"
              y="-5"
              width="18"
              height="10"
              rx="3"
              fill="var(--color-landing-fg, oklch(0.25 0.02 260))"
            />
            <rect
              x="-3"
              y="-8"
              width="10"
              height="6"
              rx="2"
              fill="var(--color-landing-accent, oklch(0.55 0.12 160))"
            />
            <circle cx="-5" cy="6" r="2.2" fill="var(--color-landing-bg, oklch(0.98 0.005 90))" />
            <circle cx="5" cy="6" r="2.2" fill="var(--color-landing-bg, oklch(0.98 0.005 90))" />
          </g>
        </AnimeMotionPath>
      </svg>
    </PreviewCard>
  );
});

export const TimersPreview = memo(function TimersPreview(_props: PreviewProps) {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 1000,
    loop: true,
    autoplay: true,
    frameRate: 30,
  });

  return (
    <PreviewCard
      title="Standalone Timer"
      description="Looping timer with playback controls"
      controls={
        <>
          <DemoButton onClick={controls.play} variant="accent" disabled={isRunning} small>
            Play
          </DemoButton>
          <DemoButton onClick={controls.pause} variant="surface" small>
            Pause
          </DemoButton>
          <DemoButton onClick={() => controls.restart()} variant="ghost" small>
            Restart
          </DemoButton>
        </>
      }
    >
      <div className="flex gap-4 w-full justify-center">
        <StatBlock label="Time" value={Math.round(state.currentTime)} accent />
        <StatBlock label="Progress" value={`${Math.round(state.progress * 100)}%`} />
        <StatBlock label="Iteration" value={state.currentIteration} />
      </div>
    </PreviewCard>
  );
});

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

export const DraggablePreview = memo(function DraggablePreview(_props: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);

  const {
    ref,
    isDragging,
    isGrabbed,
    isReleasing,
    position,
    velocity,
    setX,
    setY,
    reset,
    enable,
    disable,
    isDisabled,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 12,
    snap: 50,
    releaseStiffness: 120,
    releaseDamping: 20,
    onGrab: () => setEvents((e) => [...e.slice(-4), 'onGrab']),
    onRelease: () => setEvents((e) => [...e.slice(-4), 'onRelease']),
    onSnap: () => setEvents((e) => [...e.slice(-4), 'onSnap']),
    onSettle: () => setEvents((e) => [...e.slice(-4), 'onSettle']),
  });

  const stateLabel = isDisabled
    ? 'Disabled'
    : isDragging
      ? 'Dragging'
      : isGrabbed
        ? 'Grabbed'
        : isReleasing
          ? 'Releasing'
          : 'Idle';

  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    gridLines.push(
      <div
        key={`v-${i}`}
        className="absolute top-0 bottom-0 w-px bg-landing-border/30"
        style={{ left: `${(i / 6) * 100}%` }}
      />,
    );
    gridLines.push(
      <div
        key={`h-${i}`}
        className="absolute left-0 right-0 h-px bg-landing-border/30"
        style={{ top: `${(i / 4) * 100}%` }}
      />,
    );
  }

  return (
    <PreviewCard
      title="Draggable"
      description="Snap \u00b7 Spring \u00b7 Controls"
      controls={
        <span className="landing-font-mono text-[10px] text-landing-muted">
          {stateLabel}
        </span>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <div
          ref={containerRef}
          className="w-full h-32 rounded-xl border border-landing-border border-dashed bg-landing-bg/40 flex items-center justify-center relative overflow-hidden"
        >
          {gridLines}
          <div
            ref={ref}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center landing-font-mono text-[10px] font-bold text-landing-bg shadow-lg select-none z-10',
              'bg-linear-to-br from-landing-accent to-landing-accent/60',
              'cursor-grab active:cursor-grabbing',
              isDragging && 'shadow-2xl brightness-110 scale-110',
              isDisabled && 'opacity-40 cursor-not-allowed',
            )}
          >
            Drag
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <DemoButton onClick={() => setX(-50)} variant="ghost" small>\u2190 X</DemoButton>
          <DemoButton onClick={() => setX(50)} variant="ghost" small>X \u2192</DemoButton>
          <DemoButton onClick={() => setY(-30)} variant="ghost" small>\u2191 Y</DemoButton>
          <DemoButton onClick={() => setY(30)} variant="ghost" small>Y \u2193</DemoButton>
          <DemoButton onClick={() => reset()} variant="surface" small>Reset</DemoButton>
          <DemoButton onClick={isDisabled ? enable : disable} variant="accent" small>
            {isDisabled ? 'Enable' : 'Disable'}
          </DemoButton>
        </div>

        <div className="flex gap-3 landing-font-mono text-[10px] text-landing-muted">
          <span>x:{Math.round(position.x)} y:{Math.round(position.y)}</span>
          <span>vx:{velocity.x.toFixed(0)} vy:{velocity.y.toFixed(0)}</span>
        </div>

        {events.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {events.map((msg, i) => (
              <span
                key={i}
                className="landing-font-mono text-[10px] px-2 py-0.5 rounded bg-landing-accent/10 text-landing-accent border border-landing-accent/20"
              >
                {msg}
              </span>
            ))}
          </div>
        )}
      </div>
    </PreviewCard>
  );
});

export const OnScrollPreview = memo(function OnScrollPreview(_props: PreviewProps) {
  const slides = [
    { label: 'Anim', bg: 'linear-gradient(135deg, #22c55e, #15803d)' },
    { label: 'Timer', bg: 'linear-gradient(135deg, #a855f7, #7e22ce)' },
    { label: 'SVG', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { label: 'Scope', bg: 'linear-gradient(135deg, #f97316, #c2410c)' },
    { label: 'Drag', bg: 'linear-gradient(135deg, #0ea5e9, #0369a1)' },
    { label: 'Text', bg: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  ];

  const DELAY = 0.5;
  const DUR = 1;
  const STEP = DELAY + DUR;
  const TOTAL = (slides.length - 1) * STEP + DELAY;

  const { ref, containerRef, controls, state, isReady, isInView, progress } =
    useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
      enter: 'bottom top',
      leave: 'top bottom',
    });

  const p = Math.max(0, Math.min(1, progress));
  const t = p * TOTAL;

  function getRotationX(i: number): number {
    const outStart = i * STEP + DELAY;
    const outEnd = outStart + DUR;
    const inStart = (i - 1) * STEP + DELAY;
    const inEnd = inStart + DUR;

    if (i === 0) {
      if (t <= outStart) return 0;
      if (t >= outEnd) return 90;
      return ((t - outStart) / DUR) * 90;
    }

    if (i === slides.length - 1) {
      if (t <= inStart) return -90;
      if (t >= inEnd) return 0;
      return -90 + ((t - inStart) / DUR) * 90;
    }

    if (t <= inStart) return -90;
    if (t <= inEnd) return -90 + ((t - inStart) / DUR) * 90;
    if (t <= outStart) return 0;
    if (t >= outEnd) return 90;
    return ((t - outStart) / DUR) * 90;
  }

  const activeIndex = Math.round(p * (slides.length - 1));

  return (
    <PreviewCard
      title="On Scroll"
      description="Inner scroller \u00b7 Scrubbed vertical rolodex"
      controls={
        <>
          <DemoButton onClick={() => controls.refresh()} variant="surface" small>
            Refresh
          </DemoButton>
          <span className={cn(
            'landing-font-mono text-[10px]',
            isInView ? 'text-landing-accent' : 'text-landing-muted',
          )}>
            {isReady ? (isInView ? 'Active' : 'Scroll \u2193') : 'Init\u2026'}
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="landing-font-mono text-[9px] tracking-[0.22em] uppercase text-landing-muted/70">
          Scroll inside the panel to scrub the rolodex
        </div>
        <div
          ref={containerRef}
          className="w-full h-52 rounded-xl border border-landing-border border-dashed bg-landing-bg/40 overflow-y-auto overscroll-contain relative"
        >
          <div className="h-16" />
          <div ref={ref} className="relative h-900">
            <div className="sticky top-0 h-52 flex items-center justify-center">
              <div
                className="relative w-full max-w-xs overflow-hidden rounded-xl"
                style={{ perspective: '800px', aspectRatio: '16 / 10' }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={slide.label}
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                    style={{
                      background: slide.bg,
                      transform: `rotateX(${getRotationX(i)}deg)`,
                      transformOrigin: 'center center -80px',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <span className="landing-font-mono text-[9px] tracking-[0.3em] uppercase text-white/60">
                      slide {i + 1}
                    </span>
                    <span className="landing-font-display text-lg mt-1 text-white font-bold">
                      {slide.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-16" />
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-150',
                i === activeIndex ? 'bg-landing-accent' : 'bg-landing-border/40',
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 landing-font-mono text-[9px]">
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Progress</div>
            <div className="text-landing-fg font-medium">{Math.round(p * 100)}%</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Scroll</div>
            <div className="text-landing-fg font-medium">{Math.round(state.scroll)}</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Velocity</div>
            <div className="text-landing-fg font-medium">{state.velocity.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Dir</div>
            <div className={cn('font-medium', state.backward ? 'text-landing-fg' : 'text-landing-accent')}>
              {state.backward ? '\u2190 Back' : 'Fwd \u2192'}
            </div>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-landing-border/30 overflow-hidden">
          <div className="h-full bg-landing-accent transition-none"
            style={{ width: `${p * 100}%` }}
          />
        </div>
      </div>
    </PreviewCard>
  );
});

export const LayoutPreview = memo(function LayoutPreview(_props: PreviewProps) {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const { controls } = useAnime({
    selector: '.layout-item',
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 400,
    ease: 'outQuad',
    delay: 60,
    autoplay: false,
  });

  const handleShuffle = useCallback(() => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setTimeout(() => controls.restart(), 30);
  }, [controls]);

  return (
    <PreviewCard
      title="Layout"
      description="FLIP layout animation"
      controls={
        <DemoButton onClick={handleShuffle} variant="accent" small>
          Shuffle
        </DemoButton>
      }
    >
      <div className="grid grid-cols-2 gap-2 w-28">
        {items.map((n) => (
          <div
            key={n}
            className="layout-item h-7 rounded flex items-center justify-center text-[11px] font-mono"
            style={{
              backgroundColor: `var(--color-landing-card, rgba(255,255,255,0.08))`,
              color: `var(--color-landing-text, #e2e0d9)`,
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});

export const ScopePreview = memo(function ScopePreview(_props: PreviewProps) {
  const [count, setCount] = useState(0);
  const { controls } = useAnime({
    selector: '.scope-dot',
    scale: [
      { to: 1.5, duration: 200 },
      { to: 1, duration: 300 },
    ],
    stagger: 50,
    autoplay: false,
  });

  const handleTrigger = useCallback(() => {
    setCount((c) => c + 1);
    controls.restart();
  }, [controls]);

  return (
    <PreviewCard
      title="Scope"
      description="Scoped animation contexts"
      controls={
        <DemoButton onClick={handleTrigger} variant="accent" small>
          Trigger ({count})
        </DemoButton>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="scope-dot w-8 h-8 rounded-full bg-landing-accent/60" />
        ))}
      </div>
    </PreviewCard>
  );
});

export const SplitTextPreview = memo(function SplitTextPreview(_props: PreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { controls } = useAnime({
    selector: '.split-char',
    translateY: [40, 0],
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    delay: 40,
    ease: 'outBack',
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    if (!ref.current) return;
    const text = 'SplitText';
    ref.current.innerHTML = text
      .split('')
      .map((c) => `<span class="split-char inline-block">${c === ' ' ? '\u00A0' : c}</span>`)
      .join('');
    setPlaying(true);
    setTimeout(() => controls.restart(), 20);
  }, [controls]);

  return (
    <PreviewCard
      title="SplitText"
      description="Character text splitting"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" small>
          Split
        </DemoButton>
      }
    >
      <div
        ref={ref}
        className="text-xl font-semibold tracking-wide h-8 flex items-center justify-center"
        style={{ color: 'var(--color-landing-text, #e2e0d9)' }}
      >
        {!playing && 'SplitText'}
      </div>
    </PreviewCard>
  );
});

export const EasingsPreview = memo(function EasingsPreview(_props: PreviewProps) {
  const [activeEasing, setActiveEasing] = useState('linear');
  const easings = ['linear', 'easeInOutQuad', 'easeOutElastic', 'easeInOutBack', 'spring'];

  const { controls } = useAnime({
    selector: '.easing-dot',
    translateX: 150,
    duration: 1000,
    ease: activeEasing,
    autoplay: false,
    deps: [activeEasing],
  });

  const handleRun = useCallback(
    (easing: string) => {
      setActiveEasing(easing);
      setTimeout(() => controls.restart(), 50);
    },
    [controls]
  );

  return (
    <PreviewCard
      title="Easings"
      description="Cubic bezier, spring, steps"
      controls={easings.map((e) => (
        <DemoButton
          key={e}
          onClick={() => handleRun(e)}
          variant={e === activeEasing ? 'accent' : 'ghost'}
          small
        >
          {e}
        </DemoButton>
      ))}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="relative h-8 w-full">
          <div className="easing-dot w-8 h-8 rounded-full bg-landing-accent shadow-lg absolute top-0 left-0" />
        </div>
      </div>
    </PreviewCard>
  );
});

export const UtilitiesPreview = memo(function UtilitiesPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Utilities" description="Math, random, string, DOM">
      <div className="flex flex-col gap-2 w-full landing-font-mono text-[11px] text-landing-muted">
        <div className="flex justify-between">
          <span>roundPad(3.7, 2)</span>
          <span className="text-landing-accent">03.70</span>
        </div>
        <div className="flex justify-between">
          <span>padStart(&apos;42&apos;, 5, &apos;0&apos;)</span>
          <span className="text-landing-accent">00042</span>
        </div>
        <div className="flex justify-between">
          <span>degToRad(180)</span>
          <span className="text-landing-accent">3.14159</span>
        </div>
        <div className="flex justify-between">
          <span>random(10, 100)</span>
          <span className="text-landing-accent">{Math.floor(Math.random() * 90 + 10)}</span>
        </div>
      </div>
    </PreviewCard>
  );
});

export const AnimePresencePreview = memo(function AnimePresencePreview(_props: PreviewProps) {
  const [show, setShow] = useState(true);
  const { controls: showControls } = useAnime({
    selector: '.presence-item',
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.9, 1],
    duration: 400,
    ease: 'outBack',
    autoplay: false,
  });
  const { controls: hideControls } = useAnime({
    selector: '.presence-item',
    opacity: [1, 0],
    translateY: [0, -10],
    scale: [1, 0.9],
    duration: 250,
    ease: 'inQuad',
    autoplay: false,
  });

  const handleToggle = useCallback(() => {
    if (show) {
      hideControls.restart();
      setTimeout(() => setShow(false), 250);
    } else {
      setShow(true);
      setTimeout(() => showControls.restart(), 30);
    }
  }, [show, showControls, hideControls]);

  return (
    <PreviewCard
      title="Presence"
      description="AnimatePresence"
      controls={
        <DemoButton onClick={handleToggle} variant="accent" small>
          {show ? 'Hide' : 'Show'}
        </DemoButton>
      }
    >
      <div className="w-20 h-16 flex items-center justify-center">
        {show && (
          <div
            className="presence-item w-16 h-12 rounded-lg flex items-center justify-center text-[11px] font-mono"
            style={{
              backgroundColor: 'var(--color-landing-accent, #e2e0d9)',
              color: 'var(--color-landing-bg, #0a0a0a)',
            }}
          >
            Card
          </div>
        )}
      </div>
    </PreviewCard>
  );
});

export const ToggleSwitchPreview = memo(function ToggleSwitchPreview(_props: PreviewProps) {
  const [checked, setChecked] = useState(false);

  return (
    <PreviewCard
      title="Toggle Switch"
      description="Animated toggle"
      controls={
        <DemoButton onClick={() => setChecked((c) => !c)} variant="accent" small>
          {checked ? 'ON' : 'OFF'}
        </DemoButton>
      }
    >
      <ToggleSwitch checked={checked} onChange={setChecked} label="Enable feature" />
    </PreviewCard>
  );
});

export const CounterCountdownPreview = memo(function CounterCountdownPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Counter & Countdown" description="Animated numbers">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-1">
          <Counter from={0} to={10} duration={500} size="lg" />
          <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-widest">
            Counter
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Countdown from={30} format="seconds" size="lg" />
          <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-widest">
            Countdown
          </span>
        </div>
      </div>
    </PreviewCard>
  );
});

export const SpinningCubePreview = memo(function SpinningCubePreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Spinning 3D Cube" description="CSS 3D rotation">
      <SpinningCube size={80} duration={3000} axis="both" />
    </PreviewCard>
  );
});

export const ClipPathRevealPreview = memo(function ClipPathRevealPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="ClipPath Reveal" description="Circle, diamond, wipe">
      <ClipPathReveal shape="circle" duration={1200}>
        <div className="w-full h-32 rounded-xl bg-linear-to-br from-landing-accent to-landing-accent/40 flex items-center justify-center">
          <span className="landing-font-display text-lg text-landing-bg font-bold">Revealed</span>
        </div>
      </ClipPathReveal>
    </PreviewCard>
  );
});

export const AnimatedSliderPreview = memo(function AnimatedSliderPreview(_props: PreviewProps) {
  const slides = [
    { title: 'Animate', gradient: 'from-landing-accent to-landing-accent/50', icon: 'A' },
    { title: 'Timeline', gradient: 'from-landing-accent/80 to-landing-accent/30', icon: 'T' },
    { title: 'Draggable', gradient: 'from-landing-accent/60 to-landing-accent/20', icon: 'D' },
  ];

  return (
    <PreviewCard title="Animated Slider" description="Slide transitions">
      <AnimatedSlider items={slides} loop dots arrows={false}>
        {(item) => (
          <div
            className={cn(
              'w-full h-32 rounded-xl bg-linear-to-br flex items-center justify-center',
              item.gradient
            )}
          >
            <span className="landing-font-display text-2xl text-landing-bg font-bold">
              {item.icon}
            </span>
          </div>
        )}
      </AnimatedSlider>
    </PreviewCard>
  );
});

export const ReorderListPreview = memo(function ReorderListPreview(_props: PreviewProps) {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const { controls } = useAnime({
    selector: '.reorder-item',
    translateY: [12, 0],
    opacity: [0, 1],
    duration: 300,
    ease: 'outQuad',
    delay: 50,
    autoplay: false,
  });

  const handleShuffle = useCallback(() => {
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setTimeout(() => controls.restart(), 20);
  }, [controls]);

  return (
    <PreviewCard
      title="Reorder List"
      description="FLIP list reorder"
      controls={
        <DemoButton onClick={handleShuffle} variant="accent" small>
          Shuffle
        </DemoButton>
      }
    >
      <div className="flex flex-col gap-1.5 w-24">
        {items.map((n) => (
          <div
            key={n}
            className="reorder-item h-5 rounded flex items-center justify-center text-[10px] font-mono"
            style={{
              backgroundColor: `var(--color-landing-card, rgba(255,255,255,0.08))`,
              color: 'var(--color-landing-text, #e2e0d9)',
            }}
          >
            Item {n}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});

export const ScrollLinkedAnimationsPreview = memo(function ScrollLinkedAnimationsPreview(
  _props: PreviewProps
) {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  const { controls: ctrl1 } = useAnime({
    targets: box1Ref,
    translateX: [
      { to: 80, duration: 500 },
      { to: 0, duration: 400 },
    ],
    opacity: [
      { to: 1, duration: 300 },
      { to: 0, duration: 300 },
    ],
    autoplay: false,
  });
  const { controls: ctrl2 } = useAnime({
    targets: box2Ref,
    translateX: [
      { to: 120, duration: 600 },
      { to: 0, duration: 500 },
    ],
    opacity: [
      { to: 1, duration: 400 },
      { to: 0, duration: 300 },
    ],
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    ctrl1.restart();
    setTimeout(() => ctrl2.restart(), 200);
  }, [ctrl1, ctrl2]);

  return (
    <PreviewCard
      title="Scroll-Linked Animations"
      description="Parallax, fade-in, scrub"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" small>
          Play
        </DemoButton>
      }
    >
      <div className="w-full h-40 rounded-xl border border-landing-border bg-landing-bg/40 p-4 space-y-4">
        <div className="h-10" />
        <div ref={box1Ref} className="w-10 h-10 rounded-lg bg-landing-accent" />
        <div className="h-10" />
        <div ref={box2Ref} className="w-10 h-10 rounded-lg bg-landing-accent/60" />
        <div className="h-10" />
      </div>
    </PreviewCard>
  );
});

export const ScrambleTextPreview = memo(function ScrambleTextPreview(_props: PreviewProps) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const texts = ['Hello World!', 'Scramble Text', 'React AnimeJS', 'Animation Magic'];
  const [idx, setIdx] = useState(0);

  const { rescramble, isReady } = useAnimeScramble({
    target: targetRef,
    params: { text: texts[idx] },
    autoplay: false,
  });

  const handleChange = useCallback(() => {
    const next = (idx + 1) % texts.length;
    setIdx(next);
    setTimeout(() => rescramble(), 50);
  }, [idx, texts.length, rescramble]);

  return (
    <PreviewCard
      title="Scramble Text"
      description="Text scramble/reveal effect"
      controls={
        <DemoButton onClick={handleChange} variant="accent" small>
          {isReady ? 'Change' : 'Start'}
        </DemoButton>
      }
    >
      <p
        ref={targetRef}
        className="landing-font-display text-lg text-landing-accent text-center min-h-8"
      >
        {!isReady ? 'Click Change to start' : ''}
      </p>
    </PreviewCard>
  );
});

export const AnimatablePreview = memo(function AnimatablePreview(_props: PreviewProps) {
  const cubeRef = useRef<HTMLDivElement>(null);

  const { animatable, isReady } = useAnimatable(
    {
      x: { duration: 800, ease: 'inOutQuad' },
    },
    cubeRef
  );

  const handleMoveRight = useCallback(() => {
    if (animatable.current && isReady) {
      (animatable.current as any).x(100);
    }
  }, [animatable, isReady]);

  const handleReset = useCallback(() => {
    if (animatable.current && isReady) {
      (animatable.current as any).x(0);
    }
  }, [animatable, isReady]);

  return (
    <PreviewCard
      title="UseAnimatable"
      description="Reactive animation state"
      controls={
        <>
          <DemoButton onClick={handleMoveRight} variant="accent" small>
            Move \u2192
          </DemoButton>
          <DemoButton onClick={handleReset} variant="surface" small>
            \u2190 Reset
          </DemoButton>
        </>
      }
    >
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="relative w-full h-12 flex items-center">
          <div ref={cubeRef} className="w-10 h-10 rounded-lg bg-landing-accent shadow-lg" />
        </div>
        <span className="landing-font-mono text-[10px] text-landing-muted">
          {isReady ? 'Ready \u2014 use buttons to animate' : 'Initializing...'}
        </span>
      </div>
    </PreviewCard>
  );
});

function mapGroup(
  ids: string[],
  component: React.FC<PreviewProps>
): Record<string, React.FC<PreviewProps>> {
  return Object.fromEntries(ids.map((id) => [id, component]));
}

export const previewRegistry: Record<string, React.FC<PreviewProps>> = {
  ...mapGroup(['basic-animation'], BasicAnimationPreview),
  ...mapGroup(['svg-morph'], SvgMorphPreview),
  ...mapGroup(['svg-draw'], SvgDrawPreview),
  ...mapGroup(['svg-motion-path'], SvgMotionPathPreview),
  ...mapGroup(['timer'], TimersPreview),
  ...mapGroup(['timeline'], TimelinesPreview),
  ...mapGroup(['draggable'], DraggablePreview),
  ...mapGroup(['on-scroll'], OnScrollPreview),
  ...mapGroup(['layout'], LayoutPreview),
  ...mapGroup(['scope'], ScopePreview),
  ...mapGroup(['split-text'], SplitTextPreview),
  ...mapGroup(['easings'], EasingsPreview),
  ...mapGroup(['utilities'], UtilitiesPreview),
  ...mapGroup(['animate-presence'], AnimePresencePreview),
  ...mapGroup(['toggle-switch'], ToggleSwitchPreview),
  ...mapGroup(['counter-countdown'], CounterCountdownPreview),
  ...mapGroup(['spinning-cube'], SpinningCubePreview),
  ...mapGroup(['clippath-reveal'], ClipPathRevealPreview),
  ...mapGroup(['animated-slider'], AnimatedSliderPreview),
  ...mapGroup(['reorder-list'], ReorderListPreview),
  ...mapGroup(['scroll-linked-animations'], ScrollLinkedAnimationsPreview),
  ...mapGroup(['scramble-text'], ScrambleTextPreview),
  ...mapGroup(['animatable'], AnimatablePreview),
};

export function getDemoPreview(componentId: string): React.FC<PreviewProps> | undefined {
  return previewRegistry[componentId];
}
