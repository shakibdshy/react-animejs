import { BookOpen, ChevronRight, X } from 'lucide-react';
import { docsNavigation } from '../data';

interface DocsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export function DocsSidebar({ isOpen, onClose, activeSection }: DocsSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close documentation navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
        />
      )}
      <aside
        className={`scroll-themed fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-landing-border bg-landing-bg px-5 pb-8 pt-5 transition-transform md:sticky md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:w-68 md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between md:hidden">
          <span className="landing-font-mono text-xs font-semibold tracking-[0.14em] text-landing-muted uppercase">
            Contents
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-landing-muted"
            aria-label="Close documentation navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-8 hidden items-center gap-2 text-landing-fg md:flex">
          <BookOpen size={15} className="text-landing-accent" />
          <span className="text-sm font-semibold">Documentation</span>
        </div>
        <nav aria-label="Documentation sections">
          {docsNavigation.map((group) => (
            <div key={group.label} className="mb-7">
              <p className="mb-2 px-2 text-xs font-semibold text-landing-fg">{group.label}</p>
              <ul className="m-0 list-none space-y-0.5 border-l border-landing-border p-0 pl-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className={`group relative flex items-center justify-between rounded-md px-2 py-1.5 text-sm no-underline transition ${activeSection === item.href.slice(1) ? 'bg-landing-accent/10 font-medium text-landing-accent before:absolute before:-left-2.25 before:h-5 before:w-px before:bg-landing-accent' : 'text-landing-muted hover:bg-landing-surface hover:text-landing-fg'}`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        size={13}
                        className={`transition ${activeSection === item.href.slice(1) ? 'opacity-80' : 'opacity-0 group-hover:translate-x-0.5 group-hover:opacity-60'}`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
