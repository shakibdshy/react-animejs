import type { DemoSection } from '../types';

export const demoSections = [
  {
    title: 'Basic Animation',
    playgroundPath: '/demo/core-features',
    description: 'Animate targets with CSS selectors, stagger, easing, and callbacks',
    category: 'core',
    componentId: 'basic-animation',
  },

  {
    title: 'SVG Morph',
    playgroundPath: '/demo/svg',
    description: 'Morph between different SVG path shapes smoothly',
    category: 'svg',
    componentId: 'svg-morph',
  },
  {
    title: 'SVG Draw',
    playgroundPath: '/demo/svg',
    description: 'Animate SVG path drawing with stroke-dashoffset',
    category: 'svg',
    componentId: 'svg-draw',
  },
  {
    title: 'SVG Motion Path',
    playgroundPath: '/demo/svg',
    description: 'Move elements along an SVG motion path',
    category: 'svg',
    componentId: 'svg-motion-path',
  },

  {
    title: 'Timer',
    playgroundPath: '/demo/timers',
    description: 'Standalone timer with playback controls, callbacks, and methods',
    category: 'core',
    componentId: 'timer',
  },

  {
    title: 'Timeline',
    playgroundPath: '/demo/timelines',
    hasPlayground: true,
    description: 'Sequenced timeline animations with sync, labels, and methods',
    category: 'core',
    componentId: 'timeline',
  },

  {
    title: 'Draggable',
    playgroundPath: '/demo/draggable',
    hasPlayground: true,
    description: 'Physics-based drag with snap, spring release, and programmatic controls',
    category: 'interaction',
    componentId: 'draggable',
  },

  {
    title: 'On Scroll',
    playgroundPath: '/demo/onscroll',
    hasPlayground: true,
    description: 'Scroll-linked animation with enter/leave callbacks and progress tracking',
    category: 'scroll',
    componentId: 'on-scroll',
  },

  {
    title: 'Layout',
    playgroundPath: '/demo/layout',
    hasPlayground: true,
    description: 'FLIP-based layout animations with enter/exit, stagger, and methods',
    category: 'core',
    componentId: 'layout',
  },

  {
    title: 'Scope',
    playgroundPath: '/demo/scope',
    hasPlayground: true,
    description: 'Animation scopes with media queries, methods, and keepTime',
    category: 'core',
    componentId: 'scope',
  },

  {
    title: 'Split Text',
    playgroundPath: '/demo/split-text',
    hasPlayground: true,
    description: 'Text splitting into chars, words, lines with CJK and effects',
    category: 'core',
    componentId: 'split-text',
  },

  {
    title: 'Toggle Switch',
    playgroundPath: '/demo/toggle-switch',
    description: 'Animated toggle switch with styled and disabled states',
    category: 'ui',
    componentId: 'toggle-switch',
  },

  {
    title: 'Counter & Countdown',
    playgroundPath: '/demo/counter-countdown',
    description: 'Animated counter and countdown with padding and format options',
    category: 'ui',
    componentId: 'counter-countdown',
  },

  {
    title: 'Spinning Cube',
    playgroundPath: '/demo/spinning-cube',
    description: '3D cube rotation with speed variants and interactive controls',
    category: 'ui',
    componentId: 'spinning-cube',
  },

  {
    title: 'ClipPath Reveal',
    playgroundPath: '/demo/clippath-reveal',
    description: 'Circle, diamond, star, and wipe clipPath reveal animations',
    category: 'svg',
    componentId: 'clippath-reveal',
  },

  {
    title: 'Animated Slider',
    playgroundPath: '/demo/animated-slider',
    description: 'Slide, fade, scale, flip transitions with visual slide showcase',
    category: 'ui',
    componentId: 'animated-slider',
  },

  {
    title: 'Reorder List',
    playgroundPath: '/demo/reorder-list',
    hasPlayground: true,
    description: 'FLIP-based shuffle, move, add/remove, and grid reorder animations',
    category: 'ui',
    componentId: 'reorder-list',
  },

  {
    title: 'Scroll-Linked Animations',
    playgroundPath: '/demo/scroll-linked-animations',
    hasPlayground: true,
    description: 'Parallax depth, reveal columns, conveyor, morph tile, and wave bar',
    category: 'scroll',
    componentId: 'scroll-linked-animations',
  },

  {
    title: 'Scramble Text',
    playgroundPath: '/demo/scramble-text',
    description: 'Text scramble animation with autoplay, loop, and custom chars',
    category: 'ui',
    componentId: 'scramble-text',
  },
] as const satisfies readonly DemoSection[];

export type DemoId = (typeof demoSections)[number]['componentId'];

export function isDemoId(value: string): value is DemoId {
  return demoSections.some((demo) => demo.componentId === value);
}
