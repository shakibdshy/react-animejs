# Demos Gallery UX & Redesign — Design Spec

**Date:** 2026-07-26
**Target:** `/demos` component gallery (index + detail pages)
**Approach:** Minimal-change / maximum-reuse (Option A)

## Problem

The `/demos` gallery is functional but has three UX gaps, confirmed as priorities:

1. **Filter state is ephemeral.** `useDemoFilter` (`src/component-gallery/hooks.ts`) owns `category`/`search` in local `useState`. Navigating to a detail page unmounts the index and **destroys** the filter state — users lose their place on return. Filters are also not shareable via URL.
2. **No sorting or tag filtering.** Only the 5 top-level categories exist; no way to sort (A→Z, by category, recency) or filter by finer-grained tags.
3. **No keyboard navigation or quick-jump.** 18 demos must be scanned visually; there's no ⌘K command palette or keyboard way to move between cards.

Secondary goals (lower priority, same PR): richer card metadata, refined filter bar, improved empty state, related-components section on detail pages, cross-links to `/docs`, and difficulty badges.

## Scope (confirmed with user)

- **In scope:** `/demos` index + `/demos/$componentId` detail pages only.
- **Out of scope:** landing page (`/`), `/docs`, `/blocks`, and the `/demo/*` playground routes. Cross-codebase `cn` dedup, `SectionHeader` hero swap, and latent token bug fixes are flagged but **deferred**.

## Architecture (Minimal Change)

The single highest-leverage decision: **lift filter state into URL search params on the parent layout route**, so it survives navigation and is shareable. Everything else extends existing structures.

### Key decisions

1. **`validateSearch` on `src/routes/demos.tsx`** (the parent layout route), NOT the index route. This is critical: search params declared on a parent persist across navigation between index and detail children, giving us "filters survive navigation" for free. Schema params: `q` (search), `cat` (category), `sort`, `tag`.

2. **Rewrite `useDemoFilter` in place** to be route-aware: read via `Route.useSearch({ strict: false })`, write via `useNavigate({ search: prev => ({...prev, ...patch}) })`. The hook's public return shape stays compatible so the call site in `component-gallery-page.tsx` needs minimal changes (just consumes a few new fields like `sort`, `tag`, `allTags`).

3. **Extract `useModalA11y` hook** from `CodeModal.tsx`'s battle-tested effect (focus trap, Escape, scroll lock, focus restore). Both `CodeModal` and the new command palette consume it. This is the **only** change outside the gallery folder — a mechanical refactor.

4. **Optional fields on `DemoSection`**: `tags?: readonly string[]`, `difficulty?: 'beginner' | 'intermediate' | 'advanced'`, `docsAnchor?: string`. All optional → no forced migration; backfill per demo.

5. **Explicit `demoDocsLinks` map** (`src/component-gallery/data/docs-links.ts`): `Record<DemoId, { anchor: string; label: string; extras?: string[] }>`. NOT slugified from the free-form `DemoDetail.component` string. The catalog test asserts each `anchor` matches the format and (where feasible) a real `ReferenceEntry.id`.

6. **Command palette state lives in `ComponentGalleryShell`** (local `useState`), so ⌘K works on both index and detail pages. The global keydown listener (`Cmd/Ctrl+K`) is a small `useEffect` in the shell.

### Non-goals / trade-offs accepted

- **`useDemoFilter` becomes router-coupled.** The current "without coupling to a route" comment gets rewritten. Worth it: zero call-site changes, single consumer. If a non-route consumer ever appears, split into pure `filterDemos(inputs)` + route wrapper — YAGNI today.
- **Single-active tag filter (radio-style)**, not multi-select. Click again to clear. Multi-select doubles state complexity for little UX gain.
- **"Recent" sort = reverse insertion order** of `demoSections`, not real timestamps. Cheaper than adding `addedAt` to every demo.
- **`useModalA11y` extraction touches `CodeModal`** — the only change outside the gallery. Low-risk (mechanical); the alternative is ~30 lines duplicated in the palette.
- **No shared `<Dialog>` primitive** — palette copies `CodeModal`'s `AnimePresence` shell markup. Acceptable duplication for two consumers.

## File-by-file changes

### New files (3)

