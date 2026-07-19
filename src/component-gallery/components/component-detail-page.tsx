import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { demoDetails, demoSections } from '../data';
import { getDemoPreview } from './detail-previews';
import { CodeBlock } from './code-block';
import { ComponentGalleryShell } from './component-gallery-shell';
import type { DemoId } from '../data';
import type { DemoSection } from '../types';

interface ComponentDetailPageProps {
  demo: DemoSection<DemoId>;
}

/** The canonical, linkable documentation and preview page for one component. */
export const ComponentDetailPage = memo(function ComponentDetailPage({
  demo,
}: ComponentDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const detail = demoDetails[demo.componentId];
  const currentIndex = demoSections.findIndex((item) => item.componentId === demo.componentId);
  const previousDemo = currentIndex > 0 ? demoSections[currentIndex - 1] : undefined;
  const nextDemo = currentIndex < demoSections.length - 1 ? demoSections[currentIndex + 1] : undefined;

  const PreviewComponent = useMemo(() => getDemoPreview(demo.componentId), [demo.componentId]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(detail.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = detail.code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [detail.code]);

  return (
    <ComponentGalleryShell>
      <main className="relative overflow-hidden pt-28 pb-16 min-h-screen">
        <div className="pointer-events-none absolute top-12 left-[14%] h-72 w-72 rounded-full bg-landing-accent/8 blur-[100px]" />
        <div className="pointer-events-none absolute top-[32rem] right-[8%] h-80 w-80 rounded-full bg-violet-500/8 blur-[110px]" />

        <div className="relative max-w-300 mx-auto px-6">
          <div className="flex items-center justify-between gap-5 mb-10 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/demos"
                className="landing-font-mono text-sm text-landing-muted hover:text-landing-accent transition-colors no-underline"
              >
                Components
              </Link>
              <span className="text-landing-muted/50 text-xs">/</span>
              <span className="landing-font-mono text-sm text-landing-fg">{demo.title}</span>
              <span className="ml-2 text-[12px] landing-font-mono text-landing-muted bg-landing-surface border border-landing-border rounded-full px-3 py-1">
                {currentIndex + 1} / {demoSections.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {previousDemo ? (
                <Link
                  to="/demos/$componentId"
                  params={{ componentId: previousDemo.componentId }}
                  className="px-4 py-2 rounded-full border border-landing-border text-sm landing-font-mono text-landing-muted hover:border-landing-accent hover:text-landing-accent transition-all bg-landing-surface flex items-center gap-2 no-underline"
                >
                  <ArrowLeft size={14} />
                  Previous
                </Link>
              ) : null}
              {nextDemo ? (
                <Link
                  to="/demos/$componentId"
                  params={{ componentId: nextDemo.componentId }}
                  className="px-4 py-2 rounded-full border border-landing-border text-sm landing-font-mono text-landing-muted hover:border-landing-accent hover:text-landing-accent transition-all bg-landing-surface flex items-center gap-2 no-underline"
                >
                  Next
                  <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="flex flex-col">
              <h1 className="landing-font-display text-4xl leading-tight mb-3">{demo.title}</h1>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-accent bg-landing-accent/10 px-3 py-1 rounded-full border border-landing-accent/20">
                  {demo.category}
                </span>
                {demo.hasPlayground && demo.playgroundPath ? (
                  <Link
                    to={demo.playgroundPath as never}
                    className="landing-font-mono text-[11px] tracking-wider uppercase text-landing-muted hover:text-landing-accent bg-landing-surface px-3 py-1 rounded-full border border-landing-border hover:border-landing-accent/30 transition-all no-underline flex items-center gap-1.5"
                  >
                    Open Playground
                    <ExternalLink size={13} />
                  </Link>
                ) : null}
              </div>

              <div className="flex items-center justify-between mb-3">
                <h2 className="landing-font-display text-sm text-landing-fg">Code</h2>
                <button
                  onClick={handleCopy}
                  className="landing-font-mono text-sm text-landing-muted hover:text-landing-accent transition-colors px-4 py-2 rounded-lg border border-landing-border hover:border-landing-accent/40 bg-landing-surface flex items-center gap-1.5"
                >
                  {copied ? (
                    <><Check size={14} className="text-green-500" /> Copied</>
                  ) : 'Copy'}
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-landing-border bg-(--color-landing-bg) shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                <div className="p-5 overflow-x-auto">
                  <CodeBlock code={detail.code} />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <p className="text-[15px] text-landing-muted leading-[1.65]">{detail.summary}</p>

              <div className="rounded-xl overflow-hidden border border-landing-border bg-landing-surface min-h-80 flex flex-col">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-landing-border">
                  <span className="text-sm font-bold text-landing-fg landing-font-display">Live preview</span>
                  {demo.hasPlayground && demo.playgroundPath ? (
                    <Link
                      to={demo.playgroundPath as never}
                      className="landing-font-mono text-[11px] text-landing-muted hover:text-landing-accent transition-colors no-underline flex items-center gap-1.5"
                    >
                      Open Playground
                      <ExternalLink size={14} />
                    </Link>
                  ) : null}
                </div>
                <div className="flex-1 overflow-auto p-4 bg-demo-bg">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full min-h-60">
                        <span className="landing-font-mono text-sm text-landing-muted animate-pulse">Loading component...</span>
                      </div>
                    }
                  >
                    <PreviewComponent />
                  </Suspense>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-landing-border">
                <div className="px-5 py-3.5 border-b border-landing-border bg-landing-surface">
                  <span className="text-sm font-bold text-landing-fg landing-font-display">Props</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-landing-border bg-landing-surface">
                        {['Name', 'Type', 'Default', 'Description'].map((header) => (
                          <th key={header} className="text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-landing-muted landing-font-mono font-normal">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.props.map((prop) => (
                        <tr key={prop.name} className="border-b border-landing-border last:border-b-0 hover:bg-landing-accent/5 transition-colors">
                          <td className="px-4 py-2.5 landing-font-mono text-landing-accent text-[13px]">{prop.name}</td>
                          <td className="px-4 py-2.5 landing-font-mono text-landing-muted text-[12px]">{prop.type}</td>
                          <td className="px-4 py-2.5 landing-font-mono text-landing-muted text-[12px]">{prop.default}</td>
                          <td className="px-4 py-2.5 text-landing-fg text-[13px]">{prop.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-landing-border">
            {previousDemo ? (
              <Link to="/demos/$componentId" params={{ componentId: previousDemo.componentId }} className="landing-font-display text-lg text-landing-muted hover:text-landing-accent transition-colors flex items-center gap-2 no-underline">
                <ArrowLeft size={18} />
                {previousDemo.title}
              </Link>
            ) : <div />}
            {nextDemo ? (
              <Link to="/demos/$componentId" params={{ componentId: nextDemo.componentId }} className="landing-font-display text-lg text-landing-muted hover:text-landing-accent transition-colors flex items-center gap-2 no-underline">
                {nextDemo.title}
                <ArrowRight size={18} />
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>
    </ComponentGalleryShell>
  );
});
