import { useEffect, useMemo, useRef, useState } from "react";
import type { ScrollObserver } from "animejs";
import { ArrowDown, RefreshCw, Waves, Zap } from "lucide-react";
import { useAnime, useAnimeOnScroll } from "@/lib/react-animejs";
import { DemoCard } from "./DemoCard";
import { DemoSection } from "./DemoSection";

type DemoScrollObserverSnapshot = {
  progress: number;
  velocity: number;
  backward: boolean;
  isInView: boolean;
  offsetStart: number;
  offsetEnd: number;
};

const DEFAULT_SCROLL_OBSERVER_SNAPSHOT: DemoScrollObserverSnapshot = {
  progress: 0,
  velocity: 0,
  backward: false,
  isInView: false,
  offsetStart: 0,
  offsetEnd: 0,
};

function toObserverSnapshot(observer: {
  progress?: number;
  velocity?: number;
  backward?: boolean;
  isInView?: boolean;
  offsetStart?: number;
  offsetEnd?: number;
}): DemoScrollObserverSnapshot {
  return {
    progress: observer.progress ?? 0,
    velocity: observer.velocity ?? 0,
    backward: observer.backward ?? false,
    isInView: observer.isInView ?? false,
    offsetStart: observer.offsetStart ?? 0,
    offsetEnd: observer.offsetEnd ?? 0,
  };
}

function ScrollHint() {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
      <ArrowDown className="h-3.5 w-3.5 text-demo-accent" />
      Scroll the inner panel
    </div>
  );
}

function ScrollPlaybackDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const {
    ref,
    scrollObserver,
    controls: animationControls,
    isPlaying,
    isReady,
    state,
  } = useAnime<HTMLDivElement>({
    translateX: [0, 180],
    rotate: ["0deg", "1turn"],
    scale: [1, 1.12, 1],
    duration: 1600,
    ease: "inOutExpo",
    autoplay: {
      container: containerRef,
      sync: "play pause reverse reset",
      enter: "bottom center",
      leave: "top center",
      onEnter: (observer) => setObserverState(toObserverSnapshot(observer)),
      onLeave: (observer) => setObserverState(toObserverSnapshot(observer)),
      onUpdate: (observer) => setObserverState(toObserverSnapshot(observer)),
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  return (
    <DemoCard
      title="onscroll play / pause"
      description="Drive a regular useAnime animation with native ScrollObserver method sync through the autoplay parameter."
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => scrollObserver.current?.refresh()}
            className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
            title="Refresh observer"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => animationControls.restart()}
            className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-demo-accent rounded-lg transition-all"
            title="Restart animation"
          >
            <Zap size={16} />
          </button>
        </div>
      }
      controls={{
        play: () => animationControls.play(),
        pause: () => animationControls.pause(),
        restart: () => animationControls.restart(),
      }}
      state={{ progress: observerState.progress }}
      isPlaying={isPlaying}
      code={`useAnime({
  autoplay: {
    sync: "play pause reverse reset",
    enter: "bottom center",
    leave: "top center",
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#101019] to-[#09090e]"
        >
          <div className="flex h-120 flex-col items-center justify-between px-5 py-6">
            <div className="text-center text-xs text-demo-text-muted">
              Scroll until the yellow chip reaches the middle band
            </div>

            <div className="relative flex w-full items-center justify-center">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 rounded-2xl border border-dashed border-demo-accent/35 bg-demo-accent/5" />
              <div
                ref={ref}
                className="relative z-10 flex h-18 w-18 items-center justify-center rounded-3xl bg-linear-to-br from-demo-accent to-[#ff8c37] text-xs font-black uppercase tracking-[0.2em] text-demo-bg shadow-[0_12px_40px_rgba(255,209,26,0.25)]"
              >
                Spin
              </div>
            </div>

            <div className="text-center text-xs text-demo-text-muted">
              Leaving the zone pauses or reverses based on scroll direction
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            in view:{" "}
            <span
              className={
                observerState.isInView ? "text-emerald-400" : "text-slate-300"
              }
            >
              {String(observerState.isInView)}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            direction:{" "}
            <span className="text-cyan-400">
              {observerState.backward ? "backward" : "forward"}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            observer:{" "}
            <span className="text-demo-accent">
              {Math.round(observerState.progress * 100)}%
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            velocity:{" "}
            <span className="text-fuchsia-400">
              {observerState.velocity.toFixed(2)}
            </span>
          </div>
          <div className="col-span-2 rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            animation:{" "}
            <span className="text-slate-300">
              {Math.round(state.progress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

function ScrollScrubDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const { ref, scrollObserver, isReady } = useAnime<HTMLDivElement>({
    scale: [0.72, 1.18],
    rotate: ["-15deg", "15deg"],
    borderRadius: ["24px", "40px"],
    duration: 1800,
    ease: "linear",
    autoplay: {
      container: containerRef,
      sync: true,
      enter: "bottom top",
      leave: "top bottom",
      onEnter: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
      onLeave: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
      onUpdate: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  const glow = useMemo(() => {
    const progress = Math.max(0, Math.min(1, observerState.progress));
    return `rgba(34, 211, 238, ${0.12 + progress * 0.35})`;
  }, [observerState.progress]);

  return (
    <DemoCard
      title="onscroll scrub"
      description="Use the official autoplay ScrollObserver path for exact playback-progress sync, so scroll distance scrubs frame by frame."
      actions={
        <button
          onClick={() => scrollObserver.current?.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <Waves size={16} />
        </button>
      }
      state={{ progress: observerState.progress }}
      code={`useAnime({
  autoplay: {
    sync: true,
    enter: "bottom top",
    leave: "top bottom",
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="pointer-events-none sticky top-4 z-10 mx-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-demo-text-muted backdrop-blur">
            observer progress {Math.round(observerState.progress * 100)}%
          </div>

          <div className="flex h-155 flex-col items-center justify-between px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              Start outside the container viewport
            </div>

            <div
              ref={ref}
              className="relative flex h-40 w-40 items-center justify-center overflow-hidden border border-cyan-400/20 bg-linear-to-br from-cyan-500/20 via-sky-400/10 to-indigo-500/20 text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-100"
              style={{
                boxShadow: `0 0 50px ${glow}`,
              }}
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              scrubbed
            </div>

            <div className="w-full max-w-60 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/70">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-[width] duration-75"
                  style={{ width: `${observerState.progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
                <span>offset start {Math.round(observerState.offsetStart)}</span>
                <span>offset end {Math.round(observerState.offsetEnd)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

function ScrollCallbacksDemo() {
  const [events, setEvents] = useState<string[]>([]);
  const lastUpdateLabelRef = useRef<string>("");

  const pushEvent = (label: string) => {
    setEvents((prev) => [...prev.slice(-4), label]);
  };

  const { ref, containerRef, state, isInView, backward } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "center center",
    leave: "min+=20 max-=20",
    onEnter: () => pushEvent("enter"),
    onLeave: () => pushEvent("leave"),
    onEnterForward: () => pushEvent("enterForward"),
    onEnterBackward: () => pushEvent("enterBackward"),
    onLeaveForward: () => pushEvent("leaveForward"),
    onLeaveBackward: () => pushEvent("leaveBackward"),
    onUpdate: (observer) => {
      if (observer.progress === 0 || observer.progress === 1) return;
      const label = `update ${Math.round(observer.progress * 100)}%`;
      if (lastUpdateLabelRef.current === label) return;
      lastUpdateLabelRef.current = label;
      pushEvent(label);
    },
  });

  return (
    <DemoCard
      title="onscroll callbacks"
      description="Observe direction-aware callbacks without linking an animation. Useful for React state, analytics, and progressive UI changes."
      state={{ progress: state.progress }}
      code={`onEnter / onLeave / onEnterForward / onLeaveBackward`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="sticky top-0 z-10 border-b border-white/5 bg-black/45 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
              <span>in view {String(isInView)}</span>
              <span>{backward ? "backward" : "forward"}</span>
            </div>
          </div>

          <div className="flex h-140 flex-col items-center justify-between px-5 py-8">
            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-demo-text-muted">
              Directional callbacks fire as the observed block crosses the
              center threshold
            </div>

            <div
              ref={ref}
              className={`flex h-24 w-full max-w-55 items-center justify-center rounded-3xl border text-xs font-black uppercase tracking-[0.3em] transition-colors ${
                isInView
                  ? "border-emerald-400/40 bg-emerald-400/12 text-emerald-200"
                  : "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200"
              }`}
            >
              target
            </div>

            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-demo-text-muted">
              Scroll back up to trigger backward enter/leave callbacks
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
            Recent Events
          </div>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-xs text-slate-600">
                Scroll to populate callback events
              </div>
            ) : (
              events
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="rounded-xl border border-white/5 bg-white/3 px-3 py-2 text-[11px] font-mono text-slate-300"
                  >
                    {event}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

function ScrollSmoothSyncDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const pushEvent = (label: string) => {
    setEvents((prev) => [...prev.slice(-4), label]);
  };

  const syncObserverState = (observer: ScrollObserver) => {
    setObserverState(toObserverSnapshot(observer));
  };

  const { ref, scrollObserver, isReady } = useAnime<HTMLDivElement>({
    scale: [0.82, 1.18],
    rotate: ["-10deg", "10deg"],
    filter: ["saturate(0.7)", "saturate(1.25)"],
    duration: 1400,
    ease: "linear",
    autoplay: {
      container: containerRef,
      sync: 0.18,
      enter: { target: "center", container: "center" },
      leave: { target: "max-=24", container: "min+=24" },
      onEnter: syncObserverState,
      onLeave: syncObserverState,
      onUpdate: syncObserverState,
      onSyncEnter: (observer) => {
        syncObserverState(observer);
        pushEvent("sync enter");
      },
      onSyncLeave: (observer) => {
        syncObserverState(observer);
        pushEvent("sync leave");
      },
      onSyncComplete: (observer) => {
        syncObserverState(observer);
        pushEvent("sync complete");
      },
      onResize: (observer) => {
        syncObserverState(observer);
        pushEvent("resize");
      },
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  return (
    <DemoCard
      title="onscroll smooth sync"
      description="Use numeric sync smoothing through autoplay to create less rigid, more physical scroll-linked playback."
      actions={
        <button
          onClick={() => scrollObserver.current?.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <RefreshCw size={16} />
        </button>
      }
      state={{ progress: observerState.progress }}
      code={`useAnime({
  autoplay: {
    sync: 0.18,
    enter: { target: "center", container: "center" },
    leave: { target: "max-=24", container: "min+=24" },
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#0f1420] to-[#09090e]"
        >
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-18 -translate-y-1/2 rounded-3xl border border-dashed border-cyan-400/25 bg-cyan-400/6" />

          <div className="flex h-155 flex-col items-center justify-between px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              Smooth sync eases the scrub instead of matching scroll instantly
            </div>

            <div
              ref={ref}
              className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-cyan-400/20 via-sky-400/10 to-emerald-400/20 text-center shadow-[0_20px_80px_rgba(34,211,238,0.12)]"
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-100">
                smooth
              </div>
            </div>

            <div className="w-full max-w-64 space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
                <span>progress {Math.round(observerState.progress * 100)}%</span>
                <span>velocity {observerState.velocity.toFixed(2)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/80">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-[width] duration-100"
                  style={{ width: `${observerState.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
            Sync Events
          </div>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-xs text-slate-600">
                Scroll through the band to trigger sync lifecycle callbacks
              </div>
            ) : (
              events
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="rounded-xl border border-white/5 bg-white/3 px-3 py-2 text-[11px] font-mono text-slate-300"
                  >
                    {event}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

function ScrollHorizontalAxisDemo() {
  const { ref, containerRef, state, controls } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    axis: "x",
    enter: 0.1,
    leave: 0.9,
  });

  return (
    <DemoCard
      title="onscroll horizontal axis"
      description="Track horizontal container scrolling with axis-specific observer progress and live scroll metrics."
      actions={
        <button
          onClick={() => controls.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <Waves size={16} />
        </button>
      }
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({
  axis: "x",
  enter: 0.1,
  leave: 0.9,
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
          <ArrowDown className="h-3.5 w-3.5 rotate-[-90deg] text-demo-accent" />
          Scroll sideways inside the panel
        </div>

        <div
          ref={containerRef}
          className="relative overflow-x-auto overflow-y-hidden rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="w-[56rem] px-6 py-6">
            <div className="mb-4 flex gap-3">
              {["axis", "x", "observer", "progress", "scroll", "metrics"].map(
                (label, index) => (
                  <div
                    key={label}
                    className="flex h-20 min-w-40 items-center justify-center rounded-2xl border text-xs font-black uppercase tracking-[0.3em]"
                    style={{
                      borderColor:
                        index === 2 ? "rgba(255, 209, 26, 0.35)" : "rgba(255,255,255,0.08)",
                      background:
                        index === 2
                          ? "linear-gradient(135deg, rgba(255,209,26,0.12), rgba(255,140,55,0.10))"
                          : "rgba(255,255,255,0.02)",
                      color: index === 2 ? "#ffe680" : "#cbd5e1",
                    }}
                  >
                    {label}
                  </div>
                ),
              )}
            </div>

            <div
              ref={ref}
              className="relative h-28 rounded-[1.75rem] border border-cyan-400/25 bg-linear-to-r from-cyan-500/18 via-sky-400/8 to-indigo-500/18"
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="absolute inset-y-0 left-[10%] w-px bg-cyan-400/25" />
              <div className="absolute inset-y-0 right-[10%] w-px bg-cyan-400/25" />
              <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-[0.35em] text-cyan-100">
                horizontal target
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            progress <span className="text-demo-accent">{Math.round(state.progress * 100)}%</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            scroll <span className="text-cyan-400">{Math.round(state.scroll)}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            distance <span className="text-fuchsia-400">{Math.round(state.distance)}</span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

export const OnScrollGroup = () => {
  return (
    <DemoSection title="Events: onScroll">
      <ScrollPlaybackDemo />
      <ScrollScrubDemo />
      <ScrollCallbacksDemo />
      <ScrollSmoothSyncDemo />
      <ScrollHorizontalAxisDemo />
    </DemoSection>
  );
};

export default OnScrollGroup;