**`src/landing/hooks/use-modal-a11y.ts`** — extracted from `CodeModal.tsx:39-79`.
- Signature: `useModalA11y({ open, onClose, panelRef, initialFocusRef? })`.
- Encapsulates: body-scroll lock, focus restore on close, Tab cycling within `panelRef`, Escape→`onClose`.
- Pure side-effect hook; no return value.

**`src/component-gallery/components/command-palette.tsx`** — the ⌘K palette.
- Props: `{ open: boolean; onClose: () => void }`.
- Mirrors `CodeModal`'s shell (`AnimePresence` + `AnimePresenceChild` backdrop+panel, same classes, close button) and consumes `useModalA11y`.
- Internal state: `query` (local `useState`), `activeIndex`.
- Source: `demoSections` filtered by `query` (title + description + tags + componentId), sorted alphabetically.
- Keyboard: `↑`/`↓` move `activeIndex`, `Enter` navigates via `useNavigate` to `/demos/$componentId` and closes. Escape handled by `useModalA11y`.
- Rows: `role="option"`, `aria-selected` on active, show title + category mono kicker + difficulty dot.

**`src/component-gallery/data/docs-links.ts`** — explicit demoId → docs anchor map.
- `demoDocsLinks: Record<DemoId, { anchor: string; label: string; extras?: string[] }>`.
- Verified against `src/docs/reference-data.ts` `ReferenceEntry.id` values (e.g., `svg-morph` → `{ anchor: 'anime-morph', label: 'AnimeMorph', extras: ['use-svg-animation'] }`).

### Modified files (12)

**`src/routes/demos.tsx`** — add `validateSearch` (imports schema from gallery).
- Params: `q: string` (default `''`), `cat: FilterCategory` (default `'all'`), `sort: SortKey` (default `'alpha'`), `tag: string` (optional).
- Use TanStack's `parseAsString`/`parseAsStringEnum`/`parseAsStringWithDefault` for coercion + validation. Unknown values reset to defaults (no throws).

**`src/component-gallery/types.ts`** — extend types.
- `DemoSection`: add optional `tags`, `difficulty`, `docsAnchor`.
- Add `SortKey = 'alpha' | 'category' | 'recent'` and `Difficulty = 'beginner' | 'intermediate' | 'advanced'`.
- Extend unused `FilterState` with `sort` and `tag` for symmetry.

**`src/component-gallery/data/sections.ts`** — backfill new optional fields per demo.
- `tags`: 2-4 relevant tags each (e.g., `basic-animation` → `['stagger', 'easing', 'selectors']`).
- `difficulty`: beginner/intermediate/advanced based on concept complexity.
- `docsAnchor`: matches the `demoDocsLinks` anchor for that demoId.
- Keep `as const satisfies readonly DemoSection[]` — type safety preserved.

**`src/component-gallery/data/constants.ts`** — add sort options and difficulty metadata.
- `SORT_OPTIONS = [{id:'alpha',label:'A→Z'},{id:'category',label:'Category'},{id:'recent',label:'Recent'}] as const`.
- `DIFFICULTY_META`: maps each level to `{label, dotClassName, badgeClassName}` using existing tokens (beginner → green-ish, intermediate → accent, advanced → red/violet).

**`src/component-gallery/hooks.ts`** — rewrite `useDemoFilter` to be URL-backed.
- Replace `useState` reads with `Route.useSearch({ strict: false })` via the parent route.
- Replace setters with `navigate({ to: '.', search: prev => ({...prev, ...patch}) })`.
- Add `setSort`, `setTag`/`clearTag`, `allTags` (derived `useMemo` from `demoSections`).
- `filtered` `useMemo` deps become `[q, cat, sort, tag]`; adds tag-membership test and sort comparator.
- History strategy: `replace: true` for `q` updates (avoid spamming back/forward on each keystroke); `replace: false` for `cat`/`sort`/`tag` (so Back does something useful).

**`src/component-gallery/components/component-gallery-page.tsx`** — consume new hook fields + empty state.
- Pass `sort`/`onSortChange`/`allTags`/`tag`/`onTagChange` to `FilterBar`.
- Render `<CommandPalette />` is NOT here — it lives in the shell.
- Add an **empty state** when `filtered.length === 0`: a centered message + a reset button calling `setCategory('all')`, `setSearch('')`, `clearTag()`.

