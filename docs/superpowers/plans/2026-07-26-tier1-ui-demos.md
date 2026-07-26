# Tier 1 UI Components — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new everyday UI demos to the `/demos` gallery: Tooltip, Dropdown Menu, Accordion, Toast, and Tabs. These are the most commonly-reached-for UI patterns currently missing from both the gallery and the blocks showcase.

**Architecture:** Each demo is a self-contained detail preview (no new library components — previews use `useAnime`/`AnimePresence` directly). Per demo, register across 5 sync points enforced by the catalog test: `sections.ts`, `details.ts`, `gallery-preview.tsx`, `detail-previews/registry.ts` (+ new preview file), `docs-links.ts`. All 5 demos land in the `ui` category.

**Tech Stack:** React 19 + TanStack Router + Tailwind v4 + anime.js v4.5 via `@/lib/react-animejs` (`useAnime`, `AnimePresence`, `AnimePresenceChild`, `useAnimatable`).

## Global Constraints

- **5 sync points per demo** (test-enforced via `catalog.test.ts`): every `componentId` must exist in `demoSections`, `demoDetails`, `galleryPreviewRegistry`, `previewRegistry`, AND `demoDocsLinks`. The `docsAnchor` on the section must equal the `anchor` in `demoDocsLinks`.
- **Valid docs anchors** must exist as an `id` in `src/docs/reference-data.ts`. For these demos: `use-anime` (Tooltip, Dropdown, Accordion, Tabs) and `anime-presence` (Toast).
- **Preview signature:** every detail preview is `memo(function XPreview(_props: PreviewProps) {...})` where `PreviewProps = Record<string, never>`. Compose `PreviewCard` + `DemoButton` from `detail-previews/shared.tsx`.
- **Gallery preview signature:** small looping autoplay component using `useAnime({... loop: true, delay: ... })` with a unique `selector` class prefixed `demo-prev-*`, registered in `galleryPreviewRegistry`.
- **No new library components.** Previews use `useAnime`/`AnimePresence` directly — these are demo patterns, not API additions.
- **Category:** all 5 are `'ui'`. **Difficulty:** Tooltip/Tabs = beginner; Dropdown/Accordion = intermediate; Toast = intermediate.
- **Function-based per-target values require `deps`:** anime.js v4 supports `opacity: (_, i) => ...` function values, and the project types allow it. BUT `useAnime` only re-initializes when its `deps` array changes (it fingerprints animatable props via JSON, and functions serialize to noise). So any preview using a function value that closes over React state MUST pass that state in `deps: [stateVar]`. Used in Accordion (`deps: [openIndex]`) and Tabs (`deps: [active]`).
- **Use `maxHeight`, not `height: 'auto'`:** anime.js v4 doesn't reliably interpolate `height: 'auto'` for collapse animations. Use `maxHeight: 0 / N` instead (the established workaround for accordions/dropdowns). The Accordion preview uses `maxHeight: (_, i) => openIndex === i ? 200 : 0`.
- **Design tokens:** use `landing-bg`, `landing-surface`, `landing-fg`, `landing-muted`, `landing-border`, `landing-accent`. Fonts: `landing-font-display` (headings), `landing-font-mono` (labels).
- **Commit convention:** `feat(gallery): add <component> demo`.

## File Structure

**New files (1):**
- `src/component-gallery/components/detail-previews/ui-previews.tsx` — all 5 detail previews (Tooltip, Dropdown, Accordion, Toast, Tabs) in one file, matching the `wrapper-previews.tsx` / `interaction-previews.tsx` convention of grouping by domain.

**Modified files (5 — the sync points):**
- `src/component-gallery/data/sections.ts` — 5 new entries
- `src/component-gallery/data/details.ts` — 5 new entries
- `src/component-gallery/data/docs-links.ts` — 5 new entries
- `src/component-gallery/components/gallery-preview.tsx` — 5 new card previews + registry lines
- `src/component-gallery/components/detail-previews/registry.ts` — import + register 5 new previews

