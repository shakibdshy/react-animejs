/**
 * CommandPalette — a ⌘K-driven quick-jump dialog for the demos gallery.
 *
 * Mirrors CodeModal's shell (AnimePresence + AnimePresenceChild backdrop/panel,
 * useModalA11y for focus-trap/Escape/scroll-lock). The body is a searchable,
 * keyboard-navigable list of every demo; selecting one navigates to its detail
 * page and closes the palette.
 */
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
import { useModalA11y } from '@/landing/hooks/use-modal-a11y';
import { DIFFICULTY_META, demoSections } from '../data';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette = memo(function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useModalA11y({
    open,
    onClose,
    panelRef,
    initialFocusRef: inputRef,
  });

  // Reset query/selection whenever the palette opens (clean slate each time).
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = q
      ? demoSections.filter((d) =>
          [d.title, d.description, d.componentId, ...(d.tags ?? [])]
            .join(' ')
            .toLowerCase()
            .includes(q),
        )
      : demoSections;
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }, [query]);

  // Clamp activeIndex when results shrink.
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  const selectDemo = (componentId: string) => {
    navigate({ to: '/demos/$componentId', params: { componentId } });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[safeIndex];
      if (selected) selectDemo(selected.componentId);
    }
  };

  return (
    <AnimePresence>
      {open && [
        <AnimePresenceChild
          key="palette-backdrop"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={180}
          ease="outQuad"
        >
          <div className="fixed inset-0 z-1000 bg-black/60 backdrop-blur-sm" aria-hidden />
        </AnimePresenceChild>,
        <AnimePresenceChild
          key="palette-panel"
          enter={{ opacity: [0, 1], scale: [0.96, 1], translateY: [-12, 0] }}
          exit={{ opacity: [1, 0], scale: [1, 0.98], translateY: [0, 8] }}
          duration={240}
          ease="outExpo"
        >
          <div
            ref={panelRef}
            className="fixed inset-0 z-1001 flex items-start justify-center pt-[12vh] p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Jump to component"
          >
            <div className="cm-panel relative w-[min(640px,92vw)] flex flex-col overflow-hidden rounded-2xl border border-landing-border bg-landing-surface shadow-2xl">
              <div className="flex items-center gap-3 border-b border-landing-border px-4 py-3">
                <Search size={16} className="text-landing-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search components…"
                  className="flex-1 bg-transparent outline-none text-sm text-landing-fg placeholder:text-landing-muted"
                  aria-label="Search components"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={
                    results[safeIndex] ? `palette-item-${safeIndex}` : undefined
                  }
                />
                <kbd className="landing-font-mono text-[10px] text-landing-muted px-1.5 py-0.5 rounded border border-landing-border">
                  Esc
                </kbd>
              </div>

              <ul
                id="palette-list"
                role="listbox"
                aria-label="Components"
                className="cm-scroll max-h-[50vh] overflow-auto p-2"
              >
                {results.length === 0 ? (
                  <li className="px-3 py-8 text-center text-sm text-landing-muted">
                    No components match &ldquo;{query}&rdquo;
                  </li>
                ) : (
                  results.map((demo, i) => (
                    <li
                      key={demo.componentId}
                      id={`palette-item-${i}`}
                      role="option"
                      aria-selected={i === safeIndex}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => selectDemo(demo.componentId)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        i === safeIndex
                          ? 'bg-landing-accent/10'
                          : 'hover:bg-landing-accent/5'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-landing-fg truncate">
                            {demo.title}
                          </span>
                          {demo.difficulty && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${DIFFICULTY_META[demo.difficulty].dotClassName}`}
                            />
                          )}
                        </div>
                        <span className="landing-font-mono text-[10px] text-landing-muted/70 uppercase tracking-wider">
                          {demo.category}
                        </span>
                      </div>
                      <span className="text-landing-muted/40 text-xs">↵</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </AnimePresenceChild>,
      ]}
    </AnimePresence>
  );
});
