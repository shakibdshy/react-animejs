import { memo, useCallback, useMemo, useState } from 'react';
import { demoDetails, demoSections } from '../data';
import type { DemoSection } from '../types';

interface DetailOverlayProps {
  isOpen: boolean;
  activeDemo: DemoSection | null;
  currentIndex: number;
  totalFiltered: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DetailOverlay = memo(function DetailOverlay({
  isOpen,
  activeDemo,
  currentIndex,
  totalFiltered,
  canGoNext,
  canGoPrev,
  onClose,
  onNext,
  onPrev,
}: DetailOverlayProps) {
  const [copied, setCopied] = useState(false);

  const globalIndex = useMemo(() => {
    if (!activeDemo) return 0;
    return demoSections.findIndex((d) => d.path === activeDemo.path);
  }, [activeDemo]);

  const detail = demoDetails[globalIndex] ?? null;

  const handleCopy = useCallback(async () => {
    if (!detail) return;
    try {
      await navigator.clipboard.writeText(detail.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = detail.code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [detail]);

  if (!isOpen || !activeDemo || !detail) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${activeDemo.title} details`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex-1 overflow-y-auto overscroll-contain z-10">
        <div className="max-w-300 mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="landing-font-mono text-sm text-landing-muted cursor-pointer hover:text-landing-fg transition-colors"
                onClick={onClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onClose()}
              >
                Components
              </span>
              <span className="text-landing-muted/50 text-xs">/</span>
              <span className="landing-font-mono text-sm text-landing-fg">{activeDemo.title}</span>
              <span className="ml-2 text-[12px] landing-font-mono text-landing-muted bg-landing-surface border border-landing-border rounded-full px-3 py-1">
                {currentIndex + 1} / {totalFiltered}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onPrev}
                disabled={!canGoPrev}
                className="px-4 py-2 rounded-full border border-landing-border text-sm landing-font-mono text-landing-muted hover:border-landing-accent hover:text-landing-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-landing-surface"
              >
                ← Previous
              </button>
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="px-4 py-2 rounded-full border border-landing-border text-sm landing-font-mono text-landing-muted hover:border-landing-accent hover:text-landing-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-landing-surface"
              >
                Next →
              </button>
              <button
                onClick={onClose}
                className="ml-2 w-10 h-10 rounded-full border border-landing-border flex items-center justify-center text-lg text-landing-muted hover:border-red-500 hover:text-red-400 transition-all bg-landing-surface"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <h2 className="landing-font-display text-[32px] leading-tight mb-3">
                {activeDemo.title}
              </h2>
              <div className="flex items-center gap-3 mb-8">
                <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-accent bg-landing-accent/10 px-3 py-1 rounded-full border border-landing-accent/20">
                  {activeDemo.category}
                </span>
              </div>

              <div className="relative flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="landing-font-display text-sm text-landing-fg">Code</h3>
                  <button
                    onClick={handleCopy}
                    className="landing-font-mono text-sm text-landing-muted hover:text-landing-accent transition-colors px-4 py-2 rounded-lg border border-landing-border hover:border-landing-accent/40 bg-landing-surface"
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-landing-border bg-(--color-landing-bg) shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  <pre className="p-5 overflow-x-auto text-[13px] leading-[1.6] landing-font-mono text-landing-fg whitespace-pre">
                    <code>{detail.code}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-[15px] text-landing-muted leading-[1.65]">{detail.summary}</p>

              <div className="rounded-xl overflow-hidden border border-landing-border bg-landing-surface flex-1 min-h-55 flex flex-col">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-landing-border">
                  <span className="text-sm font-bold text-landing-fg landing-font-display">
                    Live preview
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center p-5 bg-landing-accent/5">
                  <PreviewStage demoIndex={globalIndex} />
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-landing-border">
                <div className="px-5 py-3.5 border-b border-landing-border bg-landing-surface">
                  <span className="text-sm font-bold text-landing-fg landing-font-display">
                    Props
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-landing-border bg-landing-surface">
                        {['Name', 'Type', 'Default', 'Description'].map((header) => (
                          <th
                            key={header}
                            className="text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-landing-muted landing-font-mono font-normal"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.props.map((prop) => (
                        <tr
                          key={prop.name}
                          className="border-b border-landing-border last:border-b-0 hover:bg-landing-accent/5 transition-colors"
                        >
                          <td className="px-4 py-2.5 landing-font-mono text-landing-accent text-[13px]">
                            {prop.name}
                          </td>
                          <td className="px-4 py-2.5 landing-font-mono text-landing-muted text-[12px]">
                            {prop.type}
                          </td>
                          <td className="px-4 py-2.5 landing-font-mono text-landing-muted text-[12px]">
                            {prop.default}
                          </td>
                          <td className="px-4 py-2.5 text-landing-fg text-[13px]">{prop.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10 pt-8 border-t border-landing-border">
            {canGoPrev ? (
              <button
                onClick={onPrev}
                className="landing-font-display text-lg text-landing-muted hover:text-landing-accent transition-colors flex items-center gap-2"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}
            {canGoNext ? (
              <button
                onClick={onNext}
                className="landing-font-display text-lg text-landing-muted hover:text-landing-accent transition-colors flex items-center gap-2"
              >
                Next →
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

function PreviewStage({ demoIndex }: { demoIndex: number }) {
  const previewAnims = [
    'Stagger boxes',
    'SVG pulse',
    'SVG path drawing',
    'Counter',
    'Bars grow',
    'Ring orbit',
    'Bounce dots',
    'Scale box',
    'Cube rotate',
    'Clip reveal',
    'Scramble text',
  ];
  const label = previewAnims[demoIndex % previewAnims.length];

  return (
    <div className="text-center">
      <div className="landing-font-mono text-sm text-landing-accent mb-2">{label}</div>
      <div className="text-[12px] text-landing-muted">
        Preview available on the dedicated demo page
      </div>
    </div>
  );
}