**No test file changes** — the existing `catalog.test.ts` automatically covers the new demos once they're registered (it iterates `demoSections`).

---

## Task 1: Add Tooltip demo (5 sync points)

A hover/focus-triggered tooltip that fades + slides in with a spring.

**Files:**
- Modify: `src/component-gallery/data/sections.ts`
- Modify: `src/component-gallery/data/details.ts`
- Modify: `src/component-gallery/data/docs-links.ts`
- Modify: `src/component-gallery/components/gallery-preview.tsx`
- Modify: `src/component-gallery/components/detail-previews/registry.ts`
- Create: `src/component-gallery/components/detail-previews/ui-previews.tsx`

- [ ] **Step 1: Add the section entry**

In `src/component-gallery/data/sections.ts`, add this entry to the `demoSections` array (before the closing `] as const satisfies`):

```ts
{
  title: 'Tooltip',
  description: 'Hover or focus trigger with spring enter/exit and smart placement',
  category: 'ui',
  componentId: 'tooltip',
  tags: ['ui', 'hover', 'reveal'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime',
},
```

- [ ] **Step 2: Add the detail entry**

In `src/component-gallery/data/details.ts`, add this key to the `demoDetails` object:

```ts
tooltip: {
  component: 'useAnime',
  summary: 'Hover or focus trigger with spring enter/exit and smart placement.',
  code: `const [open, setOpen] = useState(false)

useAnime({
  selector: '.tooltip-pop',
  opacity: open ? [0, 1] : [1, 0],
  translateY: open ? [6, 0] : [0, 6],
  scale: open ? [0.9, 1] : [1, 0.9],
  duration: 220,
  ease: 'outBack',
})

return (
  <span
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
  >
    Hover me
    <span className="tooltip-pop">Tooltip text</span>
  </span>
)`,
  props: [
    { name: 'opacity', type: 'number[]', default: '[0, 1]', desc: 'Fade keyframes' },
    { name: 'translateY', type: 'number[]', default: '[6, 0]', desc: 'Slide-in offset' },
    { name: 'scale', type: 'number[]', default: '[0.9, 1]', desc: 'Pop scale' },
    { name: 'duration', type: 'number', default: '220', desc: 'Enter/exit ms' },
    { name: 'ease', type: 'string', default: 'outBack', desc: 'Spring-like easing' },
  ],
},
```

- [ ] **Step 3: Add the docs-links entry**

In `src/component-gallery/data/docs-links.ts`, add:

```ts
tooltip: { anchor: 'use-anime', label: 'useAnime' },
```

- [ ] **Step 4: Add the gallery card preview**

In `src/component-gallery/components/gallery-preview.tsx`, add this preview function (near the other previews, before the `galleryPreviewRegistry` declaration):

```tsx
function TooltipCardPreview() {
  useAnime({
    selector: '.demo-prev-tooltip',
    opacity: [0, 1],
    translateY: [8, 0],
    scale: [0.85, 1],
    duration: 500,
    ease: 'outBack' as never,
    loop: true,
    direction: 'alternate',
    delay: 600,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="landing-font-mono text-[11px] text-landing-muted">Hover me</div>
      <div className="demo-prev-tooltip landing-font-mono text-[11px] text-landing-bg bg-landing-accent px-2.5 py-1 rounded-md shadow-lg">
        Tooltip
      </div>
    </div>
  );
}
```

Then in the `galleryPreviewRegistry` object, add:

```ts
tooltip: TooltipCardPreview,
```

- [ ] **Step 5: Create the detail preview file (ui-previews.tsx)**

Create `src/component-gallery/components/detail-previews/ui-previews.tsx`. This first version contains only the Tooltip preview; Tasks 2-5 will append to it.

