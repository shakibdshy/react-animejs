import React, { useRef } from "react";
import { ArrowDown, Sparkles, Waves } from "lucide-react";
import { useAnimeOnScroll } from "@/lib/react-animejs/hooks/use-anime-onscroll";
import { DemoCard } from "./DemoCard";
import { DemoSection } from "./DemoSection";

function ScrollHint({ label = "Scroll inside the panel below" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
      <ArrowDown className="h-3.5 w-3.5 text-demo-accent" />
      {label}
    </div>
  );
}

function Panel({
  children,
  containerRef,
  className = "",
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={containerRef}
      className={`relative h-72 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#0d0d15] to-[#09090e] ${className}`}
    >
      {children}
    </div>
  );
}

function MetricPill({
  label,
  value,
  tone = "text-slate-200",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
      {label} <span className={tone}>{value}</span>
    </div>
  );
}

function ScrollLinkedIntro() {
  return (
    <div className="rounded-[2rem] border border-demo-border bg-linear-to-br from-[#11111a] via-[#0e1018] to-[#0a0a10] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.34em] text-demo-accent">
            Observer-Driven Motion Studies
          </div>
          <h3 className="text-2xl font-black uppercase tracking-[0.12em] text-white">
            Derive Styles Directly From ScrollObserver Progress
          </h3>
          <p className="max-w-xl text-sm leading-6 text-demo-text-secondary">
            These examples intentionally stay on <code className="text-demo-accent">useAnimeOnScroll()</code>
            because the observer is the source of truth. Each card maps raw
            progress into transforms, blur, opacity, clip-path, and color instead
            of just triggering one animation instance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricPill
            label="preferred api"
            value="useAnimeOnScroll"
            tone="text-demo-accent"
          />
          <MetricPill
            label="best for"
            value="reactive styles"
            tone="text-cyan-400"
          />
          <MetricPill
            label="alternative"
            value="useAnime autoplay"
            tone="text-fuchsia-400"
          />
        </div>
      </div>
    </div>
  );
}

