import { Link } from '@tanstack/react-router';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/theme';

interface DocsHeaderProps {
  onOpenNavigation: () => void;
}

export function DocsHeader({ onOpenNavigation }: DocsHeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-landing-border bg-landing-bg/90 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenNavigation}
        className="mr-3 flex h-9 w-9 items-center justify-center rounded border border-landing-border text-landing-muted md:hidden"
        aria-label="Open documentation navigation"
      >
        <Menu size={18} />
      </button>
      <Link
        to="/"
        className="landing-font-display text-lg font-bold tracking-tight text-landing-fg no-underline"
      >
        React AnimeJS <em className="not-italic text-landing-accent">✦</em>
      </Link>
      <span className="mx-3 hidden h-5 w-px bg-landing-border sm:block" />
      <span className="hidden landing-font-mono text-[11px] font-semibold tracking-[0.15em] text-landing-muted uppercase sm:block">
        Documentation
      </span>
      <nav className="ml-auto flex items-center gap-5" aria-label="Documentation navigation">
        <Link
          to="/demos"
          className="hidden text-sm font-medium text-landing-muted no-underline transition hover:text-landing-fg sm:block"
        >
          Components
        </Link>
        <Link
          to="/blocks"
          className="hidden text-sm font-medium text-landing-muted no-underline transition hover:text-landing-fg sm:block"
        >
          Blocks
        </Link>
        <Link to="/docs" className="text-sm font-semibold text-landing-fg no-underline">
          Docs
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-landing-border text-landing-muted transition hover:bg-landing-surface hover:text-landing-fg"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
    </header>
  );
}
