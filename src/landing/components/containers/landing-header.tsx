import { memo, useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Github } from 'lucide-react';
import { cn } from '@/landing/utils/cn';
import type { NavItem } from '@/landing/types';
import { useTheme } from '@/theme';

const defaultNavItems: NavItem[] = [
  { label: 'Components', href: '/demos' },
  { label: 'Blocks', href: '/blocks' },
  { label: 'Docs', href: '/docs' },
];

interface LandingHeaderProps {
  navItems?: NavItem[];
  className?: string;
}

/**
 * Floating masthead nav. A single rounded "pill" container holds the
 * wordmark, the route links, and the theme toggle — giving the header a
 * distinct, app-like silhouette rather than a full-width bar.
 */
export const LandingHeader = memo(function LandingHeader({
  navItems = defaultNavItems,
  className,
}: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Split the wordmark into per-letter spans so each can fade+rise on a
  // slow, infinite stagger loop. useMemo keeps the array stable across renders.
  const wordmarkChars = useMemo(() => [...'React AnimeJS'].map((char, i) => ({
    key: i,
    char,
    // Hold each letter off for a beat, then rise in, then settle.
    // Negative offset spreads the start; long delay creates the slow loop gap.
    delay: `${i * 0.18 + 0.4}s`,
  })), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4',
        'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-2 w-full max-w-300',
          'rounded-full pl-6 pr-3 h-14',
          'bg-landing-bg/80 backdrop-blur-xl border border-landing-border',
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled
            ? 'shadow-[0_12px_40px_-18px_color-mix(in_oklch,var(--landing-fg)_30%,transparent)]'
            : 'shadow-none'
        )}
      >
        {/* Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 text-landing-fg no-underline hover:no-underline shrink-0"
          aria-label="React AnimeJS home"
        >
          <span
            className="w-6 h-6 rounded-md flex items-center justify-center text-landing-bg bg-landing-accent"
            style={{ fontSize: '13px' }}
            aria-hidden="true"
          >
            {'\u2726'}
          </span>
          <span className="landing-font-display text-[17px] font-bold tracking-tight landing-wordmark">
            {wordmarkChars.map(({ key, char, delay }) => (
              <span
                key={key}
                className="landing-wordmark-char"
                style={{ animationDelay: delay }}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <span className="sr-only">React AnimeJS</span>
          </span>
        </a>

        {/* Center nav */}
        <nav
          className="hidden sm:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isRoute = item.href.startsWith('/');
            const linkClass =
              'px-3.5 py-1.5 rounded-full text-[13px] font-medium text-landing-muted hover:text-landing-fg hover:bg-landing-surface transition-colors duration-200 no-underline';
            return isRoute ? (
              <Link key={item.href} to={item.href} className={linkClass}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Theme toggle + GitHub */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="bg-transparent border border-landing-border rounded-full w-9 h-9 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>
          <a
            href="https://github.com/shakibdshy/react-animejs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border border-landing-border rounded-full w-9 h-9 cursor-pointer text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
            aria-label="GitHub repository"
            title="GitHub"
          >
            <Github size={16} strokeWidth={2} />
          </a>
          <Link
            to="/demos"
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-landing-fg text-landing-bg text-[13px] font-semibold no-underline hover:bg-landing-accent transition-colors duration-200"
          >
            Get started {'\u2192'}
          </Link>
        </div>
      </div>
    </header>
  );
});
