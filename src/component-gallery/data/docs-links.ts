import type { DemoId } from './sections';

/**
 * Explicit map from each demo to its canonical docs anchor and the
 * library symbol the demo demonstrates. Verified against the `id`
 * values in src/docs/reference-data.ts. Do NOT slugify from
 * DemoDetail.component (which is free-form, e.g. "AnimeLayout + AnimePresence").
 */
export const demoDocsLinks: Record<
  DemoId,
  { anchor: string; label: string; extras?: string[] }
> = {
  'basic-animation': { anchor: 'use-anime', label: 'useAnime' },
  'svg-morph': {
    anchor: 'anime-morph',
    label: 'AnimeMorph',
    extras: ['use-svg-animation'],
  },
  'svg-draw': {
    anchor: 'anime-draw',
    label: 'AnimeDraw',
    extras: ['use-svg-animation'],
  },
  'svg-motion-path': {
    anchor: 'anime-motion-path',
    label: 'AnimeMotionPath',
    extras: ['use-svg-animation'],
  },
  timer: { anchor: 'use-anime-timer', label: 'useAnimeTimer' },
  timeline: {
    anchor: 'anime-timeline',
    label: 'AnimeTimeline',
    extras: ['use-anime-timeline'],
  },
  draggable: { anchor: 'use-anime-draggable', label: 'useAnimeDraggable' },
  'on-scroll': {
    anchor: 'use-anime-onscroll',
    label: 'useAnimeOnScroll',
    extras: ['anime-scroll'],
  },
  layout: {
    anchor: 'anime-layout',
    label: 'AnimeLayout',
    extras: ['anime-layout-item', 'use-anime-layout'],
  },
  scope: {
    anchor: 'use-anime-scope',
    label: 'useAnimeScope',
    extras: ['anime-scope', 'anime-provider'],
  },
  'split-text': {
    anchor: 'split-text',
    label: 'SplitText',
    extras: ['use-split-text', 'split-text-entry'],
  },
  'toggle-switch': { anchor: 'use-anime', label: 'useAnime' },
  'counter-countdown': { anchor: 'use-anime-timer', label: 'useAnimeTimer' },
  'spinning-cube': { anchor: 'use-anime', label: 'useAnime' },
  'clippath-reveal': { anchor: 'use-anime', label: 'useAnime' },
  'animated-slider': { anchor: 'use-anime', label: 'useAnime' },
  'reorder-list': {
    anchor: 'anime-layout',
    label: 'AnimeLayout',
    extras: ['anime-presence', 'anime-presence-child', 'use-anime-layout'],
  },
  'scroll-linked-animations': {
    anchor: 'use-anime-onscroll',
    label: 'useAnimeOnScroll',
    extras: ['anime-scroll'],
  },
  'scramble-text': { anchor: 'use-anime-scramble', label: 'useAnimeScramble' },
  tooltip: { anchor: 'use-anime', label: 'useAnime', extras: ['anime-component'] },
  'dropdown-menu': { anchor: 'anime-component', label: 'Anime' },
  accordion: { anchor: 'anime-component', label: 'AnimeLayout' },
  'accordion-presence': {
    anchor: 'anime-presence',
    label: 'AnimePresence',
    extras: ['anime-presence-child'],
  },
  toast: { anchor: 'anime-presence', label: 'AnimePresence', extras: ['anime-presence-child'] },
  tabs: { anchor: 'anime-component', label: 'Anime' },
};
