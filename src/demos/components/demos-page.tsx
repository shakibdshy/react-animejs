import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimeProvider } from '@/lib/react-animejs';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { useDemoFilter, useDetailOverlay } from '../hooks';
import { FilterBar } from './filter-bar';
import { GalleryCard } from './gallery-card';
import { DetailOverlay } from './detail-overlay';

export const DemosPage = memo(function DemosPage() {
  const { category, setCategory, search, setSearch, filtered } = useDemoFilter();
  const {
    isOpen,
    currentIndex,
    activeDemo,
    openDetail,
    closeDetail,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
    totalFiltered,
  } = useDetailOverlay(filtered);

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
            React AnimeJS <em className="not-italic text-landing-accent">{'\u2726'}</em>
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
            <Link to="/blocks" className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline">
              Blocks
            </Link>
            <button
              onClick={toggleTheme}
              className="bg-transparent border border-landing-border rounded-full w-10 h-10 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </button>
          </nav>
        </header>

        <ErrorBoundary>
          <section className="pt-28 pb-12 text-center px-6">
            <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
              Explore
            </p>
            <h1 className="landing-font-display text-5xl sm:text-6xl mb-4">Component gallery</h1>
            <p className="text-landing-muted max-w-xl mx-auto text-lg leading-relaxed mt-4">
              All available components — previews, code, and API references.
            </p>
          </section>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="max-w-300 mx-auto px-6">
            <FilterBar
              category={category}
              search={search}
              resultCount={filtered.length}
              onCategoryChange={setCategory}
              onSearchChange={setSearch}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filtered.map((demo, i) => (
                <GalleryCard
                  key={demo.componentId}
                  demo={demo}
                  demoIndex={i}
                  onClick={() => openDetail(i)}
                />
              ))}
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <section className="py-16 text-center border-t border-landing-border px-6">
            <h2 className="landing-font-display text-3xl mb-4">Ready to build?</h2>
            <p className="text-landing-muted max-w-md mx-auto mb-8">
              Every component runs on React AnimeJS — install once, animate everywhere.
            </p>
            <code className="inline-block landing-font-mono text-sm text-landing-accent bg-landing-surface border border-landing-border rounded-full px-5 py-2.5">
              npm install react-animejs
            </code>
          </section>
        </ErrorBoundary>

        <footer className="border-t border-landing-border py-10 text-center">
          <span className="landing-font-display text-sm text-landing-muted">React AnimeJS ✦</span>
        </footer>
      </div>

      <DetailOverlay
        isOpen={isOpen}
        activeDemo={activeDemo}
        currentIndex={currentIndex}
        totalFiltered={totalFiltered}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        onClose={closeDetail}
        onNext={goNext}
        onPrev={goPrev}
      />
    </AnimeProvider>
  );
});
