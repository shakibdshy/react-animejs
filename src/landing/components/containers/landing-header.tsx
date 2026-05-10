import { memo, useCallback, useEffect, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import type { NavItem } from '@/landing/types';

const defaultNavItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Components', href: '#demos' },
  { label: 'Docs', href: '#code' },
  { label: 'Community', href: '#testimonials' },
];

interface LandingHeaderProps {
  navItems?: NavItem[];
  className?: string;
}

export const LandingHeader = memo(function LandingHeader({
  navItems = defaultNavItems,
  className,
}: LandingHeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('demo-theme');
    const preferDark = stored !== null ? stored === 'dark' : true;
    setIsDark(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('demo-theme', next ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6',
        'bg-landing-bg/85 backdrop-blur-xl border-b border-landing-border',
        'transition-[background,border-color] duration-[0.35s] ease-in-out',
        className
      )}
    >
      <a
        href="#"
        className="landing-font-display text-lg font-bold tracking-tight text-landing-fg no-underline hover:no-underline"
      >
        React AnimeJS <em className="not-italic text-landing-accent">{'\u2726'}</em>
      </a>
      <nav className="flex items-center gap-8" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline hidden sm:block"
          >
            {item.label}
          </a>
        ))}
        <button
          onClick={toggleTheme}
          className="bg-transparent border border-landing-border rounded-full w-10 h-10 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </button>
      </nav>
    </header>
  );
});
