import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { useCopyToClipboard } from '@/landing/hooks/use-copy-to-clipboard';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { Btn } from '@/landing/components/ui/btn';

interface CtaSectionProps {
  className?: string;
}

/**
 * Closing chapter. The install command is staged inside a terminal window
 * with a faux prompt and a blinking caret — a final, theatrical call to
 * action before the colophon.
 */
export const CtaSection = memo(function CtaSection({ className }: CtaSectionProps) {
  const [ref, visible] = useScrollReveal();
  const { copied, copy } = useCopyToClipboard();
  const installCmd = 'npm install react-animejs animejs';

  return (
    <LandingContainer
      as="section"
      id="install"
      className={cn('py-30 text-center', className)}
    >
      <div
        ref={ref}
        className={cn(
          'max-w-150 mx-auto',
          'transition-all duration-1000',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <p className="landing-font-mono text-[11px] tracking-[0.28em] uppercase text-landing-accent mb-4">
          Chapter IV — Begin
        </p>
        <h2
          className="landing-font-display font-bold tracking-tight leading-[1.02] text-landing-fg mb-6"
          style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
        >
          One command. <br />
          <span className="text-landing-accent">Zero config.</span>
        </h2>
        <p className="text-[17px] text-landing-muted leading-relaxed mb-12 max-w-110 mx-auto">
          Install, import a component, and ship motion. Sensible typed defaults
          mean there is nothing to configure before the first animation runs.
        </p>

        {/* Terminal window */}
        <div className="text-left rounded-2xl border border-landing-border overflow-hidden bg-landing-surface shadow-[0_30px_80px_-30px_color-mix(in_oklch,var(--landing-accent)_40%,transparent)]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-landing-bg border-b border-landing-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-landing-muted/30" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-landing-muted/30" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-landing-accent/70" aria-hidden="true" />
              <span className="ml-3 landing-font-mono text-[11px] tracking-[0.15em] uppercase text-landing-muted">
                bash — install
              </span>
            </div>
            <button
              onClick={() => void copy(installCmd)}
              className="bg-transparent border-none text-landing-muted cursor-pointer text-[11px] px-2 py-1 rounded hover:text-landing-fg transition-colors duration-200 landing-font-mono"
              aria-label={copied ? 'Copied' : 'Copy install command'}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          {/* Prompt body */}
          <div className="px-5 py-6 landing-font-mono text-[14px] leading-relaxed">
            <div className="flex items-center gap-3">
              <span className="text-landing-accent select-none">{'\u27E6'}</span>
              <span className="text-landing-muted select-none">~/app</span>
              <span className="text-landing-fg/40 select-none">{'\u25B8'}</span>
              <span className="text-landing-fg">
                npm install <span className="text-landing-accent">react-animejs</span> animejs
                <span className="landing-caret" aria-hidden="true">
                  {'\u25AE'}
                </span>
              </span>
            </div>
            <p className="mt-3 text-landing-muted text-[12px] pl-7">
              {'\u2713'} added 1 package — you are ready to animate.
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-3 justify-center flex-wrap">
          <Btn href="/docs">Read the docs {'\u2192'}</Btn>
          <Btn variant="secondary" href="https://github.com">
            Star on GitHub {'\u2605'}
          </Btn>
        </div>
      </div>

      <style>{`
        .landing-caret {
          display: inline-block;
          margin-left: 4px;
          color: var(--landing-accent);
          animation: landingBlink 1.1s steps(1) infinite;
        }
        @keyframes landingBlink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-caret { animation: none; }
        }
      `}</style>
    </LandingContainer>
  );
});
