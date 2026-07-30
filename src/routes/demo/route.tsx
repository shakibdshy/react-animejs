import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AnimeProvider } from "@shakibdshy/react-animejs";
import { useTheme } from "@/theme";

export const Route = createFileRoute("/demo")({
  component: DemoLayout,
});

function DemoLayout() {
  const { isDark, toggleTheme } = useTheme();

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
            <Link
              to="/demos"
              className="text-sm text-landing-accent font-medium no-underline"
            >
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
              {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </button>
          </nav>
        </header>
        <main className="demo-examples-page relative isolate overflow-hidden pt-28 pb-24 px-6">
          <div aria-hidden="true" className="demo-examples-glow demo-examples-glow-left" />
          <div aria-hidden="true" className="demo-examples-glow demo-examples-glow-right" />
          <div className="relative mx-auto max-w-360">
            <div className="mb-10 flex items-center gap-3 landing-font-mono text-[11px] uppercase tracking-[0.22em] text-landing-muted">
              <span className="h-px w-8 bg-landing-accent" />
              Advanced Playgrounds
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </AnimeProvider>
  );
}
