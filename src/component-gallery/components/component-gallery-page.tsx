import { memo } from 'react';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { useDemoFilter } from '../hooks';
import { ComponentGalleryShell } from './component-gallery-shell';
import { FilterBar } from './filter-bar';
import { GalleryCard } from './gallery-card';

export const ComponentGalleryPage = memo(function ComponentGalleryPage() {
  const { category, setCategory, search, setSearch, filtered } = useDemoFilter();

  return (
    <ComponentGalleryShell>
      <ErrorBoundary>
        <section className="pt-28 pb-12 text-center px-6">
          <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
            Explore
          </p>
          <h1 className="landing-font-display text-5xl sm:text-6xl mb-4">Component gallery</h1>
          <p className="text-landing-muted max-w-xl mx-auto text-lg leading-relaxed mt-4">
            Discover the API, try a live preview, and open a Playground only when the interaction needs more room.
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
              <GalleryCard key={demo.componentId} demo={demo} demoIndex={i} />
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
    </ComponentGalleryShell>
  );
});
