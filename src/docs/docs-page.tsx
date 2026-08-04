import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from './components/code-block';
import { DocsHeader } from './components/docs-header';
import { DocsOutline } from './components/docs-outline';
import { DocsSidebar } from './components/docs-sidebar';
import { docsNavigation } from './data';
import { useActiveSection } from './hooks/use-active-section';
import { componentReferences, hookReferences } from './reference-data';
import { ReferenceSection } from './components/reference-section';

const installCode = `pnpm add @shakibdshy/react-animejs animejs`;

const importCode = `import {
  useAnime,
  fadeInUp,
  stagger,
} from '@shakibdshy/react-animejs'`;

const navigationSectionIds = docsNavigation.flatMap((group) =>
  group.items.map((item) => item.href.slice(1))
);

const firstAnimationCode = `import { useAnime } from '@shakibdshy/react-animejs'

export function Welcome() {
  const { ref, controls, state } = useAnime({
    opacity: [0, 1],
    translateY: [24, 0],
    duration: 700,
    ease: 'outExpo',
    autoplay: false,
  })

  return (
    <section>
      <h1 ref={ref}>Animations that flow.</h1>
      <button onClick={controls.play}>Play</button>
      <output>{Math.round(state.progress)}%</output>
    </section>
  )
}`;

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-landing-border pb-7">
      <p className="landing-font-mono mb-3 text-[10px] font-semibold tracking-[0.17em] text-landing-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="landing-font-display m-0 text-3xl font-bold tracking-tight text-landing-fg sm:text-[2.5rem]">
        {title}
      </h2>
      {children && (
        <div className="mt-4 max-w-2xl text-base leading-7 text-landing-muted">{children}</div>
      )}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 flex gap-3 rounded-lg border border-landing-border border-l-[3px] border-l-landing-accent bg-landing-surface/60 p-4 text-sm leading-6 text-landing-fg">
      <Info className="mt-0.5 shrink-0 text-landing-accent" size={17} />
      <div>
        <span className="mr-1 font-semibold">Note.</span>
        {children}
      </div>
    </aside>
  );
}

