# Changelog

All notable changes to the **react-animejs-demo-docs** project (the docs & demos site for [`@shakibdshy/react-animejs`](https://www.npmjs.com/package/@shakibdshy/react-animejs)) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Tags are prefixed with `site-` to distinguish the docs-site releases from the published npm package's version tags (`v1.0.x`), since both share the [`shakibdshy/react-animejs`](https://github.com/shakibdshy/react-animejs) GitHub repository.

## [site-1.0.0] - 2026-07-31

Initial public release of the documentation & demos site. This consolidated release covers 163 commits spanning January–July 2026, organized below by the phases visible in the project history.

### Foundation & tooling
- Scaffolded a React + anime.js project with Vite and pnpm.
- Configured Prettier and ESLint (with import sorting) for consistent code style.
- Established the file-based route structure and global styles.

### Library API coverage demos
- Added comprehensive demos covering the full `@shakibdshy/react-animejs` API surface:
  - `AnimeScope` / `useAnimeScope` scoped selector resolution and callback handling.
  - `AnimeTimeline` declarative timeline management, labels, and advanced methods (`refresh`, `revert`, `stretch`, playback rate scaling, WAAPI support).
  - `useAnimatable` and Animatable methods, with event hook visualization.
  - Full Anime.js v4 Draggable API support.
  - `useAnimeLayout` / `AnimeLayout` auto-layout (FLIP) animations with animating-state tracking.
  - `SplitText` (plus `HorizontalSplitText`) text animation hook and component.
  - `AnimeWAAPI` declarative WAAPI animations.
  - `useAnimeOnScroll` scroll-driven animations and native scroll-observer autoplay.
  - `AnimatePresence` with `sync`, `wait`, and `popLayout` modes (later `AnimePresence` with auto-resolved `height: 'auto'`).
  - `Counter` / `Countdown` odometer components, animated `ToggleSwitch`, `SpinningCube`, `ClipPathReveal`, animated `Slider`, and reorder-list (`AnimeLayout`) components.
  - SVG path drawing demos, `ScrambleText` hook, interactive Easings and Utilities demo pages.
- Integrated Anime.js v4.5.0 adapters via an idempotent registration system (new hooks, components, and registries).

### Blocks showcase
- Added the `/blocks` route and showcase navigation.
- Built out larger self-contained animation patterns, including:
  - Apple-style scroll image sequence, layered pinning, and OrchestratedEaseReverse (custom exit animation timelines).
  - ScrollShader velocity distortion, scroll image comparison, and continuous sections demos.
  - Canvas particles timeline, dynamic shape overlays, and sequential path morph (`AnimeMorph`).
  - macOS dock fisheye, cursor-tracking image preview, bento grid scroll flip, and grid flip (declarative React FLIP) blocks.
  - `AnimeBatch` component and scroll batch gallery with stagger-type updates.

### Documentation site
- Built the full `/docs` route with API reference data covering hooks, components, presets, and stagger helpers.
- Added syntax-highlighted code blocks via `prism-react-renderer`.

### Component gallery & UX redesign
- Introduced the `/demos` interactive component gallery with filtering and detail overlays.
- Redesigned the gallery UX: sort, tag, and difficulty filters backed by URL search params, empty state, and `SortKey`/`Difficulty` types.
- Added `⌘K` command palette wired into the gallery shell, plus tag/difficulty/related-components/docs-link metadata on cards and detail pages.
- Added code snippet modals and a back-to-top control.
- Added Tier 1 UI demos: Tooltip (3 hover variants), Dropdown (staggered entrance, absolute positioning), Accordion (imperative `animate()` + `AnimePresence`/`AnimeLayout` height animation), Toast, and Tabs.
- Added docs-link map and cross-link contract tests.

### Landing page redesign
- Designed a new marketing landing page (hero, features, code showcase, CTA).
- Added an animated wordmark (per-letter fade + rise), a header GitHub link, and footer polish.
- Added syntax-highlighted code showcase, including a `GridFlipModal` registry entry.

### Maintenance & quality
- Switched from a local library copy to consuming `@shakibdshy/react-animejs` from the npm registry (updated install/import samples to the scoped package name).
- Extracted the theme system (light/dark) and stabilized the anime hooks.
- Integrated React Compiler for automatic memoization.
- Numerous accessibility and animation-polish fixes across the gallery and blocks.

[site-1.0.0]: https://github.com/shakibdshy/react-animejs/releases/tag/site-v1.0.0