function DepthStackDemo() {
  const layers = [
    { label: "foreground", color: "#ffd11a", drift: -0.42, scale: 1.04 },
    { label: "midtone", color: "#ff6b8a", drift: -0.12, scale: 1.01 },
    { label: "signal", color: "#63b3ed", drift: 0.16, scale: 0.98 },
    { label: "shadow", color: "#68d391", drift: 0.34, scale: 0.95 },
  ];

  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "bottom top",
    leave: "top bottom",
  });

  return (
    <DemoCard
      title="depth stack"
      description="A layered scene where each panel drifts at a different rate as the observed stack crosses the viewport."
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// each layer derives transform from observer.progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-180 flex-col items-center justify-center px-6 py-10">
            <div className="mb-6 text-center text-xs text-demo-text-muted">
              Foreground layers pull upward while distant layers sink deeper into the scene
            </div>

            <div
              ref={ref}
              className="relative flex w-full max-w-sm flex-col gap-6 py-10"
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-36 -translate-y-1/2 rounded-[2rem] border border-dashed border-white/10 bg-white/3" />

              {layers.map((layer, index) => {
                const travel = (state.progress - 0.5) * layer.drift * 180;
                const blur = Math.abs(layer.drift) * 1.5;
                const opacity = 0.7 + (1 - Math.abs(layer.drift)) * 0.25;

                return (
                  <div
                    key={layer.label}
                    className="relative rounded-[1.75rem] border px-5 py-5 transition-transform duration-75"
                    style={{
                      transform: `translateY(${travel}px) scale(${layer.scale})`,
                      borderColor: `${layer.color}33`,
                      background: `linear-gradient(135deg, ${layer.color}14, rgba(255,255,255,0.02))`,
                      boxShadow: `0 18px 48px ${layer.color}12`,
                      filter: `blur(${blur * (1 - state.progress * 0.35)}px)`,
                      opacity,
                    }}
                  >
                    <div
                      className="mb-2 text-[11px] font-black uppercase tracking-[0.3em]"
                      style={{ color: layer.color }}
                    >
                      {layer.label}
                    </div>
                    <div className="text-xs text-demo-text-muted">
                      Layer {index + 1} drift {layer.drift.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function RevealRow({
  container,
  index,
  title,
  accent,
}: {
  container: React.RefObject<HTMLDivElement | null>;
  index: number;
  title: string;
  accent: string;
}) {
  const { ref, state } = useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
    container,
    enter: "bottom top",
    leave: "top bottom",
  });

  const progress = Math.max(0, Math.min(1, state.progress));
  const y = (1 - progress) * (32 + index * 8);
  const x = (0.5 - progress) * 20;
  const glow = 0.08 + progress * 0.16;

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-2xl border px-5 py-4"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
        opacity: 0.18 + progress * 0.82,
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}10, rgba(255,255,255,0.02))`,
        boxShadow: `0 0 30px rgba(0,0,0,0.18), 0 0 0 1px ${accent}10 inset, 0 14px 40px rgba(0,0,0,${glow})`,
        transition: "transform 75ms linear, opacity 75ms linear",
      }}
    >
      <div className="mb-1 text-[11px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>
        chapter {index + 1}
      </div>
      <div className="text-sm text-slate-200">{title}</div>
    </div>
  );
}

function RevealColumnsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = [
    { title: "Offset thresholds create staggered entrance timing", accent: "#ffd11a" },
    { title: "Each card responds to its own observer progress", accent: "#ff6b8a" },
    { title: "The movement stays smooth because React only derives styles", accent: "#63b3ed" },
    { title: "Reverse scrolling fades everything back out naturally", accent: "#68d391" },
  ];

  return (
    <DemoCard
      title="reveal columns"
      description="A stacked editorial reveal where each row owns its own observer and enters with depth, opacity, and sideways drift."
      state={{ progress: 1 }}
      code={`useAnimeOnScroll({ container, enter: "bottom top", leave: "top bottom" })
// opacity + translate are derived from per-row progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-170 flex-col items-center justify-center gap-5 px-6 py-10">
            {items.map((item, index) => (
              <RevealRow
                key={item.title}
                container={containerRef}
                index={index}
                title={item.title}
                accent={item.accent}
              />
            ))}
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function ConveyorDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "bottom top",
    leave: "top bottom",
  });

  const labels = ["signal", "ribbon", "vector", "motion"];

  return (
    <DemoCard
      title="conveyor strip"
      description="A horizontal ribbon that slides across the viewport according to vertical scroll progress."
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// translateX is mapped from observer.progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-155 flex-col items-center justify-center gap-6 px-6 py-10">
            <div
              ref={ref}
              className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-demo-border bg-demo-bg"
            >
              <div
                className="flex w-[400%] transition-transform duration-75"
                style={{ transform: `translateX(-${state.progress * 75}%)` }}
              >
                {labels.map((label, index) => (
                  <div
                    key={label}
                    className="flex min-h-32 w-full shrink-0 items-center justify-center"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(135deg, rgba(255,209,26,0.16), rgba(255,140,55,0.08))"
                          : "linear-gradient(135deg, rgba(99,179,237,0.16), rgba(104,211,145,0.08))",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-[10px] font-mono uppercase tracking-[0.34em] text-demo-text-muted">
                        panel {index + 1}
                      </div>
                      <div className="mt-2 text-2xl font-black uppercase tracking-[0.28em] text-white">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              <MetricPill label="progress" value={`${Math.round(state.progress * 100)}%`} tone="text-demo-accent" />
              <MetricPill label="velocity" value={state.velocity.toFixed(2)} tone="text-cyan-400" />
              <MetricPill label="scroll" value={`${Math.round(state.scroll)}`} tone="text-fuchsia-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function MorphTileDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "bottom top",
    leave: "top bottom",
  });

  const progress = state.progress;
  const scale = 0.58 + progress * 0.62;
  const rotate = -50 + progress * 100;
  const radius = 14 + progress * 64;
  const glow = 0.1 + progress * 0.25;

  return (
    <DemoCard
      title="morph tile"
      description="A single observed tile morphs its geometry, scale, and glow in one continuous scroll-linked gesture."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// scale + rotate + radius all map from progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-160 flex-col items-center justify-center gap-5 px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              The object tightens into a rounded capsule as it crosses the center band
            </div>

            <div
              ref={ref}
              className="relative flex h-36 w-36 items-center justify-center border border-[#b794f4]/35"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                borderRadius: `${radius}px`,
                background: `linear-gradient(135deg, rgba(183,148,244,${0.16 + progress * 0.24}), rgba(99,179,237,${0.06 + progress * 0.12}))`,
                boxShadow: `0 20px 70px rgba(183,148,244,${glow})`,
                transition:
                  "transform 75ms linear, border-radius 75ms linear, background 75ms linear, box-shadow 75ms linear",
              }}
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#d9c3ff]">
                  geometry
                </div>
                <div className="mt-2 text-lg font-black text-white">
                  {Math.round(progress * 100)}%
                </div>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              <MetricPill label="scale" value={scale.toFixed(2)} tone="text-demo-accent" />
              <MetricPill label="rotate" value={`${Math.round(rotate)}deg`} tone="text-cyan-400" />
              <MetricPill label="radius" value={`${Math.round(radius)}px`} tone="text-fuchsia-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function SpectrumMeterDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "bottom top",
    leave: "top bottom",
  });

  const progress = state.progress;
  const hue = 24 + progress * 160;
  const arc = 30 + progress * 270;

  return (
    <DemoCard
      title="spectrum meter"
      description="A color-reactive gauge where the observed block shifts hue and fills a circular arc as it moves through the viewport."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// hue + gauge arc are derived from progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-160 flex-col items-center justify-center gap-6 px-6 py-10">
            <div
              ref={ref}
              className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/10"
              style={{
                background: `radial-gradient(circle at 50% 35%, hsla(${hue}, 88%, 62%, 0.28), rgba(9,9,14,0.96) 62%)`,
                boxShadow: `0 25px 90px hsla(${hue}, 88%, 62%, 0.18)`,
              }}
            >
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `conic-gradient(hsla(${hue}, 92%, 62%, 1) ${arc}deg, rgba(255,255,255,0.06) ${arc}deg)`,
                  WebkitMask:
                    "radial-gradient(circle, transparent 58%, black 60%)",
                  mask: "radial-gradient(circle, transparent 58%, black 60%)",
                }}
              />
              <div className="relative text-center">
                <Sparkles className="mx-auto h-5 w-5 text-white/75" />
                <div className="mt-3 text-2xl font-black text-white">
                  {Math.round(progress * 100)}%
                </div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.3em] text-demo-text-secondary">
                  chroma
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-demo-text-muted">
                <span>hue {Math.round(hue)}</span>
                <span>arc {Math.round(arc)}deg</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/60">
                <div
                  className="h-full transition-[width] duration-75"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(90deg, hsl(${hue} 92% 62%), hsl(${Math.min(
                      hue + 55,
                      360,
                    )} 92% 62%))`,
                  }}
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function CopyRevealDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "center center",
    leave: "center bottom",
  });

  const progress = Math.max(0, Math.min(1, state.progress));

  return (
    <DemoCard
      title="copy aperture"
      description="A headline reveal that opens like a shutter, widens tracking, and sharpens contrast as the observer enters the active zone."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "center center", leave: "center bottom" })
// clipPath + letterSpacing + opacity are derived from progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-150 flex-col items-center justify-center px-6 py-10">
            <div
              ref={ref}
              className="w-full max-w-md text-center"
              style={{
                opacity: 0.22 + progress * 0.78,
                filter: `blur(${(1 - progress) * 8}px)`,
                transition: "opacity 75ms linear, filter 75ms linear",
              }}
            >
              <div
                className="inline-block"
                style={{
                  clipPath: `inset(0 ${(1 - progress) * 50}% 0 ${(1 - progress) * 50}%)`,
                }}
              >
                <div
                  className="text-3xl font-black uppercase text-demo-accent"
                  style={{ letterSpacing: `${0.1 + progress * 0.22}em` }}
                >
                  Scroll Linked
                </div>
              </div>
              <div className="mt-4 text-sm text-demo-text-secondary">
                Motion, contrast, and typography all respond to the same scroll observer.
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

function WaveBarDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: "bottom top",
    leave: "top bottom",
  });

  const bars = Array.from({ length: 10 }, (_, index) => index);

  return (
    <DemoCard
      title="wave bars"
      description="A reactive equalizer where each bar samples the same observer progress with a slightly shifted phase."
      actions={
        <div className="rounded-lg bg-white/5 p-2 text-demo-text-secondary">
          <Waves className="h-4 w-4" />
        </div>
      }
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// each bar uses a shifted version of observer.progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-150 flex-col items-center justify-center gap-8 px-6 py-10">
            <div
              ref={ref}
              className="flex w-full max-w-sm items-end justify-center gap-3"
            >
              {bars.map((bar) => {
                const phased = Math.max(
                  0,
                  Math.min(1, state.progress * 1.15 - bar * 0.06),
                );
                const height = 22 + phased * (28 + bar * 4);

                return (
                  <div
                    key={bar}
                    className="w-5 rounded-full transition-[height,background] duration-75"
                    style={{
                      height,
                      background:
                        bar % 2 === 0
                          ? `linear-gradient(180deg, rgba(255,209,26,0.95), rgba(255,140,55,0.28))`
                          : `linear-gradient(180deg, rgba(99,179,237,0.95), rgba(104,211,145,0.28))`,
                      boxShadow: `0 0 20px rgba(255,255,255,0.06)`,
                    }}
                  />
                );
              })}
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <MetricPill label="offset start" value={`${Math.round(state.offsetStart)}`} tone="text-demo-accent" />
              <MetricPill label="offset end" value={`${Math.round(state.offsetEnd)}`} tone="text-cyan-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}

export const ScrollLinkedAnimationsGroup: React.FC = () => {
  return (
    <div className="space-y-10">
      <ScrollLinkedIntro />

      <DemoSection title="Scroll-Linked Animations">
        <DepthStackDemo />
        <RevealColumnsDemo />
        <ConveyorDemo />
        <MorphTileDemo />
        <SpectrumMeterDemo />
        <CopyRevealDemo />
        <WaveBarDemo />
      </DemoSection>
    </div>
  );
};
