import React, { useRef } from 'react';
import { useAnimeOnScroll } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { Panel, ScrollHint } from './shared';

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
    enter: 'bottom top',
    leave: 'top bottom',
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
        transition: 'transform 75ms linear, opacity 75ms linear',
      }}
    >
      <div className="mb-1 text-[11px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>
        chapter {index + 1}
      </div>
      <div className="text-sm text-slate-200">{title}</div>
    </div>
  );
}

export function RevealColumnsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = [
    { title: 'Offset thresholds create staggered entrance timing', accent: '#ffd11a' },
    { title: 'Each card responds to its own observer progress', accent: '#ff6b8a' },
    { title: 'The movement stays smooth because React only derives styles', accent: '#63b3ed' },
    { title: 'Reverse scrolling fades everything back out naturally', accent: '#68d391' },
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