```tsx
import { memo, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

export const TooltipPreview = memo(function TooltipPreview(_props: PreviewProps) {
  const [open, setOpen] = useState(false);

  useAnime({
    selector: '.tooltip-prev-pop',
    opacity: open ? [0, 1] : [1, 0],
    translateY: open ? [8, 0] : [0, 8],
    scale: open ? [0.9, 1] : [1, 0.9],
    duration: 220,
    ease: 'outBack' as never,
  });

  return (
    <PreviewCard
      title="Tooltip"
      description="Hover or tap the target"
      controls={
        <DemoButton onClick={() => setOpen((o) => !o)} variant="accent" small>
          {open ? 'Hide' : 'Reveal'}
        </DemoButton>
      }
    >
      <div className="relative flex items-center justify-center py-8">
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors"
        >
          Hover or tap me
        </button>
        <div
          className={cn(
            'tooltip-prev-pop absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full',
            'landing-font-mono text-[11px] text-landing-bg bg-landing-accent px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none',
          )}
        >
          Helpful tip
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-landing-accent rotate-45" />
        </div>
      </div>
    </PreviewCard>
  );
});
```

- [ ] **Step 6: Register the detail preview**

In `src/component-gallery/components/detail-previews/registry.ts`, add to imports:

```ts
import { TooltipPreview } from './ui-previews';
```

And in the `previewRegistry` object, add:

```ts
tooltip: TooltipPreview,
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck` — expect no errors.
Run: `pnpm test` — expect the catalog test to pass (all 5 sync points covered for `tooltip`).

- [ ] **Step 8: Commit**

```bash
git add src/component-gallery/data/sections.ts src/component-gallery/data/details.ts src/component-gallery/data/docs-links.ts src/component-gallery/components/gallery-preview.tsx src/component-gallery/components/detail-previews/ui-previews.tsx src/component-gallery/components/detail-previews/registry.ts
git commit -m "feat(gallery): add Tooltip demo"
```

---

## Task 2: Add Dropdown Menu demo

A button-triggered menu with staggered item entrance and click-outside dismissal.

**Files:** same 5 sync points + append to `ui-previews.tsx`.

- [ ] **Step 1: Add section entry**

In `src/component-gallery/data/sections.ts`, add:

```ts
{
  title: 'Dropdown Menu',
  description: 'Button-triggered menu with staggered item entrance and click-outside dismiss',
  category: 'ui',
  componentId: 'dropdown-menu',
  tags: ['ui', 'menu', 'stagger'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime',
},
```

- [ ] **Step 2: Add detail entry**

In `src/component-gallery/data/details.ts`, add:

```ts
'dropdown-menu': {
  component: 'useAnime',
  summary: 'Button-triggered menu with staggered item entrance and click-outside dismiss.',
  code: `const [open, setOpen] = useState(false)

useAnime({
  selector: '.menu-item',
  opacity: open ? [0, 1] : [1, 0],
  translateY: open ? [-8, 0] : [0, -8],
  stagger: 40,
  duration: 200,
  ease: 'outQuad',
})`,
  props: [
    { name: 'stagger', type: 'number', default: '40', desc: 'Per-item delay cascade' },
    { name: 'translateY', type: 'number[]', default: '[-8, 0]', desc: 'Item slide-in' },
    { name: 'opacity', type: 'number[]', default: '[0, 1]', desc: 'Item fade' },
    { name: 'duration', type: 'number', default: '200', desc: 'Per-item ms' },
    { name: 'ease', type: 'string', default: 'outQuad', desc: 'Item easing' },
  ],
},
```

- [ ] **Step 3: Add docs-links entry**

In `src/component-gallery/data/docs-links.ts`, add:

```ts
'dropdown-menu': { anchor: 'use-anime', label: 'useAnime' },
```

- [ ] **Step 4: Add gallery card preview**

In `src/component-gallery/components/gallery-preview.tsx`, add:

