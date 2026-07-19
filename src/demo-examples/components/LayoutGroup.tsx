import React, { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimeProvider } from "@/lib/react-animejs";
import { ErrorBoundary } from "@/landing/components/ui/error-boundary";
import { LayoutDemo } from "./LayoutDemo";
import { LayoutSettingsDemo } from "./LayoutSettingsDemo";
import { LayoutEnterExitDemo } from "./LayoutEnterExitDemo";
import { LayoutStaggerDemo } from "./LayoutStaggerDemo";
import { LayoutMethodsDemo } from "./LayoutMethodsDemo";
import { AnimeLayoutComponentDemo } from "./AnimeLayoutComponentDemo";
import { Grid, Layout, PlayCircle, Sliders } from "lucide-react";

export const LayoutGroup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"grid" | "timing" | "transitions">("grid");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("demo-theme");
    const preferDark = stored !== null ? stored === "dark" : true;
    setIsDark(preferDark);
    document.documentElement.classList.toggle("dark", preferDark);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("demo-theme", next ? "dark" : "light");
  }, [isDark]);

  return (
    <AnimeProvider>
      <div className="min-h-screen bg-landing-bg text-landing-fg transition-[background,color] duration-[0.35s] ease-in-out">
        {/* Navigation Header */}
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
            <Link
              to="/demos"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Components
            </Link>
            <span className="text-sm text-landing-accent font-semibold flex items-center gap-1.5 cursor-default">
              <Layout size={14} className="animate-pulse" /> Layouts
            </span>
            <button
              onClick={toggleTheme}
              className="bg-transparent border border-landing-border rounded-full w-10 h-10 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <ErrorBoundary>
          <section className="pt-28 pb-10 text-center px-6">
            <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
              Interactive Showcase
            </p>
            <h1 className="landing-font-display text-5xl sm:text-6xl mb-4 font-bold tracking-tight leading-[1.05]">
              Layout Animations
            </h1>
            <p className="text-landing-muted max-w-xl mx-auto text-lg leading-relaxed mt-4">
              Fluid, magical transitions using the high-performance FLIP animation technique. Transform lists, grids, and flexboxes seamlessly.
            </p>
          </section>
        </ErrorBoundary>

        {/* Custom Tab Bar */}
        <div className="max-w-300 mx-auto px-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-landing-surface border border-landing-border rounded-2xl">
            <button
              onClick={() => setActiveTab("grid")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "grid"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:text-landing-fg hover:bg-landing-bg/50"
              }`}
            >
              <Grid size={14} />
              Grid Transformations
            </button>
            <button
              onClick={() => setActiveTab("timing")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "timing"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:text-landing-fg hover:bg-landing-bg/50"
              }`}
            >
              <Sliders size={14} />
              Sequence & Timing
            </button>
            <button
              onClick={() => setActiveTab("transitions")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "transitions"
                  ? "bg-landing-accent text-landing-bg shadow-md shadow-landing-accent/15"
                  : "text-landing-muted hover:text-landing-fg hover:bg-landing-bg/50"
              }`}
            >
              <PlayCircle size={14} />
              Transitions & Methods
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <main className="max-w-300 mx-auto px-6 pb-24">
          <ErrorBoundary>
            {activeTab === "grid" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <LayoutDemo />
                <AnimeLayoutComponentDemo />
              </div>
            )}
            {activeTab === "timing" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <LayoutSettingsDemo />
                <LayoutStaggerDemo />
              </div>
            )}
            {activeTab === "transitions" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <LayoutEnterExitDemo />
                <LayoutMethodsDemo />
              </div>
            )}
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="border-t border-landing-border py-12 text-center bg-landing-surface/30">
          <span className="landing-font-display text-sm text-landing-muted">React AnimeJS ✦ Built with precision</span>
        </footer>
      </div>
      
      <style>{`
        .animate-fade-in {
          animation: tabFade 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AnimeProvider>
  );
};

export default LayoutGroup;
