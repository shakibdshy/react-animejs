/**
 * AnimatedContinuousSections — an Anime.js port of the layered section demo.
 *
 * Every scene is fixed to the stage. A single gesture advances one scene,
 * while the incoming outer/inner wrappers counter-slide and the complete
 * background scene parallax-shifts behind the split heading.
 */
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { animeStagger, createTimeline, SplitText } from '@/lib/react-animejs';
import type { SplitTextRef } from '@/lib/react-animejs/components';

const PANEL_HEIGHT = 'min(78vh, 620px)';
const SCENE_DURATION = 1250;

type Section = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
};

const sectionImage = (id: string, start: string, end: string, accent: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
      <defs>
        <linearGradient id="sky-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${start}"/><stop offset="1" stop-color="${end}"/>
        </linearGradient>
        <radialGradient id="halo-${id}" cx="72%" cy="24%" r="55%">
          <stop offset="0" stop-color="${accent}" stop-opacity=".88"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain-${id}"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .14"/></feComponentTransfer></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#sky-${id})"/>
      <rect width="1600" height="1000" fill="url(#halo-${id})"/>
      <path d="M0 610 C260 475 430 665 690 540 S1120 420 1600 570 V1000 H0Z" fill="#080d15" fill-opacity=".74"/>
      <path d="M0 720 C220 605 390 780 660 670 S1080 560 1600 700" fill="none" stroke="${accent}" stroke-opacity=".62" stroke-width="18"/>
      <path d="M0 790 C270 680 420 850 740 740 S1180 650 1600 770" fill="none" stroke="#ffffff" stroke-opacity=".2" stroke-width="4"/>
      <circle cx="310" cy="260" r="110" fill="${accent}" opacity=".12"/><circle cx="310" cy="260" r="64" fill="${accent}" opacity=".22"/>
      <path d="M100 260H520M140 310H480M180 360H440" stroke="#fff" stroke-opacity=".22" stroke-width="3"/>
      <rect width="1600" height="1000" filter="url(#grain-${id})" opacity=".36"/>
    </svg>
  `)}`;

const SECTIONS: Section[] = [
  {
    eyebrow: '01 / First signal',
    title: 'Scroll down',
    copy: 'A new section arrives as one continuous motion.',
    image: sectionImage('signal', '#0b1b2a', '#24475b', '#8ee8ff'),
  },
  {
    eyebrow: '02 / Motion study',
    title: 'Animated with Anime.js',
    copy: 'The outgoing scene gives way to the next layered frame.',
    image: sectionImage('momentum', '#32180f', '#824e2d', '#ffc27b'),
  },
  {
    eyebrow: '03 / Split signal',
    title: 'react-animejs',
    copy: 'Each character settles independently as the scene arrives.',
    image: sectionImage('characters', '#24132f', '#624080', '#f39cff'),
  },
  {
    eyebrow: '04 / Quiet frame',
    title: 'Animation platform',
    copy: 'The stage remains pinned while the story moves forward.',
    image: sectionImage('quiet', '#0c2822', '#286353', '#8ff0b4'),
  },
  {
    eyebrow: '05 / Landing',
    title: 'Keep scrolling',
    copy: 'The sequence wraps after the final scene.',
    image: sectionImage('landing', '#2f121c', '#713445', '#ff8e8e'),
  },
];

export interface AnimatedContinuousSectionsProps {
  className?: string;
}

export const AnimatedContinuousSections = memo(function AnimatedContinuousSections({
  className = '',
}: AnimatedContinuousSectionsProps) {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const outerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const innerRefs = useRef<Array<HTMLDivElement | null>>([]);
  // The parallax target is the full background scene, including its heading.
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const splitRefs = useRef<Array<SplitTextRef | null>>([]);
  const activeIndexRef = useRef(-1);
  const animatingRef = useRef(false);
  const splitReadyRef = useRef(0);
  const initialStartedRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);
  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const resetSections = useCallback(() => {
    sectionRefs.current.forEach((section, index) => {
      const outer = outerRefs.current[index];
      const inner = innerRefs.current[index];
      const scene = sceneRefs.current[index];
      if (!section || !outer || !inner || !scene) return;

      section.style.opacity = '0';
      section.style.visibility = 'hidden';
      section.style.zIndex = '0';
      outer.style.transform = 'translateY(100%)';
      inner.style.transform = 'translateY(-100%)';
      scene.style.transform = 'translateY(15%)';

      const chars = (splitRefs.current[index]?.split?.chars as HTMLElement[] | undefined) ?? [];
      chars.forEach((char) => {
        char.style.opacity = '0';
        char.style.transform = 'translateY(150%)';
        char.style.willChange = 'transform, opacity';
      });
    });
  }, []);

  const playSection = useCallback((index: number, direction: 1 | -1) => {
    const currentIndex = activeIndexRef.current;
    const current = currentIndex >= 0 ? sectionRefs.current[currentIndex] : null;
    const currentScene = currentIndex >= 0 ? sceneRefs.current[currentIndex] : null;
    const next = sectionRefs.current[index];
    const nextOuter = outerRefs.current[index];
    const nextInner = innerRefs.current[index];
    const nextScene = sceneRefs.current[index];
    if (!next || !nextOuter || !nextInner || !nextScene) return;

    timelineRef.current?.pause();
    const dFactor = direction === -1 ? -1 : 1;
    const chars = (splitRefs.current[index]?.split?.chars as HTMLElement[] | undefined) ?? [];

    animatingRef.current = true;
    if (current) current.style.zIndex = '0';
    next.style.opacity = '1';
    next.style.visibility = 'visible';
    next.style.zIndex = '1';
    nextOuter.style.transform = `translateY(${100 * dFactor}%)`;
    nextInner.style.transform = `translateY(${-100 * dFactor}%)`;
    nextScene.style.transform = `translateY(${15 * dFactor}%)`;
    chars.forEach((char) => {
      char.style.opacity = '0';
      char.style.transform = `translateY(${150 * dFactor}%)`;
    });

    const timeline = createTimeline({
      autoplay: false,
      defaults: { duration: SCENE_DURATION, ease: 'inOutQuad' },
      onComplete: () => {
        if (current) {
          current.style.opacity = '0';
          current.style.visibility = 'hidden';
          current.style.zIndex = '0';
        }
        activeIndexRef.current = index;
        setActiveIndex(index);
        animatingRef.current = false;
        timelineRef.current = null;
      },
    });

    // The reference only parallax-shifts the old scene; the incoming pair is
    // responsible for the visible layered slide.
    if (currentScene) {
      timeline.add(currentScene, { translateY: `${-15 * dFactor}%` }, 0);
    }
    timeline
      .add(nextOuter, { translateY: [`${100 * dFactor}%`, '0%'] }, 0)
      .add(nextInner, { translateY: [`${-100 * dFactor}%`, '0%'] }, 0)
      .add(nextScene, { translateY: [`${15 * dFactor}%`, '0%'] }, 0);

    if (chars.length > 0) {
      timeline.add(
        chars,
        {
          opacity: [0, 1],
          translateY: [`${150 * dFactor}%`, '0%'],
          duration: 1000,
          ease: 'outQuad',
          stagger: animeStagger(20, { from: 'random' }),
        },
        200
      );
    }

    timelineRef.current = timeline;
    timeline.play();
  }, []);

  const handleSplitReady = useCallback(
    (index: number) => {
      splitReadyRef.current += 1;
      if (index === 0 || splitReadyRef.current === SECTIONS.length) resetSections();
      if (splitReadyRef.current === SECTIONS.length && !initialStartedRef.current) {
        initialStartedRef.current = true;
        setReady(true);
        playSection(0, 1);
      }
    },
    [playSection, resetSections]
  );

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(resetSections);
    return () => window.cancelAnimationFrame(frame);
  }, [resetSections]);

  useEffect(() => {
    return () => {
      timelineRef.current?.pause();
      timelineRef.current?.revert();
    };
  }, []);

  const gotoSection = useCallback(
    (direction: 1 | -1) => {
      if (!ready || animatingRef.current || activeIndexRef.current < 0) return;
      const nextIndex = (activeIndexRef.current + direction + SECTIONS.length) % SECTIONS.length;
      playSection(nextIndex, direction);
    },
    [playSection, ready]
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 10) return;
      gotoSection(event.deltaY > 0 ? 1 : -1);
    },
    [gotoSection]
  );

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    touchStartRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (start === null) return;
      const distance = start - event.clientY;
      if (Math.abs(distance) >= 32) gotoSection(distance > 0 ? 1 : -1);
    },
    [gotoSection]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        gotoSection(1);
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        gotoSection(-1);
      }
    },
    [gotoSection]
  );

  const section = SECTIONS[activeIndex];
  const progress = ((activeIndex + 1) / SECTIONS.length) * 100;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      <div
        tabIndex={0}
        aria-label="Animated continuous sections"
        className="relative overflow-hidden overscroll-contain bg-[#07090c] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-landing-accent"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ height: PANEL_HEIGHT, touchAction: 'none' }}
      >
        <div className="relative h-full overflow-hidden">
          {SECTIONS.map((item, index) => (
            <div
              key={item.eyebrow}
              ref={(node) => {
                sectionRefs.current[index] = node;
              }}
              className="absolute inset-0 overflow-hidden"
              style={{ opacity: 0, visibility: 'hidden', zIndex: 0 }}
            >
              <div
                ref={(node) => {
                  outerRefs.current[index] = node;
                }}
                className="absolute inset-0 overflow-hidden will-change-transform"
              >
                <div
                  ref={(node) => {
                    innerRefs.current[index] = node;
                  }}
                  className="absolute inset-0 overflow-hidden will-change-transform"
                >
                  <div
                    ref={(node) => {
                      sceneRefs.current[index] = node;
                    }}
                    className="absolute inset-0 flex items-center justify-center overflow-hidden will-change-transform"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-black/55" />
                    <div className="relative z-10 w-[90%] max-w-6xl overflow-hidden text-center">
                      <SplitText
                        ref={(instance) => {
                          splitRefs.current[index] = instance;
                        }}
                        params={{
                          lines: { wrap: true },
                          words: { wrap: true },
                          chars: true,
                        }}
                        onReady={() => handleSplitReady(index)}
                      >
                        <h2 className="landing-font-display m-0 text-5xl font-semibold leading-[1.15] tracking-[-0.04em] text-white sm:text-7xl lg:text-[clamp(4rem,8vw,8rem)]">
                          {item.title}
                        </h2>
                      </SplitText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pointer-events-none absolute bottom-5 right-5 z-30 flex items-center gap-2 sm:bottom-8 sm:right-8">
            <ChevronDown className="h-4 w-4 animate-bounce text-white/55" />
            <span className="landing-font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
              scroll inside
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-landing-surface/70 px-5 py-4 sm:px-8">
        <div>
          <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-landing-muted/75">
            observer gesture · layered scene · finite
          </span>
          <p className="mt-1 text-xs text-landing-muted/55">{section.eyebrow}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1 w-28 overflow-hidden rounded-full bg-landing-border/50">
            <div
              className="h-full rounded-full bg-landing-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="landing-font-mono text-[10px] tabular-nums text-landing-muted/70">
            {String(activeIndex + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
});

export default AnimatedContinuousSections;