```tsx
function DropdownMenuCardPreview() {
  useAnime({
    selector: '.demo-prev-menu-item',
    opacity: [0, 1],
    translateY: [-6, 0],
    stagger: 80,
    duration: 350,
    ease: 'outQuad' as never,
    loop: true,
    direction: 'alternate',
    delay: 700,
  });

  return (
    <div className="flex flex-col gap-1 w-28">
      {['Item one', 'Item two', 'Item three'].map((label) => (
        <div
          key={label}
          className="demo-prev-menu-item h-5 rounded bg-landing-surface border border-landing-border flex items-center px-2"
        >
          <span className="landing-font-mono text-[9px] text-landing-muted truncate">{label}</span>
        </div>
      ))}
    </div>
  );
}
```

Add to `galleryPreviewRegistry`:

```ts
'dropdown-menu': DropdownMenuCardPreview,
```

- [ ] **Step 5: Append detail preview to ui-previews.tsx**

In `src/component-gallery/components/detail-previews/ui-previews.tsx`, append (and add `useRef`, `useEffect` to the React import):

```tsx
export const DropdownMenuPreview = memo(function DropdownMenuPreview(_props: PreviewProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useAnime({
    selector: '.dropdown-prev-item',
    opacity: open ? [0, 1] : [1, 0],
    translateY: open ? [-8, 0] : [0, -8],
    stagger: open ? 40 : 0,
    duration: 200,
    ease: 'outQuad' as never,
  });

  const items = ['Profile', 'Settings', 'Theme', 'Sign out'];

  return (
    <PreviewCard
      title="Dropdown Menu"
      description="Click the trigger"
      controls={
        <DemoButton onClick={() => setOpen((o) => !o)} variant="accent" small>
          {open ? 'Close' : 'Open'}
        </DemoButton>
      }
    >
      <div ref={containerRef} className="relative flex items-center justify-center py-6">
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors flex items-center gap-2"
        >
          Menu
          <span className="text-landing-muted text-xs">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="absolute top-full mt-2 w-40 rounded-lg border border-landing-border bg-landing-surface shadow-xl overflow-hidden z-10">
            {items.map((item) => (
              <button
                key={item}
                className="dropdown-prev-item w-full text-left px-3 py-2 text-sm text-landing-fg hover:bg-landing-accent/10 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </PreviewCard>
  );
});
```

- [ ] **Step 6: Register the preview**

In `src/component-gallery/components/detail-previews/registry.ts`, update the import:

```ts
import { DropdownMenuPreview, TooltipPreview } from './ui-previews';
```

Add to registry:

```ts
'dropdown-menu': DropdownMenuPreview,
```

- [ ] **Step 7: Verify + commit**

Run `pnpm typecheck` and `pnpm test` (both pass), then:

```bash
git add -A
git commit -m "feat(gallery): add Dropdown Menu demo"
```

---

## Task 3: Add Accordion demo

Expand/collapse items with animated height and a rotating chevron.

**Files:** same 5 sync points + append to `ui-previews.tsx`.

- [ ] **Step 1: Add section entry**

In `src/component-gallery/data/sections.ts`, add:

```ts
{
  title: 'Accordion',
  description: 'Expand/collapse panels with height animation and single/multi open modes',
  category: 'ui',
  componentId: 'accordion',
  tags: ['ui', 'collapse', 'height'],
  difficulty: 'intermediate',
  docsAnchor: 'use-anime',
},
```

- [ ] **Step 2: Add detail entry**

In `src/component-gallery/data/details.ts`, add:

```ts
accordion: {
  component: 'useAnime',
  summary: 'Expand/collapse panels with height animation and single/multi open modes.',
  code: `const [openIndex, setOpenIndex] = useState<number | null>(0)

