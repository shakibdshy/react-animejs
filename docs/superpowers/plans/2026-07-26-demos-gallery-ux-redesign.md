# Demos Gallery UX & Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/demos` gallery filter state URL-synced, add sorting + tag filtering + a ⌘K command palette, redesign cards/filter-bar, and enrich detail pages with related components, docs cross-links, and difficulty metadata.

**Architecture:** Lift filter state into URL search params via `validateSearch` on the parent `/demos` layout route (so filters survive index↔detail navigation). Rewrite `useDemoFilter` in place to read/write the URL. Extract `CodeModal`'s a11y effect into a reusable `useModalA11y` hook that both `CodeModal` and a new `CommandPalette` consume. Add optional `tags`/`difficulty`/`docsAnchor` fields to `DemoSection` with an explicit `demoDocsLinks` map verified against docs anchors.

**Tech Stack:** TanStack Start + TanStack Router v1.157.15 + React 19 + Tailwind CSS v4 + anime.js v4.5. `AnimePresence`/`AnimePresenceChild` from `@/lib/react-animejs` for palette animations.

## Global Constraints

- **TanStack Router version is exactly 1.157.15.** The `parseAsString*`/`parseAsStringEnum` search-parser helpers do NOT exist in this version — `validateSearch` must be a plain function `(input) => coercedObject` with manual coercion + defaults.
- **API for URL state:** `useSearch({ from: '/demos', strict: false })` to read; `useNavigate({ from: '/demos' })` then `navigate({ to: '.', search: (prev) => ({ ...prev, ...patch }) })` to write.
- **Catalog integrity test** (`src/component-gallery/__tests__/catalog.test.ts`) must keep passing: every `demoSections` entry must have matching `demoDetails`, `galleryPreviewRegistry`, and `previewRegistry` entries.
- **`DemoSection` extensions are all optional** (`tags?`, `difficulty?`, `docsAnchor?`) — no forced migration.
- **`bg-landing-accent`** is the orange accent token (`oklch(58% 0.16 35)` light / `oklch(64% 0.18 35)` dark). Never use off-palette colors like `bg-violet-500`.
- **Fonts:** `landing-font-display` (serif) for headlines, `landing-font-mono` (JetBrains Mono) for eyebrows/labels/numeric.
- **Theme:** `.dark` class on `<html>`; dark is default; persisted via `localStorage['demo-theme']`.
- **Existing `useScrollReveal`** from `@/landing/hooks/use-scroll-reveal` powers card reveal — keep using it.
- **Commit convention:** `feat:`/`refactor:`/`docs:`/`test:` prefixes; conventional commits.

## File Structure

**New files (4):**
- `src/landing/hooks/use-modal-a11y.ts` — extracted a11y effect (focus trap, Escape, scroll lock, focus restore)
- `src/component-gallery/data/docs-links.ts` — explicit `demoId → docs anchor` map
- `src/component-gallery/components/command-palette.tsx` — ⌘K palette composing `useModalA11y`
- (no test files added beyond extending existing `catalog.test.ts`)

**Modified files (12):**
- `src/routes/demos.tsx` — add `validateSearch`
- `src/component-gallery/types.ts` — extend `DemoSection`, add `SortKey`/`Difficulty`
- `src/component-gallery/data/sections.ts` — backfill `tags`/`difficulty`/`docsAnchor`
- `src/component-gallery/data/constants.ts` — add `SORT_OPTIONS`, `DIFFICULTY_META`
- `src/component-gallery/hooks.ts` — rewrite `useDemoFilter` to be URL-backed
- `src/component-gallery/components/component-gallery-page.tsx` — pass new props + empty state
- `src/component-gallery/components/filter-bar.tsx` — add sort selector + tag chips
- `src/component-gallery/components/gallery-card.tsx` — tag/difficulty metadata
- `src/component-gallery/components/component-detail-page.tsx` — related section + docs link + difficulty
- `src/component-gallery/components/component-gallery-shell.tsx` — palette state + ⌘K listener
- `src/blocks/components/CodeModal.tsx` — consume `useModalA11y`
- `src/component-gallery/index.ts` — export new symbols

---

## Task 1: Extract `useModalA11y` from CodeModal (no behavior change)

Extract the focus-trap/Escape/scroll-lock/focus-restore effect from `CodeModal.tsx:39-79` into a reusable hook. This de-risks the command palette (Task 9) and is the only change outside the gallery folder.

**Files:**
- Create: `src/landing/hooks/use-modal-a11y.ts`
- Modify: `src/blocks/components/CodeModal.tsx`
- Modify: `src/landing/hooks/index.ts` (export the new hook)

**Interfaces:**
- Produces: `useModalA11y({ open: boolean; onClose: () => void; panelRef: RefObject<HTMLElement>; initialFocusRef?: RefObject<HTMLElement> }): void`

- [ ] **Step 1: Create the hook by copying CodeModal's effect verbatim**

Create `src/landing/hooks/use-modal-a11y.ts`:

```ts
import { useEffect } from 'react';

interface UseModalA11yOptions {
  /** Whether the modal is currently open. The effect is active only when true. */
  open: boolean;
  /** Called when the user presses Escape. */
  onClose: () => void;
  /** Ref to the modal panel; Tab cycling is constrained to focusable elements inside it. */
  panelRef: React.RefObject<HTMLElement | null>;
  /** Element to focus when the modal opens. Defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Encapsulates the keyboard + focus behavior a modal needs:
 * - locks body scroll while open
 * - restores focus to the previously-focused element on close
 * - moves focus into the panel on open (initialFocusRef, else first focusable)
 * - traps Tab within the panel (cycles first/last)
 * - closes on Escape
 *
 * Extracted from CodeModal so the command palette can reuse identical a11y.
 */
export function useModalA11y({
  open,
  onClose,
  panelRef,
  initialFocusRef,
}: UseModalA11yOptions): void {
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      (initialFocusRef?.current ?? null)?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose, panelRef, initialFocusRef]);
}
```

- [ ] **Step 2: Export the hook from the landing hooks barrel**

In `src/landing/hooks/index.ts`, add `export { useModalA11y } from './use-modal-a11y';`. Read the file first to match its existing export style.

- [ ] **Step 3: Refactor CodeModal to consume the hook**

In `src/blocks/components/CodeModal.tsx`:
1. Add to imports: `import { useModalA11y } from '@/landing/hooks/use-modal-a11y';`
2. Replace the entire `useEffect(() => {...}, [open, onClose])` block at lines ~39-79 with:

```tsx
  useModalA11y({
    open,
    onClose,
    panelRef: dialogRef,
    initialFocusRef: closeButtonRef,
  });
```

