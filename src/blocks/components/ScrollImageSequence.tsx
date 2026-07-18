/**
 * ScrollImageSequence — A port of GSAP's scroll-based image sequence animation.
 *
 * Preloads a series of 147 AirPods Pro images and renders them to an HTML5 canvas.
 * Ties the active frame to the scroll position using the `react-animejs` library.
 * Features:
 *   1. Self-contained scroll tracking (scoped container scroll).
 *   2. Dual modes: Scroll-Scrub (Direct/Smooth sync) and Autoplay.
 *   3. Scrollytelling card overlays that fade/drift into view at specific frame ranges.
 *   4. Direct-DOM manipulation in the update loop for peak 60fps rendering.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, Cpu, Layers, Pause, Play, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { useAnime, useAnimeOnScroll } from '@/lib/react-animejs';

const FRAME_COUNT = 147;
const IMAGE_WIDTH = 1158;
const IMAGE_HEIGHT = 770;
const PRELOAD_CONCURRENCY = 8;
const STORY_FADE_FRAMES = 6;
const INSTRUCTION_FADE_END = 12;

const getFrameUrl = (index: number) => {
  return `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
    index + 1
  )
    .toString()
    .padStart(4, '0')}.jpg`;
};

// Define the scrollytelling cards
type StoryCard = {
  start: number;
  end: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  desc: string;
};

const STORY_CARDS: StoryCard[] = [
  {
    start: 8,
    end: 38,
    title: 'AirPods Pro',
    subtitle: 'Redesigned for Magic',
    icon: Sparkles,
    desc: 'An immersive listening experience with active noise cancellation, customizable fit, and sweat/water resistance.',
  },
  {
    start: 42,
    end: 72,
    title: 'Active Noise Cancellation',
    subtitle: 'Silence is Golden',
    icon: Volume2,
    desc: 'Outward-facing microphones detect external sound, counteracting it with anti-noise before you hear it.',
  },
  {
    start: 76,
    end: 106,
    title: 'Immersive Sound Architecture',
    subtitle: 'H1 Chip Power',
    icon: Cpu,
    desc: 'The H1 chip delivers incredibly low audio latency, real-time noise processing, and custom high-excursion drivers.',
  },
  {
    start: 110,
    end: 140,
    title: 'Wireless Charging Case',
    subtitle: 'Non-stop Playback',
    icon: Layers,
    desc: 'Keep the music going with multiple charges in your pocket. Compatible with Qi-certified wireless chargers.',
  },
];

export const ScrollImageSequence = memo(function ScrollImageSequence({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preloadTriggerRef = useRef<HTMLDivElement>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // Direct DOM refs for performance (bypasses React renders during scroll/play loops)
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const instructionRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // States
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadError, setPreloadError] = useState(false);
  const [preloadAttempt, setPreloadAttempt] = useState(0);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [syncMode, setSyncMode] = useState<'scroll' | 'autoplay'>('scroll');
  const [syncType, setSyncType] = useState<'direct' | 'smooth'>('smooth');
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay toggle state
  const [autoplaySpeed, setAutoplaySpeed] = useState<1 | 1.5 | 2>(1);

  // Playhead target for AnimeJS tweening
  const playhead = useMemo(() => ({ frame: 0 }), []);

  // Frame drawing handler
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = loadedImagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const imgRatio = IMAGE_WIDTH / IMAGE_HEIGHT;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let drawX = 0;
    let drawY = 0;

    // Cover-fit logic inside the canvas context
    if (imgRatio > canvasRatio) {
      drawWidth = height * imgRatio;
      drawX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / imgRatio;
      drawY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Frame update tick (drives canvas rendering + HUD/overlay updates)
  const handleFrameUpdate = useCallback(
    (frameVal: number) => {
      const roundedIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frameVal)));
      currentFrameRef.current = roundedIndex;
      drawFrame(roundedIndex);

      // Update scrollytelling card opacities directly (peak performance, 0 component renders)
      STORY_CARDS.forEach((card, idx) => {
        const el = overlayRefs.current[idx];
        if (!el) return;

        let opacity = 0;

        if (roundedIndex >= card.start && roundedIndex <= card.end) {
          if (roundedIndex < card.start + STORY_FADE_FRAMES) {
            opacity = (roundedIndex - card.start) / STORY_FADE_FRAMES;
          } else if (roundedIndex > card.end - STORY_FADE_FRAMES) {
            opacity = (card.end - roundedIndex) / STORY_FADE_FRAMES;
          } else {
            opacity = 1;
          }
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 16}px) translate(-50%, -50%)`;
        el.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
      });

      // The initial instruction should guide the first movement, not compete
      // with every story card for the entire sequence.
      if (instructionRef.current) {
        instructionRef.current.style.opacity = String(
          Math.max(0, 1 - roundedIndex / INSTRUCTION_FADE_END)
        );
      }

      // Update progress HUD elements directly
      const percent = Math.round((roundedIndex / (FRAME_COUNT - 1)) * 100);
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${percent}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${percent}%`;
      }
    },
    [drawFrame]
  );

  // Main AnimeJS animation definition
  const {
    animation,
    controls,
    isReady: isAnimeReady,
  } = useAnime({
    targets: playhead,
    frame: FRAME_COUNT - 1,
    duration: 3500,
    ease: 'linear',
    autoplay: false,
    // A scroll range represents exactly one pass through the image sequence.
    // Only autoplay should loop back to the first frame.
    loop: syncMode === 'autoplay',
    onUpdate: () => {
      handleFrameUpdate(playhead.frame);
    },
  });

  // Canvas Resize Handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 800;
    const height = parent?.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Force redraw of current frame
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Delay the expensive image sequence until the block is near the viewport.
  useEffect(() => {
    const trigger = preloadTriggerRef.current;
    if (!trigger) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldPreload(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldPreload(true);
        observer.disconnect();
      },
      { rootMargin: '500px 0px' },
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  // Image preloading effect
  useEffect(() => {
    if (!shouldPreload) return;
    let isMounted = true;
    let loaded = 0;
    let nextFrame = 0;
    const images = Array<HTMLImageElement>(FRAME_COUNT);

    setIsPreloaded(false);
    setPreloadError(false);
    setPreloadProgress(0);
    loadedImagesRef.current = images;

    const loadNextFrame = () => {
      if (!isMounted || nextFrame >= FRAME_COUNT) return;

      const index = nextFrame++;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';

      img.onload = () => {
        if (!isMounted) return;

        images[index] = img;
        loaded++;
        setPreloadProgress(Math.round((loaded / FRAME_COUNT) * 100));

        if (loaded === FRAME_COUNT) {
          setIsPreloaded(true);
          return;
        }

        loadNextFrame();
      };

      img.onerror = () => {
        if (!isMounted) return;

        // Do not unlock scrolling with missing frames. It leaves the canvas
        // displaying the previous frame while the copy keeps advancing.
        setPreloadError(true);
      };

      img.src = getFrameUrl(index);
    };

    for (let i = 0; i < Math.min(PRELOAD_CONCURRENCY, FRAME_COUNT); i++) {
      loadNextFrame();
    }

    return () => {
      isMounted = false;
    };
  }, [preloadAttempt, shouldPreload]);

  // ResizeObserver binding
  useEffect(() => {
    if (!isPreloaded) return;

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isPreloaded, handleResize]);

  // Scroll Sync Binding
  const syncValue = syncMode === 'scroll' ? (syncType === 'smooth' ? 0.3 : true) : false;

  const { ref: scrollObserverRef } = useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
    container: containerRef,
    linked: animation,
    sync: syncValue,
    enter: { target: 'top', container: 'top' },
    leave: { target: 'bottom', container: 'bottom' },
    enabled: isPreloaded && syncMode === 'scroll',
  });

  // Autoplay State Handler
  useEffect(() => {
    if (!isPreloaded || !isAnimeReady) return;

    if (syncMode === 'autoplay') {
      controls.setPlaybackRate(isPlaying ? autoplaySpeed : 0);
      if (isPlaying) {
        controls.play();
      } else {
        controls.pause();
      }
    } else {
      // Pause manual player so ScrollObserver takes complete ownership
      controls.pause();
    }
  }, [syncMode, isPlaying, autoplaySpeed, isPreloaded, isAnimeReady, controls]);

  // Restart sequence helper
  const handleRestart = useCallback(() => {
    if (!isAnimeReady) return;
    controls.seek(0);
    if (syncMode === 'autoplay' && isPlaying) {
      controls.play();
    }
  }, [controls, syncMode, isPlaying, isAnimeReady]);

  return (
    <div
      ref={preloadTriggerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-[#060707] text-landing-fg ${className}`}
    >
      {/* ── LOADER OVERLAY ── */}
      {!isPreloaded && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="relative flex items-center justify-center h-24 w-24">
            {/* Spinning background glow */}
            <div className="absolute inset-0 rounded-full border border-white/5 bg-radial-to-r from-landing-accent/20 to-transparent animate-pulse" />
            {/* Circular tracking track */}
            <svg className="absolute h-20 w-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="var(--color-landing-accent, #6366f1)"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 * (1 - preloadProgress / 100)}
                className="transition-all duration-200 ease-out"
              />
            </svg>
            <span className="landing-font-mono text-xs font-semibold text-white tracking-wider">
              {preloadProgress}%
            </span>
          </div>
          {preloadError ? (
            <div className="mt-4 flex flex-col items-center gap-3">
              <p className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
                Unable to load the image sequence.
              </p>
              <button
                onClick={() => setPreloadAttempt((attempt) => attempt + 1)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : (
            <p className="landing-font-mono mt-4 text-[10px] tracking-[0.25em] uppercase text-white/50 animate-pulse">
              Preloading 147 frames
            </p>
          )}
        </div>
      )}

      {/* ── INNER SCROLLER (Self-contained) ── */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Scroll-driven image sequence"
        className="relative w-full overflow-y-auto"
        style={{ height: 'min(72vh, 640px)' }}
      >
        {/* Scroll Track: height regulates the scroll speed */}
        <div
          ref={scrollObserverRef}
          className="relative"
          style={{ height: syncMode === 'scroll' ? '280%' : '100%' }}
        >
          {/* Sticky stage (pins the canvas element during the scroll scrub) */}
          <div
            className="sticky top-0 w-full overflow-hidden bg-[#060707]"
            style={{ height: 'min(72vh, 640px)' }}
          >
            {/* Canvas viewport */}
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

            {/* Ambient vignette layers */}
            <div className="pointer-events-none absolute inset-0 bg-radial-to-c from-transparent via-black/20 to-black/60" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#060707]/90 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#060707]/90 to-transparent" />

            {/* ── SCROLLYTELLING OVERLAY CARDS ── */}
            {STORY_CARDS.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    overlayRefs.current[idx] = el;
                  }}
                  className="absolute left-1/2 top-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center p-6 text-center opacity-0 pointer-events-none"
                  style={{
                    willChange: 'opacity, transform',
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg">
                    <CardIcon className="h-6 w-6 text-landing-accent" />
                  </div>
                  <h4 className="landing-font-display mt-4 text-xl font-bold tracking-tight text-white md:text-2xl drop-shadow">
                    {card.title}
                  </h4>
                  <p className="landing-font-mono mt-1 text-[10px] tracking-[0.2em] uppercase text-landing-accent drop-shadow">
                    {card.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 drop-shadow-md">
                    {card.desc}
                  </p>
                </div>
              );
            })}

            {/* Instruction Overlay */}
            <div
              ref={instructionRef}
              className="pointer-events-none absolute inset-x-0 top-5 text-center"
              style={{ willChange: 'opacity' }}
            >
              <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
                Image Sequence · {syncMode === 'scroll' ? 'Scroll-Scrub' : 'Autoplay'}
              </p>
              <h3 className="landing-font-display mt-2 text-base font-bold text-white/90 drop-shadow">
                {syncMode === 'scroll'
                  ? 'Scroll the card container to animate the model'
                  : 'Playing sequence dynamically'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ── HUD / CONTROL BAR ── */}
      <div className="flex flex-col gap-4 border-t border-landing-border/40 bg-[#090b0b] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Toggle Mode */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/5">
            <button
              onClick={() => setSyncMode('scroll')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                syncMode === 'scroll'
                  ? 'bg-landing-accent text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Scroll Scrub
            </button>
            <button
              onClick={() => setSyncMode('autoplay')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                syncMode === 'autoplay'
                  ? 'bg-landing-accent text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Autoplay
            </button>
          </div>

          {/* Sync Controls (Scroll Mode) */}
          {syncMode === 'scroll' && (
            <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/5">
              <button
                onClick={() => setSyncType('direct')}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  syncType === 'direct'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                title="Exact scroll alignment"
              >
                Direct
              </button>
              <button
                onClick={() => setSyncType('smooth')}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                  syncType === 'smooth'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                title="Smoothed inertial alignment"
              >
                Smooth
              </button>
            </div>
          )}

          {/* Playback Controls (Autoplay Mode) */}
          {syncMode === 'autoplay' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying((playing) => !playing)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 border border-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={handleRestart}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 border border-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                title="Restart Sequence"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/5">
                {([1, 1.5, 2] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAutoplaySpeed(speed)}
                    className={`rounded-md px-2 py-1 text-[10px] font-mono tracking-tight transition-all ${
                      autoplaySpeed === speed
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scroll/Timeline status indicators */}
        <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-landing-accent animate-pulse" />
            <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
              {syncMode === 'scroll' ? 'scroll inside box to scrub' : 'playing loop sequence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic scroll progress HUD */}
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/5 border border-white/5">
              <div
                ref={progressFillRef}
                className="h-full rounded-full bg-landing-accent transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
            <span
              ref={progressTextRef}
              className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70 tabular-nums min-w-8 text-right"
            >
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScrollImageSequence;
