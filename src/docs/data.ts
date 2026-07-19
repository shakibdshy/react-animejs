export interface DocsNavGroup {
  label: string;
  items: Array<{ href: string; label: string }>;
}

export const docsNavigation: DocsNavGroup[] = [
  {
    label: 'Start here',
    items: [
      { href: '#installation', label: 'Installation' },
      { href: '#first-animation', label: 'First animation' },
      { href: '#core-concepts', label: 'Core concepts' },
    ],
  },
  {
    label: 'Hooks',
    items: hookReferences.map((hook) => ({ href: `#${hook.id}`, label: hook.name })),
  },
  {
    label: 'Components',
    items: componentReferences.map((component) => ({
      href: `#${component.id}`,
      label: component.name,
    })),
  },
  {
    label: 'Utilities & reference',
    items: [
      { href: '#utilities', label: 'Utilities' },
      { href: '#animejs-exports', label: 'Anime.js exports' },
      { href: '#typescript', label: 'TypeScript' },
    ],
  },
];

export interface ApiItem {
  name: string;
  description: string;
  companion?: string;
}

export const additionalHooks: ApiItem[] = [
  {
    name: 'useAnimeControls',
    description: 'Creates a shared controller that coordinates multiple useAnime instances.',
  },
  {
    name: 'useAnimeWAAPI',
    description: 'Runs Web Animations API animations with the same React lifecycle and controls.',
    companion: 'AnimeWAAPI',
  },
  {
    name: 'useAnimeScope',
    description: 'Creates an Anime.js scope with media-query-aware cleanup and shared defaults.',
    companion: 'AnimeScope',
  },
  {
    name: 'useSplitText',
    description: 'Splits text into characters, words, or lines and exposes the splitter lifecycle.',
  },
  {
    name: 'useAnimatable',
    description: 'Creates a reactive animatable value for DOM or non-DOM targets.',
  },
  {
    name: 'useAnimatableEvent',
    description: 'Binds an animatable value to an HTMLElement event.',
  },
  {
    name: 'useAnimeAdapter',
    description:
      'Registers an adapter so custom objects, such as canvas or Three.js objects, can animate.',
    companion: 'AnimeAdapter',
  },
  {
    name: 'useSvgAnimation',
    description:
      'Shared SVG target and playback logic used by the draw, morph, and motion-path components.',
    companion: 'AnimeDraw, AnimeMorph, AnimeMotionPath',
  },
  {
    name: 'useAnimeScramble',
    description: 'Controls Anime.js text scrambling with a React-safe lifecycle.',
  },
];

export const hookBackedComponents: ApiItem[] = [
  {
    name: 'Anime',
    companion: 'useAnime',
    description: 'Declarative single-target animation wrapper.',
  },
  {
    name: 'AnimeScroll',
    companion: 'useAnimeOnScroll',
    description: 'Render-prop scroll observer without an extra wrapper element.',
  },
  {
    name: 'AnimeTimeline',
    companion: 'useAnimeTimeline',
    description: 'Timeline provider with entries, state, controls, and an imperative ref.',
  },
  {
    name: 'AnimeLayout / AnimeLayout.Item',
    companion: 'useAnimeLayout',
    description: 'Declarative FLIP layout animation with individually registered items.',
  },
  {
    name: 'AnimeWAAPI',
    companion: 'useAnimeWAAPI',
    description: 'Declarative Web Animations API wrapper.',
  },
  {
    name: 'AnimeScope',
    companion: 'useAnimeScope',
    description: 'Scope boundary with media queries, defaults, and context for child hooks.',
  },
  {
    name: 'AnimeAdapter',
    companion: 'useAnimeAdapter',
    description: 'Registers a custom animation adapter and renders no DOM node.',
  },
  {
    name: 'AnimeDraw / AnimeMorph / AnimeMotionPath',
    companion: 'useSvgAnimation',
    description: 'SVG primitives backed by the shared SVG animation hook.',
  },
  {
    name: 'AnimePresence / AnimePresenceChild',
    companion: 'useAnime',
    description: 'Mount and unmount transitions driven by the core animation hook.',
  },
];

export const compositionComponents: ApiItem[] = [
  { name: 'AnimeProvider', description: 'Provides a shared animation scope for descendant hooks.' },
  {
    name: 'AnimeBatch',
    description: 'Observes data-anime-batch children and animates them in viewport batches.',
  },
  {
    name: 'SplitText',
    description: 'Declarative text splitting with a splitter ref and readiness callback.',
  },
  {
    name: 'SplitTextEntry',
    description: 'Registers a chars, words, or lines entry with a parent AnimeTimeline.',
  },
];
import { componentReferences, hookReferences } from './reference-data';
