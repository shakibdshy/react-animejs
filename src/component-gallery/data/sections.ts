import type { DemoSection } from '../types';

export const demoSections = [
  {
    title: 'Basic Animation',
    path: '/demo/core-features',
    description: 'Animate targets with CSS selectors, stagger, easing, and callbacks',
    category: 'core',
    componentId: 'basic-animation',
  },

  {
    title: 'SVG Morph',
    path: '/demo/svg',
    description: 'Morph between different SVG path shapes smoothly',
    category: 'svg',
    componentId: 'svg-morph',
  },
  {
    title: 'SVG Draw',
    path: '/demo/svg',
    description: 'Animate SVG path drawing with stroke-dashoffset',
    category: 'svg',
    componentId: 'svg-draw',
  },
  {
    title: 'SVG Motion Path',
    path: '/demo/svg',
    description: 'Move elements along an SVG motion path',
    category: 'svg',
    componentId: 'svg-motion-path',
  },

  {
    title: 'Timer',
    path: '/demo/timers',
    description: 'Standalone timer with playback controls, callbacks, and methods',
    category: 'core',
    componentId: 'timer',
  },

  {
    title: 'Timeline',
    path: '/demo/timelines',
    description: 'Sequenced timeline animations with sync, labels, and methods',
    category: 'core',
    componentId: 'timeline',
  },

  {
    title: 'Draggable',
    path: '/demo/draggable',
    description: 'Physics-based drag with snap, spring release, and programmatic controls',
    category: 'interaction',
    componentId: 'draggable',
  },

  {
    title: 'On Scroll',
    path: '/demo/onscroll',
    description: 'Scroll-linked animation with enter/leave callbacks and progress tracking',
    category: 'scroll',
    componentId: 'on-scroll',
  },

  {
    title: 'Layout',
    path: '/demo/layout',
    description: 'FLIP-based layout animations with enter/exit, stagger, and methods',
    category: 'core',
    componentId: 'layout',
  },

  {
    title: 'Scope',
    path: '/demo/scope',
    description: 'Animation scopes with media queries, methods, and keepTime',
    category: 'core',
    componentId: 'scope',
  },

  {
    title: 'Split Text',
    path: '/demo/split-text',
    description: 'Text splitting into chars, words, lines with CJK and effects',
    category: 'core',
    componentId: 'split-text',
  },

  {
    title: 'Toggle Switch',
    path: '/demo/toggle-switch',
    description: 'Animated toggle switch with styled and disabled states',
    category: 'ui',
    componentId: 'toggle-switch',
  },

  {
    title: 'Counter & Countdown',
    path: '/demo/counter-countdown',
    description: 'Animated counter and countdown with padding and format options',
    category: 'ui',
    componentId: 'counter-countdown',
  },

  {
    title: 'Spinning Cube',
    path: '/demo/spinning-cube',
    description: '3D cube rotation with speed variants and interactive controls',
    category: 'ui',
    componentId: 'spinning-cube',
  },

  {
    title: 'ClipPath Reveal',
    path: '/demo/clippath-reveal',
    description: 'Circle, diamond, star, and wipe clipPath reveal animations',
    category: 'svg',
    componentId: 'clippath-reveal',
  },

  {
    title: 'Animated Slider',
    path: '/demo/animated-slider',
    description: 'Slide, fade, scale, flip transitions with visual slide showcase',
    category: 'ui',
    componentId: 'animated-slider',
  },

  {
    title: 'Reorder List',
    path: '/demo/reorder-list',
    description: 'FLIP-based shuffle, move, add/remove, and grid reorder animations',
    category: 'ui',
    componentId: 'reorder-list',
  },

  {
    title: 'Scroll-Linked Animations',
    path: '/demo/scroll-linked-animations',
    description: 'Parallax depth, reveal columns, conveyor, morph tile, and wave bar',
    category: 'scroll',
    componentId: 'scroll-linked-animations',
  },

  {
    title: 'Scramble Text',
    path: '/demo/scramble-text',
    description: 'Text scramble animation with autoplay, loop, and custom chars',
    category: 'ui',
    componentId: 'scramble-text',
  },
] as const satisfies readonly DemoSection[];

export type DemoId = (typeof demoSections)[number]['componentId'];