Keep the `[copied, setCopied]` state, the copy-reset effect (lines ~82-91), the `showCopied`/`handleCopy` callbacks, and the entire render JSX unchanged. The `dialogRef`/`closeButtonRef`/`onClose` references already exist in the component.

- [ ] **Step 4: Verify CodeModal still works**

Run: `pnpm typecheck`
Expected: no new errors.

Run: `pnpm dev` then open `/blocks`, click a "View code" button, and confirm: Escape closes; Tab cycles within the modal; clicking outside closes; scroll is locked while open; focus returns to the trigger button on close. (Manual smoke — no automated test exists for this modal.)

- [ ] **Step 5: Commit**

```bash
git add src/landing/hooks/use-modal-a11y.ts src/landing/hooks/index.ts src/blocks/components/CodeModal.tsx
git commit -m "refactor: extract useModalA11y hook from CodeModal"
```

---

## Task 2: Extend types and constants (foundation)

Add the new type unions and the catalog's display constants. No behavior change.

**Files:**
- Modify: `src/component-gallery/types.ts`
- Modify: `src/component-gallery/data/constants.ts`

**Interfaces:**
- Produces: `SortKey = 'alpha' | 'category' | 'recent'`; `Difficulty = 'beginner' | 'intermediate' | 'advanced'`; extended `DemoSection` with optional `tags`/`difficulty`/`docsAnchor`; `SORT_OPTIONS`; `DIFFICULTY_META`.

- [ ] **Step 1: Extend DemoSection and add unions in types.ts**

In `src/component-gallery/types.ts`, make these edits:

Replace the `DemoSection` interface (lines 3-12) with:

```ts
export type DemoCategory = "core" | "svg" | "scroll" | "interaction" | "ui";

export type SortKey = "alpha" | "category" | "recent";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface DemoSection<TComponentId extends string = string> {
  title: string;
  /** Optional deep-dive route for interactions that need a larger canvas. */
  playgroundPath?: string;
  /** Whether the component earns a dedicated Playground beyond its detail page. */
  hasPlayground?: boolean;
  description: string;
  category: DemoCategory;
  componentId: TComponentId;
  /** Fine-grained topic tags shown on cards and used by the tag filter. */
  tags?: readonly string[];
  /** Skill level; drives a colored badge on cards and the detail page. */
  difficulty?: Difficulty;
  /** Stable docs anchor (e.g. "use-anime") for the "Read the docs" cross-link. */
  docsAnchor?: string;
}
```

Update the unused `FilterState` (lines 28-31) to include the new state for symmetry (used later by the hook and any future tests):

```ts
export interface FilterState {
  category: DemoCategory | "all";
  search: string;
  sort: SortKey;
  tag?: string;
}
```

Keep `DemoPropRow`, `DemoDetail`, and `DetailState` unchanged.

- [ ] **Step 2: Add SORT_OPTIONS and DIFFICULTY_META to constants.ts**

In `src/component-gallery/data/constants.ts`, append after the existing `CATEGORIES`:

```ts
export const SORT_OPTIONS = [
  { id: "alpha", label: "A→Z" },
  { id: "category", label: "Category" },
  { id: "recent", label: "Recent" },
] as const;

export type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

export const DIFFICULTY_META: Record<
  "beginner" | "intermediate" | "advanced",
  { label: string; dotClassName: string; badgeClassName: string }
> = {
  beginner: {
    label: "Beginner",
    dotClassName: "bg-emerald-500",
    badgeClassName: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  intermediate: {
    label: "Intermediate",
    dotClassName: "bg-landing-accent",
    badgeClassName: "text-landing-accent border-landing-accent/30 bg-landing-accent/10",
  },
  advanced: {
    label: "Advanced",
    dotClassName: "bg-rose-500",
    badgeClassName: "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
};
```

Note: `emerald`/`rose` are Tailwind defaults — acceptable accent colors for difficulty badges (semantically meaningful, not arbitrary). They're scoped to small badges, not palette-wide.