// Each panel reads the same openIndex; the open one animates to maxHeight,
// the rest collapse to 0. deps:[openIndex] re-inits on toggle.
useAnime({
  selector: '.accordion-panel',
  maxHeight: (_, i) => (openIndex === i ? 200 : 0),
  opacity: (_, i) => (openIndex === i ? [0, 1] : [1, 0]),
  duration: 300,
  ease: 'outExpo',
  deps: [openIndex],
})`,
  props: [
    { name: 'maxHeight', type: 'fn|number[]', default: '0 / N', desc: 'Panel max-height target (use maxHeight, not height, for reliable collapse)' },
    { name: 'opacity', type: 'number[]', default: '[0, 1]', desc: 'Content fade' },
    { name: 'deps', type: 'unknown[]', default: '[]', desc: 'Re-init animation when state changes (required for function values)' },
    { name: 'duration', type: 'number', default: '300', desc: 'Expand/collapse ms' },
    { name: 'ease', type: 'string', default: 'outExpo', desc: 'Decelerating curve' },
  ],
},
```

- [ ] **Step 3: Add docs-links entry**

```ts
accordion: { anchor: 'use-anime', label: 'useAnime' },
```

- [ ] **Step 4: Add gallery card preview**

In `src/component-gallery/components/gallery-preview.tsx`, add:

