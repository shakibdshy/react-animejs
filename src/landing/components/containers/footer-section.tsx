import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import type { FooterColumn, NavItem } from '@/landing/types';

const defaultProductLinks: NavItem[] = [
  { label: 'Components', href: '/demos' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Blocks', href: '/blocks' },
  { label: 'Changelog', href: '#' },
];

const defaultCommunityLinks: NavItem[] = [
  { label: 'GitHub', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Stack Overflow', href: '#' },
];

const defaultCompanyLinks: NavItem[] = [
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Brand', href: '#' },
  { label: 'Contact', href: '#' },
];

const defaultFooterColumns: FooterColumn[] = [
  { heading: 'Product', links: defaultProductLinks },
  { heading: 'Community', links: defaultCommunityLinks },
  { heading: 'Company', links: defaultCompanyLinks },
];

const defaultSocials: NavItem[] = [
  { label: 'GitHub', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Discord', href: '#' },
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
        <a
          href="#"
          className="block no-underline hover:no-underline mb-16"
          aria-label="React AnimeJS — back to top"
        >
          <span
            className="landing-font-display font-bold tracking-[-0.03em] leading-[0.85] text-landing-fg"
            style={{ fontSize: 'clamp(56px, 13vw, 168px)' }}
          >
            React AnimeJS{' '}
            <em className="not-italic text-landing-accent">{'\u2726'}</em>
          </span>
        </a>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-landing-border">
          <div>
            <p className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted mb-4">
              The Field Guide
            </p>
            <p className="text-[15px] text-landing-muted leading-relaxed max-w-72">
              Beautiful React animations, powered by anime.js. Built for
              developers who care about motion.
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
          <span className="uppercase">
            {'\u00A9'} 2026 React AnimeJS — MIT licensed
          </span>
          <span className="uppercase opacity-70">
            Set in Iowan Old Style &amp; JetBrains Mono
          </span>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
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
