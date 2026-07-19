import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimeProvider } from '@/lib/react-animejs';

interface ComponentGalleryShellProps {
  children: ReactNode;
}

/** Shared application shell for the component catalog and canonical details. */
export function ComponentGalleryShell({ children }: ComponentGalleryShellProps) {
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
    <AnimeProvider>
      <div className="min-h-screen bg-landing-bg text-landing-fg transition-[background,color] duration-[0.35s] ease-in-out">
        <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-landing-bg/85 backdrop-blur-xl border-b border-landing-border transition-[background,border-color] duration-[0.35s] ease-in-out">
          <Link
            to="/"
            className="landing-font-display text-lg font-bold tracking-tight text-landing-fg hover:text-landing-accent transition-colors no-underline"
          >
            React AnimeJS <em className="not-italic text-landing-accent">✦</em>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Home
            </Link>
            <Link to="/demos" className="text-sm text-landing-accent font-medium no-underline">
              Components
            </Link>
            <Link
              to="/blocks"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Blocks
            </Link>
            <button
              onClick={toggleTheme}
              className="bg-transparent border border-landing-border rounded-full w-10 h-10 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
        </header>
        {children}
      </div>
    </AnimeProvider>
  );
}
