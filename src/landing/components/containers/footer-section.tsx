import { memo, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import type { FooterColumn, NavItem } from '@/landing/types';

const defaultProductLinks: NavItem[] = [
  { label: 'Components', href: '/demos' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Blocks', href: '/blocks' },
];

const defaultFooterColumns: FooterColumn[] = [
  { heading: 'Product', links: defaultProductLinks },
];

const defaultSocials: NavItem[] = [
  { label: 'GitHub', href: 'https://github.com/shakibdshy/react-animejs' },
];

interface FooterSectionProps {
  columns?: FooterColumn[];
  socials?: NavItem[];
  className?: string;
}

/**
 * Editorial "colophon" footer. The wordmark gets masthead scale, links sit in
 * hairline columns, and the legal line is set in mono small-caps like a
 * printed imprint notice.
 */
export const FooterSection = memo(function FooterSection({
  columns = defaultFooterColumns,
  socials = defaultSocials,
  className,
}: FooterSectionProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  // Split the oversized wordmark into per-letter spans for the same slow,
  // infinite fade+rise loop as the header. Larger lift (em-based) so the
  // motion is visible at 148px. Stagger is wider since there are more letters.
  const wordmarkChars = useMemo(() => [...'React AnimeJS'].map((char, i) => ({
    key: i,
    char,
    delay: `${i * 0.22 + 0.6}s`,
  })), []);

  return (
    <footer
      ref={ref}
      className={cn(
        'border-t border-landing-border',
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
    >
      <div className="max-w-300 mx-auto px-6 pt-24 pb-10">
        {/* Oversized wordmark */}
        <span
          className="block landing-font-display font-bold tracking-[-0.03em] leading-[0.85] text-landing-fg mb-16"
          style={{ fontSize: 'clamp(56px, 13vw, 148px)' }}
          aria-label="React AnimeJS"
        >
          {wordmarkChars.map(({ key, char, delay }) => (
            <span
              key={key}
              className="landing-wordmark-char-lg"
              style={{ animationDelay: delay }}
              aria-hidden="true"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <em className="not-italic text-landing-accent">{'\u2726'}</em>
        </span>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr] gap-10 pb-12 border-b border-landing-border">
          <div>
            <p className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted mb-4">
              The Field Guide
            </p>
            <p className="text-[15px] text-landing-muted leading-relaxed max-w-72">
              Beautiful React animations, powered by anime.js. Built for developers who care about
              motion.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-landing-muted mb-4 landing-font-mono">
                {col.heading}
              </h4>
              {col.links.map((link) => {
                const linkClass =
                  'block text-[14px] text-landing-muted mb-2.5 hover:text-landing-accent transition-colors duration-200 no-underline';
                const isRoute = link.href.startsWith('/');
                return isRoute ? (
                  <Link key={link.label} to={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                );
              })}
            </nav>
          ))}
        </div>

        {/* Colophon line */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[12px] text-landing-muted landing-font-mono tracking-[0.08em]">
          <span className="uppercase">{'\u00A9'} 2026 React AnimeJS — MIT licensed</span>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={s.label}
                className="text-landing-muted hover:text-landing-accent transition-colors duration-200 no-underline uppercase"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});
