import { useMemo, useRef, useState } from "react";
import { ArrowDown, RefreshCw, Waves, Zap } from "lucide-react";
import { useAnime, useAnimeOnScroll } from "../../index";
import { DemoCard } from "./DemoCard";
import { DemoSection } from "./DemoSection";

function ScrollHint() {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
      <ArrowDown className="h-3.5 w-3.5 text-[#ffd11a]" />
      Scroll the inner panel
    </div>
  );
}

function ScrollPlaybackDemo() {
  const {
    ref,
    animation,
    controls: animationControls,
    isPlaying,
    state,
  } = useAnime<HTMLDivElement>({
    translateX: [0, 180],
    rotate: ["0deg", "1turn"],
    scale: [1, 1.12, 1],
    duration: 1600,
    ease: "inOutExpo",
    autoplay: false,
  });

  const { containerRef, controls, isInView, progress, velocity, backward } =
    useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
      linked: animation,
      container: undefined,
      sync: "play pause reverse reset",
      enter: "bottom center",
      leave: "top center",
    });

  return (
    <DemoCard
      title="onscroll play / pause"
      description="Link a regular useAnime animation to ScrollObserver method sync. Entering plays, leaving pauses or reverses based on direction."
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => controls.refresh()}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
            title="Refresh observer"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => animationControls.restart()}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-[#ffd11a] rounded-lg transition-all"
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
      state={{ progress }}
      isPlaying={isPlaying}
      code={`useAnimeOnScroll({ sync: "play pause reverse reset" })`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-[#2a2a3a] bg-linear-to-b from-[#09090e] via-[#101019] to-[#09090e]"
        >
          <div className="flex h-120 flex-col items-center justify-between px-5 py-6">
            <div className="text-center text-xs text-slate-500">
              Scroll until the yellow chip reaches the middle band
            </div>

            <div className="relative flex w-full items-center justify-center">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 rounded-2xl border border-dashed border-[#ffd11a]/35 bg-[#ffd11a]/5" />
              <div
                ref={ref}
                className="relative z-10 flex h-18 w-18 items-center justify-center rounded-3xl bg-linear-to-br from-[#ffd11a] to-[#ff8c37] text-xs font-black uppercase tracking-[0.2em] text-[#12121a] shadow-[0_12px_40px_rgba(255,209,26,0.25)]"
              >
                Spin
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              Leaving the zone pauses or reverses based on scroll direction
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            in view:{" "}
            <span className={isInView ? "text-emerald-400" : "text-slate-300"}>
              {String(isInView)}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            direction:{" "}
            <span className="text-cyan-400">
              {backward ? "backward" : "forward"}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            observer:{" "}
            <span className="text-[#ffd11a]">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            velocity:{" "}
            <span className="text-fuchsia-400">{velocity.toFixed(2)}</span>
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
  const { ref, animation } = useAnime<HTMLDivElement>({
    scale: [0.72, 1.18],
    rotate: ["-15deg", "15deg"],
    borderRadius: ["24px", "40px"],
    duration: 1800,
    ease: "linear",
    autoplay: false,
  });

  const { containerRef, state, controls } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    linked: animation,
    sync: true,
    enter: "top bottom",
    leave: "bottom top",
  });

  const glow = useMemo(() => {
    const progress = Math.max(0, Math.min(1, state.progress));
    return `rgba(34, 211, 238, ${0.12 + progress * 0.35})`;
  }, [state.progress]);

  return (
    <DemoCard
      title="onscroll scrub"
      description="Use exact playback-progress sync so scroll distance scrubs an animation frame by frame."
      actions={
        <button
          onClick={() => controls.refresh()}
          className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <Waves size={16} />
        </button>
      }
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ sync: true, enter: "top bottom", leave: "bottom top" })`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-[#2a2a3a] bg-[#09090e]"
        >
          <div className="pointer-events-none sticky top-4 z-10 mx-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 backdrop-blur">
            observer progress {Math.round(state.progress * 100)}%
          </div>

          <div className="flex h-155 flex-col items-center justify-between px-6 py-10">
            <div className="text-center text-xs text-slate-500">
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
              <div className="h-2 overflow-hidden rounded-full bg-slate-800/70">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-[width] duration-75"
                  style={{ width: `${state.progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                <span>offset start {Math.round(state.offsetStart)}</span>
                <span>offset end {Math.round(state.offsetEnd)}</span>
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
    leave: "max-=20 min+=20",
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
          className="relative h-64 overflow-y-auto rounded-2xl border border-[#2a2a3a] bg-[#09090e]"
        >
          <div className="sticky top-0 z-10 border-b border-white/5 bg-black/45 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
              <span>in view {String(isInView)}</span>
              <span>{backward ? "backward" : "forward"}</span>
            </div>
          </div>

          <div className="flex h-140 flex-col items-center justify-between px-5 py-8">
            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-slate-500">
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

            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-slate-500">
              Scroll back up to trigger backward enter/leave callbacks
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
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

export const OnScrollGroup = () => {
  return (
    <DemoSection title="Events: onScroll">
      <ScrollPlaybackDemo />
      <ScrollScrubDemo />
      <ScrollCallbacksDemo />
    </DemoSection>
  );
};

export default OnScrollGroup;
