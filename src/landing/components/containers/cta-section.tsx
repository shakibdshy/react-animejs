import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { useCopyToClipboard } from '@/landing/hooks/use-copy-to-clipboard';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionLabel } from '@/landing/components/ui/section-label';
import { SectionHeading } from '@/landing/components/ui/section-heading';
import { Btn } from '@/landing/components/ui/btn';

interface CtaSectionProps {
  className?: string;
}

export const CtaSection = memo(function CtaSection({ className }: CtaSectionProps) {
  const [labelRef, labelVisible] = useScrollReveal();
  const [headingRef, headingVisible] = useScrollReveal();
  const { copied, copy } = useCopyToClipboard();
  const installCmd = 'npm install react-animejs animejs';

  return (
    <LandingContainer
      as="section"
      id="install"
      className={cn('py-30 pb-30 text-center', className)}
    >
      <div
        ref={labelRef}
        className={cn(
          labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionLabel className="text-center">Get started</SectionLabel>
      </div>
      <div
        ref={headingRef}
        className={cn(
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionHeading centered className="max-w-150 mx-auto">
          One command. Zero config.
        </SectionHeading>
      </div>

      <div className="mb-8 inline-block text-left min-w-[320px] max-w-full">
        <div className="rounded-xl border border-landing-border overflow-hidden bg-landing-bg/80">
          <div className="flex justify-between items-center px-4 py-3 bg-landing-surface border-b border-landing-border">
            <span className="landing-font-mono text-[11px] text-landing-muted uppercase tracking-wider">
              Terminal
            </span>
            <button
              onClick={() => void copy(installCmd)}
              className="bg-transparent border-none text-landing-muted cursor-pointer text-xs px-2 py-1 rounded hover:text-landing-fg transition-colors duration-200 landing-font-mono"
              aria-label={copied ? 'Copied' : 'Copy install command'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="px-4 py-4 text-center">
            <code>
              npm install <span className="text-landing-accent">react-motion</span> animejs
            </code>
          </pre>
        </div>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Btn href="#demos">View documentation {'\u2192'}</Btn>
        <Btn variant="secondary" href="https://github.com">
          GitHub {'\u2605'}
        </Btn>
      </div>
    </LandingContainer>
  );
});