export function DocsPage() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const activeSection = useActiveSection(navigationSectionIds);

  return (
    <div className="min-h-screen bg-landing-bg text-landing-fg transition-[background,color] duration-300">
      <DocsHeader onOpenNavigation={() => setIsNavigationOpen(true)} />
      <div className="mx-auto flex max-w-400">
        <DocsSidebar
          isOpen={isNavigationOpen}
          onClose={() => setIsNavigationOpen(false)}
          activeSection={activeSection}
        />
        <main className="grid min-w-0 flex-1 grid-cols-1 gap-12 px-5 py-11 sm:px-10 lg:px-14 lg:py-14 xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-16">
          <article className="w-full max-w-3xl xl:max-w-none">
            <header className="mb-14 border-b border-landing-border pb-10">
              <nav
                className="mb-7 flex items-center gap-1.5 text-sm text-landing-muted"
                aria-label="Breadcrumb"
              >
                <a href="#installation" className="no-underline transition hover:text-landing-fg">
                  Documentation
                </a>
                <ChevronRight size={14} />
                <span className="text-landing-fg">Getting started</span>
              </nav>
              <p className="landing-font-mono mb-4 text-[10px] font-semibold tracking-[0.17em] text-landing-accent uppercase">
                React animation library
              </p>
              <h1 className="landing-font-display m-0 max-w-2xl text-4xl font-bold leading-[1.03] tracking-tight text-landing-fg sm:text-5xl">
                The React layer for Anime.js.
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-landing-muted">
                A practical reference for the hooks, declarative components, and helpers in the{' '}
                <code className="landing-font-mono text-sm text-landing-fg">
                  @shakibdshy/react-animejs
                </code>{' '}
                package.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                <a
                  href="#installation"
                  className="inline-flex items-center gap-2 font-semibold text-landing-accent no-underline transition hover:text-landing-accent-dim"
                >
                  Start here <ArrowRight size={15} />
                </a>
                <a
                  href="/demos"
                  className="inline-flex items-center gap-2 text-landing-muted no-underline transition hover:text-landing-fg"
                >
                  Browse live demos <ExternalLink size={14} />
                </a>
                <span className="inline-flex items-center gap-1.5 text-xs text-landing-muted">
                  <Clock3 size={13} /> Updated July 2026
                </span>
              </div>
            </header>

            <section id="installation" className="scroll-mt-24 pb-12">
              <SectionHeading eyebrow="Getting started" title="Installation">
                Install Anime.js, then import the local React wrapper through the configured{' '}
                <code className="landing-font-mono text-sm text-landing-fg">@</code> alias. This
                repository currently owns the wrapper; it is not published as a separate npm
                package.
              </SectionHeading>
              <CodeBlock language="bash">{installCode}</CodeBlock>
              <CodeBlock>{importCode}</CodeBlock>
              <Note>
                Use React 19+ and Anime.js v4. The hooks access browser APIs in effects, so render
                target elements normally and attach the returned ref rather than calling animation
                factories during render.
              </Note>
            </section>

            <section id="first-animation" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="Getting started" title="Your first animation">
                <code className="landing-font-mono text-sm text-landing-fg">useAnime</code> creates
                an animation after its target ref is mounted, keeps its state reactive, and reverts
                owned animation work when the component unmounts.
              </SectionHeading>
              <CodeBlock>{firstAnimationCode}</CodeBlock>
              <p className="text-[15px] leading-7 text-landing-muted">
                Pass Anime.js animation properties such as <code>opacity</code>,{' '}
                <code>translateY</code>, and <code>rotate</code> alongside playback settings such as{' '}
                <code>duration</code>, <code>ease</code>, <code>loop</code>, and{' '}
                <code>autoplay</code>. Use the returned <code>controls</code> for playback and{' '}
                <code>state</code> when the UI needs current time, progress, or play state.
              </p>
            </section>

            <section id="core-concepts" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="Foundation" title="Core concepts">
                The library is hooks-first. Components are convenience layers where JSX makes the
                relationship clearer; they are not a one-for-one replacement for every hook.
              </SectionHeading>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    'Refs are targets',
                    'Attach a returned ref to the DOM element you want to animate. Hooks also accept explicit targets where their API supports it.',
                  ],
                  [
                    'Controls are imperative',
                    'play, pause, restart, reverse, seek, and related methods live on controls. Keep effects in events or effects, never render.',
                  ],
                  [
                    'Scopes own cleanup',
                    'AnimeProvider and AnimeScope constrain animations and clean up managed work when their React boundary unmounts.',
                  ],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-md border border-landing-border bg-landing-surface p-4"
                  >
                    <h3 className="m-0 text-sm font-semibold text-landing-fg">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-landing-muted">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="hooks" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="API reference" title="Hooks">
                Each hook below includes its purpose, import/usage, a complete example, and its
                public options or return type.
              </SectionHeading>
              {hookReferences.map((entry) => (
                <ReferenceSection key={entry.id} entry={entry} kind="Hook" />
              ))}
              <Note>
                <strong>Internal-only:</strong> <code>useDependencySignal</code> supports stable
                dependency tracking inside the library and is not part of the public API.
              </Note>
            </section>

            <section id="components" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="API reference" title="Components">
                Components intentionally cover both hook-backed and composition patterns. Each entry
                documents its own API instead of implying every component is a hook wrapper.
              </SectionHeading>
              {componentReferences.map((entry) => (
                <ReferenceSection key={entry.id} entry={entry} kind="Component" />
              ))}
            </section>

            <section id="utilities" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="Helpers" title="Utilities">
                Utilities are public developer tools, not implementation details. Use them to make
                repeated animation values expressive and consistent.
              </SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-landing-border p-5">
                  <Boxes className="mb-3 text-landing-accent" size={20} />
                  <h3 className="m-0 text-base font-semibold">Presets</h3>
                  <p className="mb-0 mt-2 text-sm leading-6 text-landing-muted">
                    Use <code>fadeIn</code>, <code>fadeOut</code>, directional fades, scale and
                    slide presets, plus <code>pulse</code>, <code>bounce</code>, <code>shake</code>,{' '}
                    <code>wiggle</code>, <code>heartbeat</code>, flips, <code>rotateIn</code>, and{' '}
                    <code>spin</code>. <code>getPreset(name)</code> looks up a typed preset.
                  </p>
                </div>
                <div className="rounded-md border border-landing-border p-5">
                  <Code2 className="mb-3 text-landing-accent" size={20} />
                  <h3 className="m-0 text-base font-semibold">Stagger helpers</h3>
                  <p className="mb-0 mt-2 text-sm leading-6 text-landing-muted">
                    Choose simple, center, last, edges, indexed, grid X/Y, ripple, eased, in/out,
                    random, or custom staggering. <code>stagger</code> mirrors the library helper;{' '}
                    <code>createStagger</code> enables configuration.
                  </p>
                </div>
              </div>
              <CodeBlock>{`import { fadeInUp, gridStagger, clamp, lerp } from '@shakibdshy/react-animejs'

const cardAnimation = {
  ...fadeInUp,
  delay: gridStagger(80, 3, 2),
}

const safeProgress = clamp(progress, 0, 1)
const translateX = lerp(0, 120, safeProgress)`}</CodeBlock>
              <p className="text-[15px] leading-7 text-landing-muted">
                The general helper exports are <code>$</code>, <code>get</code>, <code>set</code>,{' '}
                <code>cleanInlineStyles</code>, <code>remove</code>, <code>sync</code>,{' '}
                <code>keepTime</code>, random and seeded-random helpers, <code>shuffle</code>,{' '}
                <code>round</code>, <code>clamp</code>, <code>snap</code>, <code>wrap</code>,{' '}
                <code>mapRange</code>, <code>lerp</code>, <code>damp</code>, padding helpers, and
                degree/radian conversion.
              </p>
            </section>

            <section id="animejs-exports" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="Reference" title="Anime.js exports">
                The package also re-exports carefully selected Anime.js primitives for advanced
                cases. This keeps a single import path when the React abstraction is not the right
                tool.
              </SectionHeading>
              <p className="text-[15px] leading-7 text-landing-muted">
                Available exports include <code>animate</code>, <code>createTimer</code>,{' '}
                <code>createTimeline</code>, <code>createLayout</code>,{' '}
                <code>createAnimatable</code>, <code>createScope</code>,{' '}
                <code>createDraggable</code>, SVG factories, <code>onScroll</code>,{' '}
                <code>morphTo</code>, easing constructors, <code>engine</code>, <code>waapi</code>,{' '}
                <code>events</code>, <code>splitText</code>, <code>scrambleText</code>, and adapter
                registration.
              </p>
              <Note>
                Prefer the React hooks and components when React owns the target lifecycle. Reach
                for raw Anime.js exports when integrating an imperative library, sharing an instance
                outside React, or using an API this wrapper intentionally leaves unopinionated.
              </Note>
            </section>

            <section id="typescript" className="scroll-mt-24 py-12">
              <SectionHeading eyebrow="Reference" title="TypeScript and cleanup">
                Exported options, returns, instance types, easing types, timeline types, layout
                types, draggable types, scroll types, scope types, adapter types, and component
                prop/ref types are available from the same entry point.
              </SectionHeading>
              <CodeBlock>{`import type {
  UseAnimeOptions,
  UseAnimeReturn,
  AnimeTimelineRef,
  UseAnimeOnScrollOptions,
} from '@shakibdshy/react-animejs'`}</CodeBlock>
              <p className="text-[15px] leading-7 text-landing-muted">
                Let the hook own the animation lifecycle whenever possible. If you create raw
                Anime.js instances yourself, clean them up in an effect cleanup function. Keep
                callbacks stable when they drive React state, and use refs or throttling for
                frame-level updates.
              </p>
            </section>

            <footer className="mt-8 grid gap-3 border-t border-landing-border pt-8 sm:grid-cols-2">
              <a
                href="#split-text-entry"
                className="group rounded-lg border border-landing-border p-4 text-left no-underline transition hover:border-landing-accent/60 hover:bg-landing-surface"
              >
                <span className="mb-2 flex items-center gap-1.5 text-xs text-landing-muted">
                  <ArrowLeft size={13} /> Previous
                </span>
                <span className="block text-sm font-semibold text-landing-fg">
                  Composition components
                </span>
                <span className="mt-1 block text-sm text-landing-muted">
                  Text splitting and coordinated UI primitives.
                </span>
              </a>
              <a
                href="#utilities"
                className="group rounded-lg border border-landing-border p-4 text-right no-underline transition hover:border-landing-accent/60 hover:bg-landing-surface"
              >
                <span className="mb-2 flex items-center justify-end gap-1.5 text-xs text-landing-muted">
                  Next <ArrowRight size={13} />
                </span>
                <span className="block text-sm font-semibold text-landing-fg">Utilities</span>
                <span className="mt-1 block text-sm text-landing-muted">
                  Presets, stagger helpers, and value tools.
                </span>
              </a>
            </footer>
          </article>
          <DocsOutline activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
}