- [ ] **Step 3: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/component-gallery/types.ts src/component-gallery/data/constants.ts
git commit -m "feat(gallery): add SortKey/Difficulty types and display constants"
```

---

## Task 3: Backfill tags, difficulty, and docsAnchor on every demo

Populate the new optional fields for all 18 demos. `docsAnchor` values must come from the verified list of valid `ReferenceEntry.id` values in `src/docs/reference-data.ts`.

**Files:**
- Modify: `src/component-gallery/data/sections.ts`

**Interfaces:**
- Consumes: the valid docs anchor IDs (verified list below)
- Produces: every `demoSections` entry has `tags`, `difficulty`, and `docsAnchor` set

Valid docs anchor IDs (from `src/docs/reference-data.ts`):
`anime-adapter, anime-batch, anime-component, anime-draw, anime-layout, anime-layout-item, anime-morph, anime-motion-path, anime-presence, anime-presence-child, anime-provider, anime-scope, anime-scroll, anime-timeline, anime-waapi, split-text, split-text-entry, use-animatable, use-animatable-event, use-anime, use-anime-adapter, use-anime-controls, use-anime-draggable, use-anime-layout, use-anime-onscroll, use-anime-scope, use-anime-scramble, use-anime-timeline, use-anime-timer, use-anime-waapi, use-split-text, use-svg-animation`

- [ ] **Step 1: Add tags/difficulty/docsAnchor to each demo entry**

For each of the 18 entries in `src/component-gallery/data/sections.ts`, add the three fields. The exact values (derived from each demo's `component` field in `details.ts` and its topic):

```ts
{
  title: 'Basic Animation',
  playgroundPath: '/demo/core-features',
  description: 'Animate targets with CSS selectors, stagger, easing, and callbacks',
  category: 'core',
  componentId: 'basic-animation',
  tags: ['stagger', 'easing', 'selectors'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime',
},
{
  title: 'SVG Morph',
  playgroundPath: '/demo/svg',
  description: 'Morph between different SVG path shapes smoothly',
  category: 'svg',
  componentId: 'svg-morph',
  tags: ['svg', 'morph', 'path'],
  difficulty: 'intermediate',
  docsAnchor: 'anime-morph',
},
{
  title: 'SVG Draw',
  playgroundPath: '/demo/svg',
  description: 'Animate SVG path drawing with stroke-dashoffset',
  category: 'svg',
  componentId: 'svg-draw',
  tags: ['svg', 'stroke', 'draw'],
  difficulty: 'intermediate',
  docsAnchor: 'anime-draw',
},
{
  title: 'SVG Motion Path',
  playgroundPath: '/demo/svg',
  description: 'Move elements along an SVG motion path',
  category: 'svg',
  componentId: 'svg-motion-path',
  tags: ['svg', 'motion-path', 'path'],
  difficulty: 'intermediate',
  docsAnchor: 'anime-motion-path',
},
{
  title: 'Timer',
  playgroundPath: '/demo/timers',
  description: 'Standalone timer with playback controls, callbacks, and methods',
  category: 'core',
  componentId: 'timer',
  tags: ['timer', 'loop', 'callbacks'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime-timer',
},
{
  title: 'Timeline',
  playgroundPath: '/demo/timelines',
  hasPlayground: true,
  description: 'Sequenced timeline animations with sync, labels, and methods',
  category: 'core',
  componentId: 'timeline',
  tags: ['timeline', 'sequence', 'sync'],
  difficulty: 'intermediate',
  docsAnchor: 'anime-timeline',
},
{
  title: 'Draggable',
  playgroundPath: '/demo/draggable',
  hasPlayground: true,
  description: 'Physics-based drag with snap, spring release, and programmatic controls',
  category: 'interaction',
  componentId: 'draggable',
  tags: ['drag', 'physics', 'snap'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime-draggable',
},
{
  title: 'On Scroll',
  playgroundPath: '/demo/onscroll',
  hasPlayground: true,
  description: 'Scroll-linked animation with enter/leave callbacks and progress tracking',
  category: 'scroll',
  componentId: 'on-scroll',
  tags: ['scroll', 'callbacks', 'progress'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime-onscroll',
},
{
  title: 'Layout',
  playgroundPath: '/demo/layout',
  hasPlayground: true,
  description: 'FLIP-based layout animations with enter/exit, stagger, and methods',
  category: 'core',
  componentId: 'layout',
  tags: ['layout', 'flip', 'enter-exit'],
  difficulty: 'advanced',
  docsAnchor: 'anime-layout',
},
{
  title: 'Scope',
  playgroundPath: '/demo/scope',
  hasPlayground: true,
  description: 'Animation scopes with media queries, methods, and keepTime',
  category: 'core',
  componentId: 'scope',
  tags: ['scope', 'media-query', 'cleanup'],
  difficulty: 'advanced',
  docsAnchor: 'use-anime-scope',
},
{
  title: 'Split Text',
  playgroundPath: '/demo/split-text',
  hasPlayground: true,
  description: 'Text splitting into chars, words, lines with CJK and effects',
  category: 'core',
  componentId: 'split-text',
  tags: ['text', 'chars', 'words', 'lines'],
  difficulty: 'intermediate',
  docsAnchor: 'split-text',
},
{
  title: 'Toggle Switch',
  playgroundPath: '/demo/toggle-switch',
  description: 'Animated toggle switch with styled and disabled states',
  category: 'ui',
  componentId: 'toggle-switch',
  tags: ['ui', 'toggle', 'states'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime',
},
{
  title: 'Counter & Countdown',
  playgroundPath: '/demo/counter-countdown',
  description: 'Animated counter and countdown with padding and format options',
  category: 'ui',
  componentId: 'counter-countdown',
  tags: ['ui', 'counter', 'countdown'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime-timer',
},
{
  title: 'Spinning Cube',
  playgroundPath: '/demo/spinning-cube',
  description: '3D cube rotation with speed variants and interactive controls',
  category: 'ui',
  componentId: 'spinning-cube',
  tags: ['ui', '3d', 'rotate'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime',
},
{
  title: 'ClipPath Reveal',
  playgroundPath: '/demo/clippath-reveal',
  description: 'Circle, diamond, star, and wipe clipPath reveal animations',
  category: 'svg',
  componentId: 'clippath-reveal',
  tags: ['svg', 'clippath', 'reveal'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime',
},
{
  title: 'Animated Slider',
  playgroundPath: '/demo/animated-slider',
  description: 'Slide, fade, scale, flip transitions with visual slide showcase',
  category: 'ui',
  componentId: 'animated-slider',
  tags: ['ui', 'slider', 'transitions'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime',
},
{
  title: 'Reorder List',
  playgroundPath: '/demo/reorder-list',
  hasPlayground: true,
  description: 'FLIP-based shuffle, move, add/remove, and grid reorder animations',
  category: 'ui',
  componentId: 'reorder-list',
  tags: ['ui', 'flip', 'reorder', 'layout'],
  difficulty: 'advanced',
  docsAnchor: 'anime-layout',
},
{
  title: 'Scroll-Linked Animations',
  playgroundPath: '/demo/scroll-linked-animations',
  hasPlayground: true,
  description: 'Parallax depth, reveal columns, conveyor, morph tile, and wave bar',
  category: 'scroll',
  componentId: 'scroll-linked-animations',
  tags: ['scroll', 'parallax', 'reveal'],
  difficulty: 'advanced',
  docsAnchor: 'use-anime-onscroll',
},
{
  title: 'Scramble Text',
  playgroundPath: '/demo/scramble-text',
  description: 'Text scramble animation with autoplay, loop, and custom chars',
  category: 'ui',
  componentId: 'scramble-text',
  tags: ['ui', 'text', 'scramble'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime-scramble',
},
```

Keep the closing `] as const satisfies readonly DemoSection[];` exactly as-is (line 161). The `satisfies` clause will now type-check the new fields.

- [ ] **Step 2: Verify typecheck and catalog test pass**

Run: `pnpm typecheck`
Expected: no errors.

Run: `pnpm test`
Expected: the existing `catalog.test.ts` still passes (it only checks that the 4 registries cover every demoId — unchanged).

- [ ] **Step 3: Commit**

```bash
git add src/component-gallery/data/sections.ts
git commit -m "feat(gallery): backfill tags, difficulty, and docsAnchor on demos"
```

---

## Task 4: Add validateSearch on the /demos parent layout route

The highest-leverage change: declare the URL search schema on the parent `/demos` route so filters survive index↔detail navigation.

**Files:**
- Modify: `src/routes/demos.tsx`

**Interfaces:**
- Produces: `/demos` route's search schema with typed `q`, `cat`, `sort`, `tag` params; child routes inherit via `useSearch({ from: '/demos', strict: false })`.

**Critical:** `validateSearch` in v1.157.15 is a plain function `(input: Record<string, unknown>) => coercedObject`. Do NOT use `parseAsString*` helpers — they don't exist in this version.

- [ ] **Step 1: Add validateSearch to the demos layout route**

Replace the entire contents of `src/routes/demos.tsx` with:

```ts
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CATEGORIES } from '@/component-gallery';

/** Search params shared across /demos index and detail routes. */
export interface DemoSearch {
  q: string;
  cat: string;
  sort: string;
  tag?: string;
}

const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.id));
const VALID_SORTS = new Set(['alpha', 'category', 'recent']);

/**
 * Coerces and validates search params, falling back to defaults for any
 * missing or unknown value. Living on the parent /demos route means these
 * params survive navigation between the index and detail pages.
 */
function validateDemoSearch(input: Record<string, unknown>): DemoSearch {
  const rawCat = typeof input.cat === 'string' ? input.cat : '';
  const rawSort = typeof input.sort === 'string' ? input.sort : '';
  const rawTag = typeof input.tag === 'string' && input.tag.length > 0 ? input.tag : undefined;
  return {
    q: typeof input.q === 'string' ? input.q : '',
    cat: VALID_CATEGORIES.has(rawCat) ? rawCat : 'all',
    sort: VALID_SORTS.has(rawSort) ? rawSort : 'alpha',
    tag: rawTag,
  };
}

/** Route seam that keeps the gallery index and component details independently renderable. */
export const Route = createFileRoute('/demos')({
  validateSearch: validateDemoSearch,
  component: DemosLayout,
});

function DemosLayout() {
  return <Outlet />;
}
```

- [ ] **Step 2: Verify the app loads**

Run: `pnpm typecheck`
Expected: no errors.

Run: `pnpm dev` then open `http://localhost:3002/demos`. The gallery should load normally (no filters active yet since the hook still uses local state). Visit `/demos?cat=svg` — the URL should be accepted without error (the hook won't react yet; that's Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/routes/demos.tsx
git commit -m "feat(gallery): add validateSearch to /demos parent route"
```

---

## Task 5: Rewrite useDemoFilter to be URL-backed

The core UX fix: replace local `useState` with reads/writes against the URL. The hook exposes a single `setTagFilter(string | undefined)` so `FilterBar`'s toggle logic maps cleanly.

**Files:**
- Modify: `src/component-gallery/hooks.ts`

**Interfaces:**
- Consumes: `useSearch({ from: '/demos', strict: false })`, `useNavigate({ from: '/demos' })`, `demoSections`, `FilterCategory`, `SortKey`
- Produces: `useDemoFilter()` returns `{ category, setCategory, search, setSearch, sort, setSort, tag, setTagFilter, allTags, filtered }` where `setTagFilter(tag: string | undefined) => void` handles both set and clear.

- [ ] **Step 1: Replace the hook implementation**

Replace the entire contents of `src/component-gallery/hooks.ts` with:

```ts
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { demoSections } from './data';
import type { FilterCategory } from './data';
import type { SortKey } from './types';

/** Filters and sorts the catalog with state backed by the /demos URL search params. */
export function useDemoFilter() {
  const search = useSearch({ from: '/demos', strict: false });
  const navigate = useNavigate({ from: '/demos' });

  const { q, cat, sort, tag } = search as {
    q: string;
    cat: FilterCategory;
    sort: SortKey;
    tag?: string;
  };

  /** Partial update to the URL search; replace=true for `q` to avoid history spam per keystroke. */
  const update = useCallback(
    (patch: Partial<{ q: string; cat: FilterCategory; sort: SortKey; tag: string | undefined }>) => {
      navigate({
        to: '.',
        search: (prev) => ({ ...prev, ...patch }),
        replace: patch.q !== undefined,
      });
    },
    [navigate],
  );

  const setCategory = useCallback((category: FilterCategory) => update({ cat: category }), [update]);
  const setSearch = useCallback((q: string) => update({ q }), [update]);
  const setSort = useCallback((sort: SortKey) => update({ sort }), [update]);
  /** Set a tag (string) or clear it (undefined). FilterBar toggles by passing undefined. */
  const setTagFilter = useCallback(
    (nextTag: string | undefined) => update({ tag: nextTag }),
    [update],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const demo of demoSections) {
      for (const t of demo.tags ?? []) set.add(t);
    }
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    const list = demoSections.filter((demo) => {
      if (cat !== 'all' && demo.category !== cat) return false;
      if (tag && !(demo.tags ?? []).includes(tag)) return false;
      if (query) {
        const haystack = [
          demo.title,
          demo.description,
          demo.componentId,
          ...(demo.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'category') {
      list.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
      );
    }
    // 'recent' = reverse insertion order (demoSections is authored newest-last).
    return sort === 'recent' ? list.reverse() : list;
  }, [q, cat, sort, tag]);

  return {
    category: cat,
    setCategory,
    search: q,
    setSearch,
    sort,
    setSort,
    tag,
    setTagFilter,
    allTags,
    filtered,
  };
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors. The `as { ... }` cast on `search` is needed because `strict: false` returns a loosened type; the parent's `validateSearch` guarantees the runtime shape.

- [ ] **Step 3: Smoke test URL-sync manually**

Run: `pnpm dev` then:
1. Open `http://localhost:3002/demos`. The gallery loads (all 18 demos).
2. Click the "SVG" category chip — the URL becomes `/demos?cat=svg` and only SVG demos show.
3. Type "timer" in the search box — URL becomes `/demos?cat=svg&q=timer` (note: typing `q` uses `replace`, so Back won't cycle per keystroke — that's intended). Clear search; the `q=` param drops.
4. Click a card → detail page. The URL params are preserved on the `/demos/$componentId` route.
5. Click "Components" back link → the SVG filter is still active. **This is the core UX fix.**
6. Reload the page — filter persists from the URL.

- [ ] **Step 4: Commit**

```bash
git add src/component-gallery/hooks.ts
git commit -m "feat(gallery): back useDemoFilter with URL search params"
```

---

## Task 6: Add sort selector and tag chips to FilterBar

`FilterBar` stays a pure controlled component — only its UI and prop list grow.

**Files:**
- Modify: `src/component-gallery/components/filter-bar.tsx`

**Interfaces:**
- Consumes (new props): `sort: SortKey`, `onSortChange: (s: SortKey) => void`, `allTags: string[]`, `tag?: string`, `onTagChange: (t: string | undefined) => void`
- Produces: FilterBar renders sort control + horizontally-scrollable tag chip row

- [ ] **Step 1: Extend FilterBar props and render sort + tag row**

Replace the entire contents of `src/component-gallery/components/filter-bar.tsx` with:

```tsx
import { memo, useCallback } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../data';
import type { FilterCategory } from '../data';
import type { SortKey } from '../types';

interface FilterBarProps {
  category: FilterCategory;
  search: string;
  resultCount: number;
  onCategoryChange: (category: FilterCategory) => void;
  onSearchChange: (search: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  allTags: string[];
  tag?: string;
  onTagChange: (tag: string | undefined) => void;
}

export const FilterBar = memo(function FilterBar({
  category,
  search,
  resultCount,
  onCategoryChange,
  onSearchChange,
  sort,
  onSortChange,
  allTags,
  tag,
  onTagChange,
}: FilterBarProps) {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value as SortKey);
    },
    [onSortChange],
  );

  const handleTag = useCallback(
    (t: string) => {
      onTagChange(tag === t ? undefined : t);
    },
    [tag, onTagChange],
  );

  return (
    <div className="py-6 pb-10 border-b border-landing-border mb-12">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search components…"
          autoComplete="off"
          className="flex-1 min-w-50 px-4 py-2.5 rounded-full border border-landing-border bg-landing-surface text-landing-fg text-sm font-sans outline-none transition-all duration-200 focus:border-landing-accent focus:shadow-[0_0_0_3px] focus:shadow-landing-accent/15 placeholder:text-landing-muted"
          aria-label="Search components"
        />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full border text-[13px] landing-font-mono cursor-pointer transition-all duration-200 whitespace-nowrap capitalize ${
              category === cat.id
                ? 'bg-landing-accent text-landing-bg border-landing-accent'
                : 'bg-transparent text-landing-muted border-landing-border hover:border-landing-accent hover:text-landing-accent'
            }`}
            aria-pressed={category === cat.id}
          >
            {cat.label}
          </button>
        ))}
        <label className="flex items-center gap-2 ml-auto">
          <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-muted">Sort</span>
          <select
            value={sort}
            onChange={handleSort}
            className="px-3 py-1.5 rounded-full border border-landing-border bg-landing-surface text-landing-fg text-[13px] landing-font-mono cursor-pointer outline-none transition-all duration-200 focus:border-landing-accent"
            aria-label="Sort components"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <span className="landing-font-mono text-xs text-landing-muted">
          {resultCount} demo{resultCount !== 1 ? 's' : ''}
        </span>
      </div>

      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-4 overflow-x-auto pb-1">
          {allTags.map((t) => {
            const active = tag === t;
            return (
              <button
                key={t}
                onClick={() => handleTag(t)}
                className={`px-2.5 py-1 rounded-full border text-[11px] landing-font-mono cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-landing-accent/15 text-landing-accent border-landing-accent'
                    : 'bg-transparent text-landing-muted/80 border-landing-border hover:border-landing-accent/50 hover:text-landing-muted'
                }`}
                aria-pressed={active}
              >
                #{t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
```

- [ ] **Step 2: Verify typecheck fails as expected (page hasn't passed new props yet)**

Run: `pnpm typecheck`
Expected: errors in `component-gallery-page.tsx` — `FilterBar` now requires `sort`/`onSortChange`/`allTags`/`tag`/`onTagChange`. This is fixed in Task 7.

- [ ] **Step 3: Commit (intermediate; Task 7 completes the wiring)**

```bash
git add src/component-gallery/components/filter-bar.tsx
git commit -m "feat(gallery): add sort selector and tag chips to FilterBar"
```

---

## Task 7: Wire FilterBar + empty state into the gallery page

Pass the new hook outputs to `FilterBar` and add a refined empty state. The hook's `setTagFilter` maps directly onto `FilterBar`'s `onTagChange` (both accept `string | undefined`).

**Files:**
- Modify: `src/component-gallery/components/component-gallery-page.tsx`

**Interfaces:**
- Consumes: `useDemoFilter()` returns `{ ..., sort, setSort, allTags, tag, setTagFilter, filtered }`

- [ ] **Step 1: Replace the page to pass new props and render empty state**

Replace the entire contents of `src/component-gallery/components/component-gallery-page.tsx` with:

```tsx
import { memo } from 'react';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { useDemoFilter } from '../hooks';
import { ComponentGalleryShell } from './component-gallery-shell';
import { FilterBar } from './filter-bar';
import { GalleryCard } from './gallery-card';

export const ComponentGalleryPage = memo(function ComponentGalleryPage() {
  const {
    category,
    setCategory,
    search,
    setSearch,
    sort,
    setSort,
    allTags,
    tag,
    setTagFilter,
    filtered,
  } = useDemoFilter();

  const resetFilters = () => {
    setCategory('all');
    setSearch('');
    setTagFilter(undefined);
  };

  return (
    <ComponentGalleryShell>
      <ErrorBoundary>
        <section className="pt-28 pb-12 text-center px-6">
          <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
            Explore
          </p>
          <h1 className="landing-font-display text-5xl sm:text-6xl mb-4">Component gallery</h1>
          <p className="text-landing-muted max-w-xl mx-auto text-lg leading-relaxed mt-4">
            Discover the API, try a live preview, and open a Playground only when the interaction needs more room.
          </p>
          <p className="landing-font-mono text-[11px] text-landing-muted/70 mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded border border-landing-border bg-landing-surface text-[10px]">⌘K</kbd> to jump to any component
          </p>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="max-w-300 mx-auto px-6">
          <FilterBar
            category={category}
            search={search}
            resultCount={filtered.length}
            onCategoryChange={setCategory}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            allTags={allTags}
            tag={tag}
            onTagChange={setTagFilter}
          />

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="landing-font-mono text-sm text-landing-accent mb-3">No matches</p>
              <h2 className="landing-font-display text-2xl mb-2">No components match your filters</h2>
              <p className="text-landing-muted max-w-sm mb-6">
                Try clearing the search, switching category, or removing the active tag.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-full border border-landing-border bg-landing-surface text-landing-fg text-sm landing-font-mono hover:border-landing-accent hover:text-landing-accent transition-all"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filtered.map((demo, i) => (
                <GalleryCard key={demo.componentId} demo={demo} demoIndex={i} />
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="py-16 text-center border-t border-landing-border px-6">
          <h2 className="landing-font-display text-3xl mb-4">Ready to build?</h2>
          <p className="text-landing-muted max-w-md mx-auto mb-8">
            Every component runs on React AnimeJS — install once, animate everywhere.
          </p>
          <code className="inline-block landing-font-mono text-sm text-landing-accent bg-landing-surface border border-landing-border rounded-full px-5 py-2.5">
            npm install react-animejs
          </code>
        </section>
      </ErrorBoundary>

      <footer className="border-t border-landing-border py-10 text-center">
        <span className="landing-font-display text-sm text-landing-muted">React AnimeJS ✦</span>
      </footer>
    </ComponentGalleryShell>
  );
});
```

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors (all props wired — `setTagFilter` accepts `string | undefined` matching `FilterBar`'s `onTagChange`).

- [ ] **Step 3: Smoke test sort + tags + empty state**

Run: `pnpm dev` then open `/demos`:
1. Change Sort to "A→Z", "Category", "Recent" — order changes; URL `?sort=...` updates.
2. Click a tag chip (e.g. `#svg`) — results filter to svg-tagged demos; `?tag=svg` in URL.
3. Click the active tag again — filter clears (FilterBar calls `onTagChange(undefined)` when toggling the active tag).
4. Type a non-matching search query — empty state renders with "Reset filters" button.
5. Click "Reset filters" — all filters clear.

- [ ] **Step 4: Commit**

```bash
git add src/component-gallery/components/component-gallery-page.tsx
git commit -m "feat(gallery): wire sort/tag filters and empty state into gallery page"
```

---

## Task 8: Add tag and difficulty metadata to GalleryCard

Cards now surface tags and a difficulty dot. All additions conditional.

**Files:**
- Modify: `src/component-gallery/components/gallery-card.tsx`

**Interfaces:**
- Consumes: `DIFFICULTY_META` from `../data/constants`, `demo.tags`, `demo.difficulty` (both optional)

- [ ] **Step 1: Add metadata to the card footer**

In `src/component-gallery/components/gallery-card.tsx`, update the imports at the top:

```tsx
import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { GalleryPreview } from './gallery-preview';
import { DIFFICULTY_META } from '../data/constants';
import type { DemoSection } from '../types';
import type { DemoId } from '../data';
```

Then replace the card body's footer section. Find this block:

```tsx
        <p className="text-[13px] text-landing-muted leading-relaxed flex-1">{demo.description}</p>
        <div className="landing-font-mono text-[11px] text-landing-muted/60 mt-3 pt-3 border-t border-landing-border flex items-center gap-1.5">
          <span className="text-landing-accent">&rarr;</span>
          Open details
        </div>
```

Replace with:

```tsx
        <p className="text-[13px] text-landing-muted leading-relaxed flex-1">{demo.description}</p>

        {demo.tags && demo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {demo.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="landing-font-mono text-[10px] text-landing-muted/70 px-1.5 py-0.5 rounded border border-landing-border/60"
              >
                #{t}
              </span>
            ))}
            {demo.tags.length > 3 && (
              <span className="landing-font-mono text-[10px] text-landing-muted/50">
                +{demo.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="landing-font-mono text-[11px] text-landing-muted/60 mt-3 pt-3 border-t border-landing-border flex items-center justify-between gap-1.5">
          <span className="flex items-center gap-1.5">
            <span className="text-landing-accent">&rarr;</span>
            Open details
          </span>
          {demo.difficulty && (
            <span className="flex items-center gap-1.5 capitalize">
              <span className={`w-1.5 h-1.5 rounded-full ${DIFFICULTY_META[demo.difficulty].dotClassName}`} />
              {demo.difficulty}
            </span>
          )}
        </div>
```

Leave the `<Link>`, `useScrollReveal`, and `GalleryPreview` structure unchanged.

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Smoke test the cards**

Run: `pnpm dev` then open `/demos`. Each card should now show up to 3 tag chips and a difficulty dot + label in the footer. Verify "Basic Animation" shows `#stagger #easing #selectors` and a green "beginner" dot; "Reorder List" shows an orange/rose "advanced" dot.

- [ ] **Step 4: Commit**

```bash
git add src/component-gallery/components/gallery-card.tsx
git commit -m "feat(gallery): show tags and difficulty on gallery cards"
```

---

## Task 9: Build the command palette

The ⌘K palette. It mirrors `CodeModal`'s `AnimePresence` shell and consumes `useModalA11y` (Task 1).

**Files:**
- Create: `src/component-gallery/components/command-palette.tsx`

**Interfaces:**
- Consumes: `useModalA11y` from `@/landing/hooks/use-modal-a11y`; `demoSections`; `useNavigate` from TanStack Router
- Produces: `<CommandPalette open={boolean} onClose={() => void} />`

- [ ] **Step 1: Create the command palette component**

Create `src/component-gallery/components/command-palette.tsx`:

```tsx
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
import { DIFFICULTY_META } from '../data/constants';
import { demoSections } from '../data';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette = memo(function CommandPalette({ open, onClose }: CommandPaletteProps) {
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
                  aria-activedescendant={results[safeIndex] ? `palette-item-${safeIndex}` : undefined}
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
                    No components match "{query}"
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
                        i === safeIndex ? 'bg-landing-accent/10' : 'hover:bg-landing-accent/5'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-landing-fg truncate">{demo.title}</span>
                          {demo.difficulty && (
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DIFFICULTY_META[demo.difficulty].dotClassName}`} />
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
```

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit (wired in Task 10)**

```bash
git add src/component-gallery/components/command-palette.tsx
git commit -m "feat(gallery): add CommandPalette component"
```

---

## Task 10: Wire ⌘K and palette state into the gallery shell

Own the palette's open state in the shell (so ⌘K works on both index and detail pages) and register the global keydown listener.

**Files:**
- Modify: `src/component-gallery/components/component-gallery-shell.tsx`

**Interfaces:**
- Consumes: `CommandPalette` from `./command-palette`

- [ ] **Step 1: Add palette state + ⌘K listener to the shell**

In `src/component-gallery/components/component-gallery-shell.tsx`:

1. Update imports — add `useState` to the React import, add the palette import:

```tsx
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimeProvider } from '@/lib/react-animejs';
import { CommandPalette } from './command-palette';
```

2. Inside `ComponentGalleryShell`, after the theme state declarations, add palette state and the ⌘K listener:

```tsx
  const [isDark, setIsDark] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
```

3. Render the palette as a sibling of `{children}`, right before the closing `</div>` of the outer wrapper:

```tsx
        {children}
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </AnimeProvider>
  );
}
```

4. (Optional discoverability) Add a ⌘K hint button in the header nav, after the Blocks link and before the theme toggle:

```tsx
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-landing-border bg-landing-surface text-xs text-landing-muted hover:border-landing-accent hover:text-landing-accent transition-all"
              aria-label="Open command palette"
            >
              <span className="landing-font-mono">Search</span>
              <kbd className="landing-font-mono text-[10px] px-1 py-0.5 rounded border border-landing-border">⌘K</kbd>
            </button>
```

Leave the theme toggle logic and existing nav unchanged.

- [ ] **Step 2: Smoke test ⌘K**

Run: `pnpm dev` then:
1. On `/demos`, press ⌘K (or Ctrl+K) — palette opens, input auto-focused.
2. Type "time" — results filter to Timeline/Timer. Use arrow keys to move selection; Enter navigates to the detail page and closes the palette.
3. On a detail page (`/demos/timeline`), press ⌘K — palette opens again (works on both routes because it's mounted in the shared shell).
4. Press Escape — palette closes; focus returns to the trigger.
5. Click the "Search ⌘K" hint button in the header — palette opens.

- [ ] **Step 3: Commit**

```bash
git add src/component-gallery/components/component-gallery-shell.tsx
git commit -m "feat(gallery): wire ⌘K command palette into gallery shell"
```

---

## Task 11: Add docs-links map and verify it against docs anchors

The explicit `demoDocsLinks` map plus a contract test asserting each anchor is a real docs reference ID.

**Files:**
- Create: `src/component-gallery/data/docs-links.ts`
- Modify: `src/component-gallery/__tests__/catalog.test.ts`

**Interfaces:**
- Produces: `demoDocsLinks: Record<DemoId, { anchor: string; label: string; extras?: string[] }>`

- [ ] **Step 1: Create the docs-links map**

Create `src/component-gallery/data/docs-links.ts`:

```ts
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
  'svg-morph': { anchor: 'anime-morph', label: 'AnimeMorph', extras: ['use-svg-animation'] },
  'svg-draw': { anchor: 'anime-draw', label: 'AnimeDraw', extras: ['use-svg-animation'] },
  'svg-motion-path': { anchor: 'anime-motion-path', label: 'AnimeMotionPath', extras: ['use-svg-animation'] },
  'timer': { anchor: 'use-anime-timer', label: 'useAnimeTimer' },
  'timeline': { anchor: 'anime-timeline', label: 'AnimeTimeline', extras: ['use-anime-timeline'] },
  'draggable': { anchor: 'use-anime-draggable', label: 'useAnimeDraggable' },
  'on-scroll': { anchor: 'use-anime-onscroll', label: 'useAnimeOnScroll', extras: ['anime-scroll'] },
  'layout': { anchor: 'anime-layout', label: 'AnimeLayout', extras: ['anime-layout-item', 'use-anime-layout'] },
  'scope': { anchor: 'use-anime-scope', label: 'useAnimeScope', extras: ['anime-scope', 'anime-provider'] },
  'split-text': { anchor: 'split-text', label: 'SplitText', extras: ['use-split-text', 'split-text-entry'] },
  'toggle-switch': { anchor: 'use-anime', label: 'useAnime' },
  'counter-countdown': { anchor: 'use-anime-timer', label: 'useAnimeTimer' },
  'spinning-cube': { anchor: 'use-anime', label: 'useAnime' },
  'clippath-reveal': { anchor: 'use-anime', label: 'useAnime' },
  'animated-slider': { anchor: 'use-anime', label: 'useAnime' },
  'reorder-list': { anchor: 'anime-layout', label: 'AnimeLayout', extras: ['anime-presence', 'anime-presence-child', 'use-anime-layout'] },
  'scroll-linked-animations': { anchor: 'use-anime-onscroll', label: 'useAnimeOnScroll', extras: ['anime-scroll'] },
  'scramble-text': { anchor: 'use-anime-scramble', label: 'useAnimeScramble' },
};
```

- [ ] **Step 2: Extend the catalog test with field + cross-link contract checks**

In `src/component-gallery/__tests__/catalog.test.ts`, replace the file contents with:

```ts
import { describe, expect, it } from 'vitest';
import { demoDetails, demoSections } from '../data';
import { galleryPreviewRegistry } from '../components/gallery-preview';
import { previewRegistry } from '../components/detail-previews/registry';
import { demoDocsLinks } from '../data/docs-links';
import { componentReferences, hookReferences } from '@/docs/reference-data';

const validDocsAnchors = new Set(
  [...hookReferences, ...componentReferences].map((entry) => entry.id),
);

describe('component gallery catalog', () => {
  it('connects every catalog item to its details and both preview surfaces', () => {
    for (const demo of demoSections) {
      expect(demoDetails[demo.componentId]).toBeDefined();
      expect(galleryPreviewRegistry[demo.componentId]).toBeDefined();
      expect(previewRegistry[demo.componentId]).toBeDefined();
    }
  });

  it('every demo has a docs-links entry whose anchor exists in the docs reference', () => {
    for (const demo of demoSections) {
      const link = demoDocsLinks[demo.componentId];
      expect(link, `docs link for ${demo.componentId}`).toBeDefined();
      expect(validDocsAnchors.has(link.anchor), `anchor "${link.anchor}" for ${demo.componentId}`).toBe(true);
      for (const extra of link.extras ?? []) {
        expect(validDocsAnchors.has(extra), `extra anchor "${extra}" for ${demo.componentId}`).toBe(true);
      }
    }
  });

  it('every docsAnchor on a section matches the docs-links map anchor', () => {
    for (const demo of demoSections) {
      if (demo.docsAnchor) {
        expect(demo.docsAnchor).toBe(demoDocsLinks[demo.componentId].anchor);
      }
    }
  });

  it('optional fields are well-formed when present', () => {
    for (const demo of demoSections) {
      if (demo.difficulty) {
        expect(['beginner', 'intermediate', 'advanced']).toContain(demo.difficulty);
      }
      if (demo.tags) {
        expect(demo.tags.length).toBeGreaterThan(0);
        expect(new Set(demo.tags).size).toBe(demo.tags.length); // no duplicates
      }
    }
  });
});
```

- [ ] **Step 3: Run tests and verify all pass**

Run: `pnpm test`
Expected: all 4 tests pass. The cross-link test will fail if any anchor was typo'd — fix in `docs-links.ts` or `sections.ts` until it passes.

- [ ] **Step 4: Commit**

```bash
git add src/component-gallery/data/docs-links.ts src/component-gallery/__tests__/catalog.test.ts
git commit -m "test(gallery): add docs-links map and cross-link contract tests"
```

---

## Task 12: Enrich the detail page (related components, docs link, difficulty)

The final task: difficulty badge, related-components section, docs cross-link, and the small `bg-violet-500` → `bg-landing-accent` fix.

**Files:**
- Modify: `src/component-gallery/components/component-detail-page.tsx`

**Interfaces:**
- Consumes: `demoDocsLinks`, `DIFFICULTY_META`, `demoSections` (for related computation), `GalleryPreview` (for thumbnails)

- [ ] **Step 1: Add the docs link + difficulty badge near the category pill**

In `src/component-gallery/components/component-detail-page.tsx`, update the imports:

```tsx
import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink } from 'lucide-react';
import { demoDetails, demoSections, DIFFICULTY_META, demoDocsLinks } from '../data';
import { getDemoPreview } from './detail-previews';
import { GalleryPreview } from './gallery-preview';
import { CodeBlock } from './code-block';
import { ComponentGalleryShell } from './component-gallery-shell';
import type { DemoId } from '../data';
import type { DemoSection } from '../types';
```

Note: you'll need to ensure `demoDocsLinks` and `DIFFICULTY_META` are re-exported from `src/component-gallery/data/index.ts`. Read that file; if they aren't exported, add:
```ts
export { demoDocsLinks } from './docs-links';
export { DIFFICULTY_META } from './constants';
```

Then find the chip row (around lines 94-106) that shows the category and Playground link:

```tsx
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-accent bg-landing-accent/10 px-3 py-1 rounded-full border border-landing-accent/20">
                  {demo.category}
                </span>
                {demo.hasPlayground && demo.playgroundPath ? (
                  <Link ...>Open Playground <ExternalLink size={13} /></Link>
                ) : null}
              </div>
```

Add difficulty badge and docs link into this row. Replace the `Open Playground` ternary's closing with additional chips:

```tsx
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-accent bg-landing-accent/10 px-3 py-1 rounded-full border border-landing-accent/20">
                  {demo.category}
                </span>
                {demo.difficulty && (
                  <span className={`landing-font-mono text-[11px] tracking-widest uppercase px-3 py-1 rounded-full border ${DIFFICULTY_META[demo.difficulty].badgeClassName}`}>
                    {DIFFICULTY_META[demo.difficulty].label}
                  </span>
                )}
                {(() => {
                  const link = demoDocsLinks[demo.componentId];
                  return link ? (
                    <Link
                      to="/docs"
                      hash={link.anchor}
                      className="landing-font-mono text-[11px] tracking-wider uppercase text-landing-muted hover:text-landing-accent bg-landing-surface px-3 py-1 rounded-full border border-landing-border hover:border-landing-accent/30 transition-all no-underline flex items-center gap-1.5"
                    >
                      <BookOpen size={13} />
                      Read the docs
                    </Link>
                  ) : null;
                })()}
                {demo.hasPlayground && demo.playgroundPath ? (
                  <Link
                    to={demo.playgroundPath as never}
                    className="landing-font-mono text-[11px] tracking-wider uppercase text-landing-muted hover:text-landing-accent bg-landing-surface px-3 py-1 rounded-full border border-landing-border hover:border-landing-accent/30 transition-all no-underline flex items-center gap-1.5"
                  >
                    Open Playground
                    <ExternalLink size={13} />
                  </Link>
                ) : null}
              </div>
```

- [ ] **Step 2: Fix the off-palette violet blob**

Find line ~50:
```tsx
        <div className="pointer-events-none absolute top-[32rem] right-[8%] h-80 w-80 rounded-full bg-violet-500/8 blur-[110px]" />
```
Replace `bg-violet-500/8` with `bg-landing-accent/8`:
```tsx
        <div className="pointer-events-none absolute top-[32rem] right-[8%] h-80 w-80 rounded-full bg-landing-accent/8 blur-[110px]" />
```

- [ ] **Step 3: Add the Related components section**

Compute related demos (same category, then shared tags) and render them after the Props table, before the prev/next footer. Inside `ComponentDetailPage`, after the `handleCopy` callback, add:

```tsx
  const relatedDemos = useMemo(() => {
    return demoSections
      .filter((d) => d.componentId !== demo.componentId)
      .map((d) => {
        const sameCategory = d.category === demo.category ? 2 : 0;
        const sharedTags = (demo.tags ?? []).filter((t) => (d.tags ?? []).includes(t)).length;
        return { demo: d, score: sameCategory + sharedTags };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.demo);
  }, [demo]);
```

Then in the JSX, find the prev/next footer (around line 187):
```tsx
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-landing-border">
```

Insert the related section **before** that footer:

```tsx
          {relatedDemos.length > 0 && (
            <section className="mt-12 pt-8 border-t border-landing-border">
              <h2 className="landing-font-display text-xl mb-5">Related components</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedDemos.map((d) => (
                  <Link
                    key={d.componentId}
                    to="/demos/$componentId"
                    params={{ componentId: d.componentId }}
                    className="bg-landing-surface border border-landing-border rounded-xl overflow-hidden no-underline group hover:-translate-y-0.5 hover:border-landing-accent/30 transition-all"
                  >
                    <GalleryPreview demoId={d.componentId} className="h-24" />
                    <div className="p-3">
                      <h3 className="landing-font-display text-sm group-hover:text-landing-accent transition-colors">{d.title}</h3>
                      <p className="text-[12px] text-landing-muted leading-relaxed mt-1 line-clamp-2">{d.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

```

- [ ] **Step 4: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Smoke test the detail page**

Run: `pnpm dev` then open `/demos/svg-morph`:
1. Category, difficulty badge (Intermediate), "Read the docs", and "Open Playground" chips all show in the header row.
2. Click "Read the docs" → navigates to `/docs#anime-morph` and that section scrolls into view.
3. Below the props table, a "Related components" section shows 3 cards (other SVG-category demos) with mini previews; clicking one navigates to its detail page.
4. The decorative blobs are both the on-palette accent color (no violet).

- [ ] **Step 6: Commit**

```bash
git add src/component-gallery/components/component-detail-page.tsx src/component-gallery/data/index.ts
git commit -m "feat(gallery): add related components, docs link, and difficulty to detail page"
```

---

## Task 13: Update gallery barrel exports and run full verification

Final wiring: export the new symbols from the gallery barrel, then run the complete check suite.

**Files:**
- Modify: `src/component-gallery/index.ts`

- [ ] **Step 1: Export new symbols from the gallery barrel**

Read `src/component-gallery/index.ts`, then ensure these are exported (add what's missing, keep existing exports intact):

```ts
export { CommandPalette } from './components/command-palette';
export { SORT_OPTIONS, DIFFICULTY_META } from './data/constants';
export { demoDocsLinks } from './data/docs-links';
export type { SortKey, Difficulty } from './types';
```

Match the existing export style in the file (named exports vs `export *`).

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`
Expected: no errors. Fix any issues (common ones: unused imports, perfectionist sort order — run `pnpm lint:fix` to auto-fix).

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all tests pass, including the 4 catalog tests from Task 11.

- [ ] **Step 5: Run build**

Run: `pnpm build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Final manual smoke test**

Run: `pnpm dev` and verify the full flow:
1. `/demos` — gallery loads; sort/tag/search/category all work; URL reflects state.
2. Filters persist across navigation to a detail page and back.
3. ⌘K palette opens, searches, navigates, and closes correctly on both index and detail.
4. Cards show tags + difficulty; detail page shows related + docs link + difficulty.
5. Empty state renders when no demos match; reset works.
6. Reload the page — filters persist from URL.

- [ ] **Step 7: Commit**

```bash
git add src/component-gallery/index.ts
git commit -m "feat(gallery): export new gallery symbols from barrel"
```

---

## Verification Checklist (post-implementation)

After all tasks complete, confirm:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (run `pnpm lint:fix` if needed)
- [ ] `pnpm test` passes (4 catalog tests)
- [ ] `pnpm build` succeeds
- [ ] URL-synced filters work (category, search, sort, tag)
- [ ] Filters persist across index↔detail navigation
- [ ] ⌘K palette works on both index and detail pages
- [ ] Empty state renders and resets
- [ ] Cards show tags + difficulty
- [ ] Detail page shows related components, docs link, difficulty badge
- [ ] CodeModal still behaves correctly after `useModalA11y` extraction
- [ ] No off-palette colors (no `bg-violet-500`)