**`src/component-gallery/components/filter-bar.tsx`** — add sort selector + tag chips.
- Still pure controlled (no API break for existing props).
- Add a sort control (segmented control or `<select>`) bound to `sort`/`onSortChange`.
- Add a horizontally-scrollable tag-chip row below the search/category row; active tag highlighted; click active tag to clear.
- Use `aria-label`/`aria-pressed` mirroring existing category buttons.

**`src/component-gallery/components/gallery-card.tsx`** — richer card metadata.
- Footer gains inline tag chips (first 2-3, "+N" overflow) and a difficulty dot/badge using `DIFFICULTY_META`.
- All additions conditional so layout is preserved when fields are absent.
- No change to `useScrollReveal`/`GalleryPreview`/`Link` structure.

**`src/component-gallery/components/component-detail-page.tsx`** — three additive sections.
- **Difficulty badge + category** next to the existing category pill (reuses `DIFFICULTY_META`).
- **Related components section**: `useMemo` scoring other demos by shared category then shared tags (intersection size), top 3, rendered as compact mini-cards reusing `GalleryPreview` for thumbnails. Excludes self; falls back to same-category when no tags.
- **"Read the docs" cross-link**: `Btn`/`Link` under the Props table, `to="/docs"` with `hash={demo.docsAnchor}` when present (TanStack Router supports `hash` on `Link`).
- Replace off-palette `bg-violet-500/8` with `bg-landing-accent/8` (small correctness fix; same visual intent).

**`src/component-gallery/components/component-gallery-shell.tsx`** — own palette state + ⌘K listener.
- `const [paletteOpen, setPaletteOpen] = useState(false)`.
- `useEffect` adds `keydown` listener for `e.key === 'k' && (e.metaKey || e.ctrlKey)` → `preventDefault()` + `setPaletteOpen(true)`. Also `Escape`-to-open is NOT added (Escape closes).
- Renders `<CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />` once as sibling of `{children}`.
- Optional `<kbd>⌘K</kbd>` hint chip in header next to theme toggle for discoverability.

**`src/blocks/components/CodeModal.tsx`** — mechanical refactor.
- Delete the inline `useEffect` at lines 39-79; replace with `useModalA11y({ open, onClose, panelRef: dialogRef, initialFocusRef: closeButtonRef })`.
- Layout, copy logic, and animations stay identical. This is the only change outside the gallery folder.

**`src/component-gallery/index.ts`** — export new symbols.
- Add `CommandPalette`, `SORT_OPTIONS`, `DIFFICULTY_META`, `SortKey`, `Difficulty`, `demoDocsLinks`.
- Keep existing exports intact.

**`src/component-gallery/__tests__/catalog.test.ts`** — extend (do not weaken existing assertion).
- For each demo: if `docsAnchor` is defined, assert it matches `/^[a-z0-9-]+$/` (format guard).
- If `difficulty` is present, assert it's one of the three allowed values.
- If `tags` is present, assert it's a non-empty string array with no duplicates.
- New test: every `demoDocsLinks[demoId].anchor` matches a real `ReferenceEntry.id` in `hookReferences`/`componentReferences` (cross-module contract guard).

## Data flow

1. **Land on `/demos`** → `validateSearch` normalizes absent params to `{q:'', cat:'all', sort:'alpha', tag:undefined}`.
2. **`ComponentGalleryPage`** → `useDemoFilter()` reads URL via parent route → `filtered` `useMemo` produces sorted/tagged/searched list.
3. **Filter interaction** (`FilterBar` emits `onCategoryChange('svg')`) → hook's `update({cat:'svg'})` → `useNavigate` writes `?cat=svg` → URL changes → hook re-reads → page re-renders. No prop-drilling.
4. **⌘K anywhere under `/demos`** → shell's listener → `paletteOpen=true` → `<CommandPalette>` mounts → `useModalA11y` locks scroll + traps focus → user types/arrows → Enter → `useNavigate` to `/demos/$componentId` → palette closes.
5. **On `/demos/$componentId`** → detail page reads `demo` (passed by route), derives related set + docs link from `demoSections` + `demoDocsLinks`.
6. **Back button** moves through filter states (each `cat`/`sort`/`tag` change is a push).

