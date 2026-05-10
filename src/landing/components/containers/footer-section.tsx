import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import type { FooterColumn, NavItem } from '@/landing/types';

const defaultProductLinks: NavItem[] = [
  { label: 'Components', href: '/demos' },
  { label: 'Documentation', href: '#code' },
  { label: 'Install', href: '#install' },
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
        'pt-20 pb-10 border-t border-landing-border',
        'transition-all duration-600',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
    >
      <div className="max-w-300 mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <a
              href="#"
              className="landing-font-display text-[22px] font-bold tracking-tight text-landing-fg no-underline hover:no-underline"
            >
              React AnimeJS <em className="not-italic text-landing-accent">{'\u2726'}</em>
            </a>
            <p className="text-sm text-landing-muted mt-3 max-w-70 leading-relaxed">
              Beautiful React animations, powered by anime.js. Built for
              developers who care about motion.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs uppercase tracking-widest text-landing-muted mb-4 landing-font-mono">
                {col.heading}
              </h4>
              {col.links.map((link) => {
                const linkClass = "block text-sm text-landing-muted mb-2.5 hover:text-landing-fg transition-colors duration-200 no-underline";
                const isRoute = link.href.startsWith('/');
                return isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-landing-border flex justify-between items-center text-[13px] text-landing-muted">
          <span>{'\u00A9'} 2026 React AnimeJS. MIT license.</span>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-landing-muted hover:text-landing-accent transition-colors duration-200 no-underline"
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