```tsx
function AccordionCardPreview() {
  useAnime({
    selector: '.demo-prev-acc-panel',
    maxHeight: [0, 28],
    opacity: [0, 1],
    stagger: 200,
    duration: 600,
    ease: 'outExpo' as never,
    loop: true,
    direction: 'alternate',
    delay: 600,
  });

  return (
    <div className="flex flex-col gap-1 w-32">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden">
          <div className="h-3 rounded bg-landing-accent/30 mb-0.5" />
          <div className="demo-prev-acc-panel max-h-0 rounded bg-landing-surface border border-landing-border overflow-hidden">
            <div className="h-7" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

Add to registry: `accordion: AccordionCardPreview,`

- [ ] **Step 5: Append detail preview**

In `ui-previews.tsx`, append:

```tsx
export const AccordionPreview = memo(function AccordionPreview(_props: PreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useAnime({
    selector: '.accordion-prev-panel',
    maxHeight: (_: unknown, i: number) => (openIndex === i ? 200 : 0),
    opacity: (_: unknown, i: number) => (openIndex === i ? [0, 1] : [1, 0]),
    duration: 300,
    ease: 'outExpo' as never,
    deps: [openIndex],
  });

  const items = [
    { title: 'What is react-animejs?', body: 'A React wrapper around anime.js v4 — hooks-first, with declarative components.' },
    { title: 'Do I need anime.js installed?', body: 'Yes. Install animejs separately; this package wraps its primitives.' },
    { title: 'Is it SSR-safe?', body: 'Hooks access browser APIs inside effects, so they render safely on the server.' },
  ];

  return (
    <PreviewCard
      title="Accordion"
      description="Click a header to toggle"
    >
      <div className="w-full max-w-80 flex flex-col gap-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.title} className="rounded-lg border border-landing-border bg-landing-surface/40 overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
              >
                <span className="text-sm text-landing-fg">{item.title}</span>
                <span
                  className={cn(
                    'landing-font-mono text-xs text-landing-muted transition-transform',
                    isOpen && 'rotate-180 text-landing-accent',
                  )}
                >
                  ▼
                </span>
              </button>
              <div className="accordion-prev-panel overflow-hidden">
                <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PreviewCard>
  );
});
```

- [ ] **Step 6: Register the preview**

In `registry.ts`, update import to include `AccordionPreview`, and add `'accordion': AccordionPreview,` to the registry.

- [ ] **Step 7: Verify + commit**

```bash
pnpm typecheck && pnpm test
git add -A && git commit -m "feat(gallery): add Accordion demo"
```

---

## Task 4: Add Toast demo

Stacked notifications with enter/exit animations using `AnimePresence`.

**Files:** same 5 sync points + append to `ui-previews.tsx`.

- [ ] **Step 1: Add section entry**

In `src/component-gallery/data/sections.ts`, add:

```ts
{
  title: 'Toast',
  description: 'Stacked notifications with enter/exit animations and auto-dismiss',
  category: 'ui',
  componentId: 'toast',
  tags: ['ui', 'notification', 'presence'],
  difficulty: 'intermediate',
  docsAnchor: 'anime-presence',
},
```

- [ ] **Step 2: Add detail entry**

In `src/component-gallery/data/details.ts`, add:

```ts
toast: {
  component: 'AnimePresence',
  summary: 'Stacked notifications with enter/exit animations and auto-dismiss.',
  code: `const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])

const push = () => setToasts((t) => [...t, { id: Date.now(), msg: 'Saved' }])

<AnimePresence mode="popLayout">
  {toasts.map((t) => (
    <AnimePresenceChild
      key={t.id}
      enter={{ opacity: [0, 1], translateX: [40, 0], scale: [0.9, 1] }}
      exit={{ opacity: [1, 0], translateX: [0, 40], scale: [1, 0.9] }}
      duration={300}
      ease="outExpo"
    >
      <Toast onDismiss={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}>
        {t.msg}
      </Toast>
    </AnimePresenceChild>
  ))}
</AnimePresence>`,
  props: [
    { name: 'mode', type: "'sync'|'wait'|'popLayout'", default: "'popLayout'", desc: 'Exit sequencing' },
    { name: 'enter', type: 'UseAnimeOptions', default: '-', desc: 'Enter keyframes per child' },
    { name: 'exit', type: 'UseAnimeOptions', default: '-', desc: 'Exit keyframes per child' },
    { name: 'duration', type: 'number', default: '300', desc: 'Enter/exit ms' },
    { name: 'ease', type: 'string', default: "'outExpo'", desc: 'Easing curve' },
  ],
},
```

- [ ] **Step 3: Add docs-links entry**

```ts
toast: { anchor: 'anime-presence', label: 'AnimePresence', extras: ['anime-presence-child'] },
```

- [ ] **Step 4: Add gallery card preview**

In `src/component-gallery/components/gallery-preview.tsx`, add:

```tsx
function ToastCardPreview() {
  useAnime({
    selector: '.demo-prev-toast',
    opacity: [0, 1],
    translateX: [20, 0],
    stagger: 120,
    duration: 500,
    ease: 'outExpo' as never,
    loop: true,
    direction: 'alternate',
    delay: 600,
  });

  return (
    <div className="flex flex-col gap-1.5 items-end">
      {['Saved', 'Copied'].map((msg) => (
        <div
          key={msg}
          className="demo-prev-toast landing-font-mono text-[10px] text-landing-bg bg-landing-accent px-2.5 py-1 rounded-md shadow-lg"
        >
          ✓ {msg}
        </div>
      ))}
    </div>
  );
}
```

Add to registry: `toast: ToastCardPreview,`

- [ ] **Step 5: Append detail preview**

In `ui-previews.tsx`, update imports to add `AnimePresence`, `AnimePresenceChild`:

```tsx
import { AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
```

Append the preview:

```tsx
interface ToastItem {
  id: number;
  message: string;
}

export const ToastPreview = memo(function ToastPreview(_props: PreviewProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const pushToast = () => {
    const messages = ['Saved successfully', 'Settings updated', 'Welcome back ✦', 'Item copied'];
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message: messages[id % messages.length] }]);
    window.setTimeout(() => {
      setToasts((arr) => arr.filter((x) => x.id !== id));
    }, 3000);
  };

  const dismiss = (id: number) => setToasts((arr) => arr.filter((x) => x.id !== id));

  return (
    <PreviewCard
      title="Toast"
      description="Click to push a notification"
      controls={
        <DemoButton onClick={pushToast} variant="accent" small>
          Push toast
        </DemoButton>
      }
    >
      <div className="relative w-full min-h-40 flex items-center justify-center">
        {toasts.length === 0 && (
          <span className="landing-font-mono text-[11px] text-landing-muted/60">
            No notifications
          </span>
        )}
        <div className="absolute bottom-0 right-0 flex flex-col gap-2 items-end w-44">
          <AnimePresence mode="popLayout">
            {toasts.map((t) => (
              <AnimePresenceChild
                key={t.id}
                enter={{ opacity: [0, 1], translateX: [40, 0], scale: [0.9, 1] }}
                exit={{ opacity: [1, 0], translateX: [0, 40], scale: [1, 0.9] }}
                duration={300}
                ease="outExpo"
              >
                <div className="w-full flex items-center justify-between gap-2 rounded-lg border border-landing-border bg-landing-surface px-3 py-2 shadow-lg">
                  <span className="text-xs text-landing-fg">{t.message}</span>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="text-landing-muted hover:text-landing-accent text-xs"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </AnimePresenceChild>
            ))}
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});
```

- [ ] **Step 6: Register the preview**

In `registry.ts`, add `ToastPreview` to the import and `'toast': ToastPreview,` to the registry.

- [ ] **Step 7: Verify + commit**

```bash
pnpm typecheck && pnpm test
git add -A && git commit -m "feat(gallery): add Toast demo"
```

---

## Task 5: Add Tabs demo

Tabbed content with a sliding underline indicator and cross-fading panels.

**Files:** same 5 sync points + append to `ui-previews.tsx`.

- [ ] **Step 1: Add section entry**

In `src/component-gallery/data/sections.ts`, add:

```ts
{
  title: 'Tabs',
  description: 'Animated underline indicator with cross-fading content panels',
  category: 'ui',
  componentId: 'tabs',
  tags: ['ui', 'indicator', 'crossfade'],
  difficulty: 'beginner',
  docsAnchor: 'use-anime',
},
```

- [ ] **Step 2: Add detail entry**

In `src/component-gallery/data/details.ts`, add:

```ts
tabs: {
  component: 'useAnime',
  summary: 'Animated underline indicator with cross-fading content panels.',
  code: `const [active, setActive] = useState(0)

// Sliding underline
useAnime({
  targets: underlineRef.current,
  translateX: active * TAB_WIDTH,
  duration: 300,
  ease: 'outExpo',
})

// Cross-fading content
useAnime({
  selector: '.tab-panel',
  opacity: (__, i) => active === i ? [0, 1] : [1, 0],
  duration: 250,
  deps: [active],
})`,
  props: [
    { name: 'translateX', type: 'number', default: '-', desc: 'Indicator slide target' },
    { name: 'opacity', type: 'number[]', default: '[0, 1]', desc: 'Panel cross-fade' },
    { name: 'deps', type: 'unknown[]', default: '[]', desc: 'Re-init when active tab changes' },
    { name: 'duration', type: 'number', default: '300', desc: 'Transition ms' },
    { name: 'ease', type: 'string', default: "'outExpo'", desc: 'Decelerating curve' },
  ],
},
```

- [ ] **Step 3: Add docs-links entry**

```ts
tabs: { anchor: 'use-anime', label: 'useAnime' },
```

- [ ] **Step 4: Add gallery card preview**

In `src/component-gallery/components/gallery-preview.tsx`, add:

```tsx
function TabsCardPreview() {
  useAnime({
    selector: '.demo-prev-tab-underline',
    translateX: [0, 48, 0],
    duration: 2000,
    ease: 'inOutQuad' as never,
    loop: true,
    delay: 500,
  });

  return (
    <div className="flex flex-col items-center gap-2 w-32">
      <div className="relative flex gap-4 border-b border-landing-border pb-1">
        {['A', 'B', 'C'].map((t) => (
          <span key={t} className="landing-font-mono text-[10px] text-landing-muted w-6 text-center">
            {t}
          </span>
        ))}
        <span className="demo-prev-tab-underline absolute bottom-[-1px] left-0 w-6 h-0.5 bg-landing-accent rounded-full" />
      </div>
    </div>
  );
}
```

Add to registry: `tabs: TabsCardPreview,`

- [ ] **Step 5: Append detail preview**

In `ui-previews.tsx`, append:

```tsx
export const TabsPreview = memo(function TabsPreview(_props: PreviewProps) {
  const [active, setActive] = useState(0);
  const underlineRef = useRef<HTMLDivElement>(null);

  useAnime({
    targets: underlineRef.current,
    translateX: active * 64, // tab width
    duration: 300,
    ease: 'outExpo' as never,
  });

  useAnime({
    selector: '.tabs-prev-panel',
    opacity: (_: unknown, i: number) => (active === i ? [0, 1] : [1, 0]),
    duration: 250,
    ease: 'outQuad' as never,
    deps: [active],
  });

  const tabs = [
    { label: 'Overview', body: 'A hooks-first React wrapper for anime.js v4. Declarative components where they help.' },
    { label: 'Install', body: 'pnpm add animejs — then import from @/lib/react-animejs. React 19+ and anime.js v4.' },
    { label: 'Learn', body: 'Start with useAnime for tweens, useAnimeTimeline for sequences, AnimePresence for exits.' },
  ];

  return (
    <PreviewCard title="Tabs" description="Click a tab to switch">
      <div className="w-full max-w-80">
        <div className="relative flex border-b border-landing-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={cn(
                'px-3 py-2 text-sm transition-colors w-16 text-center',
                active === i ? 'text-landing-accent' : 'text-landing-muted hover:text-landing-fg',
              )}
            >
              {tab.label}
            </button>
          ))}
          <div
            ref={underlineRef}
            className="absolute bottom-[-1px] left-0 w-16 h-0.5 bg-landing-accent rounded-full"
          />
        </div>
        <div className="relative min-h-20 mt-3">
          {tabs.map((tab, i) => (
            <p
              key={tab.label}
              className={cn(
                'tabs-prev-panel text-xs text-landing-muted leading-relaxed',
                active === i ? 'static' : 'absolute inset-0',
              )}
            >
              {tab.body}
            </p>
          ))}
        </div>
      </div>
    </PreviewCard>
  );
});
```

- [ ] **Step 6: Register the preview**

In `registry.ts`, add `TabsPreview` to the import and `'tabs': TabsPreview,` to the registry.

- [ ] **Step 7: Verify + commit**

```bash
pnpm typecheck && pnpm test
git add -A && git commit -m "feat(gallery): add Tabs demo"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full check suite**

