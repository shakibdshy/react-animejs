import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimeProvider } from '@/lib/react-animejs';
import { CommandPalette } from './command-palette';

interface ComponentGalleryShellProps {
  children: ReactNode;
}

/** Shared application shell for the component catalog and canonical details. */
export function ComponentGalleryShell({ children }: ComponentGalleryShellProps) {
  const [isDark, setIsDark] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demo-theme');
    const preferDark = stored !== null ? stored === 'dark' : true;
    setIsDark(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);
  }, []);

  // ⌘K / Ctrl+K toggles the command palette. Lives in the shell so it works
  // on both the gallery index and the detail pages.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-landing-border bg-landing-surface text-xs text-landing-muted hover:border-landing-accent hover:text-landing-accent transition-all"
              aria-label="Open command palette"
            >
              <span className="landing-font-mono">Search</span>
              <kbd className="landing-font-mono text-[10px] px-1 py-0.5 rounded border border-landing-border">
                ⌘K
              </kbd>
            </button>
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
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </AnimeProvider>
  );
}