## Edge cases & error handling

- **Junk in URL** (`?cat=xxx`): `validateSearch`'s `.oneOf(...)`/enum parsers reset to default rather than throwing. Matches the existing "Unknown component" friendliness in `demos.$componentId.tsx`.
- **Palette targets are type-checked `DemoId`**: no 404s from the palette.
- **`replace: true` for search query** prevents back-button spam while typing.
- **Focus restoration**: `useModalA11y` restores focus to the ⌘K trigger (or last focused element) on close.
- **Two dialogs open at once** (palette over CodeModal): unlikely via ⌘K, but `useModalA11y`'s scroll-lock should be ref-counted if this becomes possible. Initial impl: simple set/restore (matches current `CodeModal` behavior).
- **Empty state**: when `filtered.length === 0`, show a friendly message + reset button rather than a blank grid.

## Accessibility

- **Palette**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; rows are `role="option"` with `aria-selected` on `activeIndex`; `aria-activedescendant` on the listbox so screen readers track keyboard selection without moving DOM focus. Focus trap + restore via `useModalA11y`.
- **Sort control**: `<select>` (native semantics) or segmented control with `aria-label`.
- **Tag chips**: `aria-pressed` mirroring existing category buttons.
- **⌘K hint**: visible `<kbd>` chip for discoverability alongside the keyboard trigger.
- **Reduced motion**: command palette's `AnimePresence` animations honor existing `prefers-reduced-motion` handling in the library.

## Testing strategy

- **`catalog.test.ts`** (extended): data integrity for new fields + cross-module `docsAnchor` contract.
- **`selectDemos` logic** (inside `useDemoFilter`'s `useMemo`): exercised via the existing filter hook behavior; a focused unit test for the sort comparator is optional but valuable.
- **Manual smoke tests**: filter persists across reload and back/forward; ⌘K opens/closes/navigates; empty state renders; related components exclude self.

## Build sequence (phased, each independently shippable)

**Phase 1 — URL state (priority 1 core):**
- `types.ts`: add `SortKey`; extend `FilterState` + `DemoSection`.
- `routes/demos.tsx`: add `validateSearch`.
- `hooks.ts`: rewrite `useDemoFilter` to URL-backed; add sort (alpha/category/recent).
- Smoke test: filter/category/sort persist across reload and back/forward.

**Phase 2 — Tags + richer FilterBar:**
- `data/sections.ts`: backfill `tags`.
- `constants.ts`: add `SORT_OPTIONS`.
- `filter-bar.tsx`: add sort + tag row.
- `component-gallery-page.tsx`: pass new props; add empty state.

**Phase 3 — Visual redesign of cards:**
- `data/sections.ts`: backfill `difficulty`.
- `constants.ts`: add `DIFFICULTY_META`.
- `gallery-card.tsx`: tags + difficulty badge.

**Phase 4 — Command palette (priority 1 final):**
- Extract `src/landing/hooks/use-modal-a11y.ts`.
- Refactor `CodeModal.tsx` to consume it.
- Create `command-palette.tsx`.
- Wire ⌘K + state in `component-gallery-shell.tsx`.
- Update `index.ts` exports.

**Phase 5 — Detail page depth (priority 3):**
- Create `data/docs-links.ts`; verify each anchor against `docs/reference-data.ts`.
- `data/sections.ts`: backfill `docsAnchor` (mirror `demoDocsLinks`).
- `component-detail-page.tsx`: difficulty badge, related-components section, docs cross-link, fix `bg-violet-500`.
- Extend `catalog.test.ts`.

## Deferred / flagged (NOT in this PR)

- **Cross-codebase `cn` dedup** (3 utils → 1): real DRY win but unrelated churn across `lib/utils.ts`, `landing/utils/cn.ts`, `detail-previews/utils.ts`.
- **`SectionHeader` hero swap** in gallery: nice consistency win but cosmetic.
- **Latent `--color-landing-text` token bug** in `split-text.tsx`/`layout.tsx` previews: separate bug fix.
- **Shared `<Dialog>` primitive**: two consumers doesn't justify it yet; revisit if a third modal arrives.
- **Multi-tag filtering, real recency timestamps, per-prop docs links**: future enhancements.
