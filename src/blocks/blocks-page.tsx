import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimeProvider } from '@/lib/react-animejs';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { CursorTrailImagesDemo } from '@/demo/components/CursorTrailImagesDemo';

/**
 * BlocksPage — a showcase page for standalone "block" examples (self-contained
 * patterns that aren't part of the component gallery). Mirrors the DemosPage
 * shell so it reads as a sibling page, and renders its own header (the root
 * layout hides the sidebar Header on top-level pages).
 */
export const BlocksPage = memo(function BlocksPage() {
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
            React AnimeJS <em className="not-italic text-landing-accent">{'✦'}</em>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Home
            </Link>
            <Link
              to="/demos"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Components
            </Link>
            <Link to="/blocks" className="text-sm text-landing-accent font-medium no-underline">
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

        <ErrorBoundary>
          <section className="pt-28 pb-12 text-center px-6">
            <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
              Blocks
            </p>
            <h1 className="landing-font-display text-4xl md:text-5xl font-bold tracking-tight text-landing-fg mb-4">
              Example blocks
            </h1>
            <p className="text-base text-landing-muted max-w-xl mx-auto">
              Self-contained patterns built with react-animejs — copy-paste
              starting points you can drop into your own app.
            </p>
          </section>

          <div className="max-w-300 mx-auto px-6 pb-20">
            {/* Cursor Trail with Images */}
            <section className="mb-16">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="landing-font-display text-xl font-bold text-landing-fg">
                  Cursor Trail · Images
                </h2>
                <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70">
                  useAnimatable
                </span>
              </div>
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A queue of sprites, each owning its own <code className="landing-font-mono text-landing-accent">useAnimatable</code>{' '}
                x/y. On <code className="landing-font-mono">pointermove</code> every sprite eases toward the
                cursor with a progressively longer duration — the head follows tight, the tail lags.
              </p>
              <ErrorBoundary>
                <CursorTrailImagesDemo />
              </ErrorBoundary>
            </section>
          </div>

          <footer className="border-t border-landing-border py-8 text-center">
            <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/60">
              React AnimeJS {'✦'}
            </span>
          </footer>
        </ErrorBoundary>
      </div>
    </AnimeProvider>
  );
});
