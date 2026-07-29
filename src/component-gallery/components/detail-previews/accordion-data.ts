export const ACCORDION_ITEMS = [
  {
    title: 'What is react-animejs?',
    body: 'A React wrapper around anime.js v4 — hooks-first, with declarative components where they help.',
  },
  {
    title: 'Do I need anime.js installed?',
    body: 'Yes. Install animejs separately; this package wraps its primitives.',
  },
  {
    title: 'Is it SSR-safe?',
    body: 'Hooks access browser APIs inside effects, so they render safely on the server.',
  },
] as const;
