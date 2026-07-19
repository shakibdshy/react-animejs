import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnimeProvider } from "@/lib/react-animejs/index";

export const Route = createFileRoute("/demo")({
  component: DemoLayout,
});

function DemoLayout() {
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
      <div className="min-h-screen bg-demo-bg text-demo-text transition-[background,color] duration-300">
        <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-6 bg-demo-bg/85 backdrop-blur-xl border-b border-demo-border transition-[background,border-color] duration-300">
          <Link
            to="/"
            className="landing-font-display text-base font-semibold tracking-tight text-demo-text hover:text-demo-accent transition-colors no-underline"
          >
            React AnimeJS <em className="not-italic text-demo-accent">{'\u2726'}</em>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-demo-text-secondary hover:text-demo-text transition-colors duration-200 no-underline"
            >
              Home
            </Link>
            <Link
              to="/demos"
              className="text-sm text-demo-text-secondary hover:text-demo-text transition-colors duration-200 no-underline"
            >
              Gallery
            </Link>
            <button
              onClick={toggleTheme}
              className="bg-transparent border border-demo-border rounded-full w-8 h-8 cursor-pointer text-sm text-demo-text-secondary flex items-center justify-center hover:bg-demo-surface hover:text-demo-text transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </button>
          </nav>
        </header>
        <main className="pt-20 pb-12 px-6 max-w-250 mx-auto">
          <Outlet />
        </main>
      </div>
    </AnimeProvider>
  );
}