```bash
pnpm typecheck   # no errors
pnpm lint        # 0 errors (pre-existing warnings in lib/hooks unchanged)
pnpm test        # catalog test covers all 23 demos (18 + 5 new)
pnpm build       # succeeds
```

- [ ] **Step 2: Manual smoke test**

Run `pnpm dev` (already running on `localhost:3002`), then:
1. `/demos` — verify 5 new cards appear: Tooltip, Dropdown Menu, Accordion, Toast, Tabs. Each card shows a looping mini-preview + tag chips + difficulty dot.
2. Filter by tag `ui` — all 5 new demos appear alongside existing UI demos.
3. Open each detail page (`/demos/tooltip`, `/demos/dropdown-menu`, etc.) — verify: card preview, code block, live interactive preview, props table, "Read the docs" link, related components.
4. Interact with each preview: hover the tooltip trigger, open/close the dropdown (click outside to dismiss), expand accordion panels, push toasts, switch tabs.
5. ⌘K palette — search "tooltip" / "toast" / "tabs" — all 5 appear and navigate correctly.

- [ ] **Step 3: Commit if any lint fixes**

```bash
pnpm lint:fix
git add -A && git commit -m "style: apply lint fixes to new ui-previews"  # only if changes
```

---

## Verification Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes — catalog test covers all 23 demos
- [ ] `pnpm build` succeeds
- [ ] All 5 new demos appear in `/demos` gallery with card previews
- [ ] Each detail page renders: preview, code, props, docs link, related
- [ ] Tooltip: hover + click toggle works
- [ ] Dropdown: open/close + click-outside dismissal
- [ ] Accordion: expand/collapse + chevron rotates
- [ ] Toast: push + auto-dismiss + manual dismiss + enter/exit animation
- [ ] Tabs: indicator slides + content cross-fades
- [ ] ⌘K palette finds all 5 new demos
