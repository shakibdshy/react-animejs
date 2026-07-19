import { List } from 'lucide-react';

const items = [
  {
    href: '#installation',
    label: 'Installation',
    sectionIds: ['installation', 'first-animation', 'core-concepts'],
  },
  {
    href: '#use-anime',
    label: 'Hooks',
    sectionIds: [
      'use-anime',
      'use-anime-timer',
      'use-anime-timeline',
      'use-anime-layout',
      'use-anime-draggable',
      'use-anime-onscroll',
      'use-anime-controls',
      'use-anime-waapi',
      'use-anime-scope',
      'use-split-text',
      'use-animatable',
      'use-animatable-event',
      'use-anime-adapter',
      'use-svg-animation',
      'use-anime-scramble',
    ],
  },
  {
    href: '#anime-provider',
    label: 'Components',
    sectionIds: [
      'anime-provider',
      'anime-component',
      'anime-scroll',
      'anime-batch',
      'anime-draw',
      'anime-morph',
      'anime-motion-path',
      'anime-presence',
      'anime-presence-child',
      'anime-layout',
      'anime-layout-item',
      'anime-timeline',
      'anime-waapi',
      'anime-adapter',
      'anime-scope',
      'split-text',
      'split-text-entry',
    ],
  },
  {
    href: '#utilities',
    label: 'Utilities',
    sectionIds: ['utilities', 'animejs-exports', 'typescript'],
  },
];

interface DocsOutlineProps {
  activeSection: string;
}

export function DocsOutline({ activeSection }: DocsOutlineProps) {
  return (
    <aside className="sticky top-28 hidden h-fit xl:block" aria-label="On this page">
      <div className="border-l border-landing-border pl-5">
        <div className="mb-3 flex items-center gap-2 text-landing-muted">
          <List size={14} />
          <span className="text-xs font-medium">On this page</span>
        </div>
        <nav>
          <ul className="m-0 list-none space-y-2 p-0">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`relative block text-[13px] no-underline transition ${item.sectionIds.includes(activeSection) ? 'font-medium text-landing-accent before:absolute before:-left-5.25 before:top-0.5 before:h-4 before:w-px before:bg-landing-accent' : 'text-landing-muted hover:text-landing-accent'}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
