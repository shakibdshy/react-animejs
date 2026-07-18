import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Code as CodeIcon } from 'lucide-react';
import { AnimeProvider } from '@/lib/react-animejs';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { CursorTrailImagesDemo } from '@/demo/components/CursorTrailImagesDemo';
import { AddToCard } from './components/AddToCard';
import { PointerCollisionGrid } from './components/PointerCollisionGrid';
import { TiltCard } from './components/TiltCard';
import { ImageRevealSlider } from './components/ImageRevealSlider';
import { CursorTrackingPreview } from './components/CursorTrackingPreview';
import { MacOSDock } from './components/MacOSDock';
import { OrchestratedEaseReverse } from './components/OrchestratedEaseReverse';
import { CodeModal } from './components/CodeModal';
import { ScrubbedBentoGallery } from './components/ScrubbedBentoGallery';
import { ScrollBatchGallery } from './components/ScrollBatchGallery';
import { CanvasParticles } from './components/CanvasParticles';
import { CurveSwipe } from './components/CurveSwipe';
import { DynamicShapeOverlays } from './components/DynamicShapeOverlays';
import { HorizontalSplitText } from './components/HorizontalSplitText';
import { GridFlipModal } from './components/GridFlipModal';
import { ScrollImageSequence } from './components/ScrollImageSequence';
import { ScrollImageComparison } from './components/ScrollImageComparison';
import { LayeredPinningLoop } from './components/LayeredPinningLoop';
import { ScrollShader } from './components/ScrollShader';
// Exact source for each block, pulled at build time via Vite's ?raw so the
// "View Code" modal always shows the real, current code.
import cursorTrailSource from '@/demo/components/CursorTrailImagesDemo.tsx?raw';
import addToCardSource from './components/AddToCard.tsx?raw';
import pointerGridSource from './components/PointerCollisionGrid.tsx?raw';
import tiltCardSource from './components/TiltCard.tsx?raw';
import imageRevealSource from './components/ImageRevealSlider.tsx?raw';
import cursorTrackingSource from './components/CursorTrackingPreview.tsx?raw';
import dockSource from './components/MacOSDock.tsx?raw';
import easeReverseSource from './components/OrchestratedEaseReverse.tsx?raw';
import scrubbedBentoSource from './components/ScrubbedBentoGallery.tsx?raw';
import scrollBatchSource from './components/ScrollBatchGallery.tsx?raw';
import canvasParticlesSource from './components/CanvasParticles.tsx?raw';
import curveSwipeSource from './components/CurveSwipe.tsx?raw';
import dynamicShapeOverlaysSource from './components/DynamicShapeOverlays.tsx?raw';
import horizontalSplitTextSource from './components/HorizontalSplitText.tsx?raw';
import gridFlipModalSource from './components/GridFlipModal.tsx?raw';
import scrollImageSequenceSource from './components/ScrollImageSequence.tsx?raw';
import scrollImageComparisonSource from './components/ScrollImageComparison.tsx?raw';
import layeredPinningLoopSource from './components/LayeredPinningLoop.tsx?raw';
import scrollShaderSource from './components/ScrollShader.tsx?raw';

/** The set of blocks that can be shown in the code modal. */
type CodeTarget = {
  title: string;
  code: string;
};

const SOURCE_BY_KEY: Record<string, CodeTarget> = {
  'cursor-trail': { title: 'CursorTrailImagesDemo.tsx', code: cursorTrailSource },
  'grid-flip-modal': { title: 'GridFlipModal.tsx', code: gridFlipModalSource },
  'add-to-card': { title: 'AddToCard.tsx', code: addToCardSource },
  'pointer-grid': { title: 'PointerCollisionGrid.tsx', code: pointerGridSource },
  'tilt-card': { title: 'TiltCard.tsx', code: tiltCardSource },
  'image-reveal': { title: 'ImageRevealSlider.tsx', code: imageRevealSource },
  'cursor-tracking': { title: 'CursorTrackingPreview.tsx', code: cursorTrackingSource },
  'macos-dock': { title: 'MacOSDock.tsx', code: dockSource },
  'orchestrated-easereverse': { title: 'OrchestratedEaseReverse.tsx', code: easeReverseSource },
  'scrubbed-bento': { title: 'ScrubbedBentoGallery.tsx', code: scrubbedBentoSource },
  'scroll-batch': { title: 'ScrollBatchGallery.tsx', code: scrollBatchSource },
  'canvas-particles': { title: 'CanvasParticles.tsx', code: canvasParticlesSource },
  'curve-swipe': { title: 'CurveSwipe.tsx', code: curveSwipeSource },
  'dynamic-shape-overlays': { title: 'DynamicShapeOverlays.tsx', code: dynamicShapeOverlaysSource },
  'horizontal-split-text': { title: 'HorizontalSplitText.tsx', code: horizontalSplitTextSource },
  'scroll-image-sequence': { title: 'ScrollImageSequence.tsx', code: scrollImageSequenceSource },
  'scroll-image-comparison': {
    title: 'ScrollImageComparison.tsx',
    code: scrollImageComparisonSource,
  },
  'layered-pinning-loop': { title: 'LayeredPinningLoop.tsx', code: layeredPinningLoopSource },
  'scroll-shader': { title: 'ScrollShader.tsx', code: scrollShaderSource },
};

/** Header row for a block section: title, library-primitive chip, and a
 *  "View Code" button that opens the source modal. */
function SectionHeader({
  title,
  chip,
  codeKey,
  onViewCode,
}: {
  title: string;
  chip: string;
  codeKey: string;
  onViewCode: (key: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="landing-font-display text-xl font-bold text-landing-fg">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70">
          {chip}
        </span>
        <button
          onClick={() => onViewCode(codeKey)}
          className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-surface px-3 py-1.5 landing-font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-landing-muted transition-all hover:border-landing-accent hover:text-landing-accent"
        >
          <CodeIcon size={12} />
          View Code
        </button>
      </div>
    </div>
  );
}

/**
 * BlocksPage — a showcase page for standalone "block" examples (self-contained
 * patterns that aren't part of the component gallery). Mirrors the DemosPage
 * shell so it reads as a sibling page, and renders its own header (the root
 * layout hides the sidebar Header on top-level pages).
 */
export const BlocksPage = memo(function BlocksPage() {
  const [isDark, setIsDark] = useState(true);
  const [codeKey, setCodeKey] = useState<string | null>(null);

  const openCode = useCallback((key: string) => setCodeKey(key), []);
  const closeCode = useCallback(() => setCodeKey(null), []);

  const activeCode = codeKey ? SOURCE_BY_KEY[codeKey] : null;

  useEffect(() => {
    const stored = localStorage.getItem('demo-theme');
    const preferDark = stored !== null ? stored === 'dark' : true;
    setIsDark(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('demo-theme', next ? 'dark' : 'light');
  }, [isDark]);

  return (
    <AnimeProvider>
      <div className="min-h-screen bg-landing-bg text-landing-fg transition-[background,color] duration-[0.35s] ease-in-out">
        <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-landing-bg/85 backdrop-blur-xl border-b border-landing-border transition-[background,border-color] duration-[0.35s] ease-in-out">
          <Link
            to="/"
            className="landing-font-display text-lg font-bold tracking-tight text-landing-fg hover:text-landing-accent transition-colors no-underline"
          >
            React AnimeJS <em className="not-italic text-landing-accent">{'✦'}</em>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Home
            </Link>
            <Link
              to="/demos"
              className="text-sm text-landing-muted font-medium hover:text-landing-fg transition-colors duration-200 no-underline"
            >
              Components
            </Link>
            <Link to="/blocks" className="text-sm text-landing-accent font-medium no-underline">
              Blocks
            </Link>
            <button
              onClick={toggleTheme}
              className="bg-transparent border border-landing-border rounded-full w-10 h-10 cursor-pointer text-base text-landing-muted flex items-center justify-center hover:bg-landing-surface hover:text-landing-fg transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
        </header>

        <ErrorBoundary>
          <section className="pt-28 pb-12 text-center px-6">
            <p className="landing-font-mono text-sm text-landing-accent mb-4 tracking-widest uppercase">
              Blocks
            </p>
            <h1 className="landing-font-display text-4xl md:text-5xl font-bold tracking-tight text-landing-fg mb-4">
              Example blocks
            </h1>
            <p className="text-base text-landing-muted max-w-xl mx-auto">
              Self-contained patterns built with react-animejs — copy-paste starting points you can
              drop into your own app.
            </p>
          </section>

          <div className="max-w-300 mx-auto px-6 pb-20">
            {/* Cursor Trail with Images */}
            <section className="mb-16">
              <SectionHeader
                title="Cursor Trail · Images"
                chip="<Anime>"
                codeKey="cursor-trail"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A queue of sprites, each owning its own{' '}
                <code className="landing-font-mono text-landing-accent">useAnimatable</code> x/y. On{' '}
                <code className="landing-font-mono">pointermove</code> every sprite eases toward the
                cursor with a progressively longer duration — the head follows tight, the tail lags.
              </p>
              <ErrorBoundary>
                <CursorTrailImagesDemo />
              </ErrorBoundary>
            </section>

            {/* Grid Flip Modal — FLIP grid tile into modal */}
            <section className="mb-16">
              <SectionHeader
                title="Grid Flip Modal · Tile to Modal"
                chip="AnimeLayout · createLayout"
                codeKey="grid-flip-modal"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Click a tile and it flies into a centered modal; click again to send it back. The
                real DOM node is reparented into a{' '}
                <code className="landing-font-mono">&lt;dialog&gt;</code> inside a single{' '}
                <code className="landing-font-mono text-landing-accent">AnimeLayout</code> root
                (with <code className="landing-font-mono">children:&apos;*&apos;</code>), so
                anime.js&rsquo;s layout system correlates the old grid position with the new modal
                position via a shared{' '}
                <code className="landing-font-mono text-landing-accent">data-layout-id</code> and
                FLIP-animates the size + position change on an{' '}
                <code className="landing-font-mono">inOutQuad</code> curve.
              </p>
              <ErrorBoundary>
                <GridFlipModal />
              </ErrorBoundary>
            </section>

            {/* Cursor Tracking Image Preview */}
            <section className="mb-16">
              <SectionHeader
                title="Cursor Tracking · Image Preview"
                chip="useAnimatable + Anime"
                codeKey="cursor-tracking"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Hover a thumbnail and a larger preview window chases the cursor with spring-eased
                movement (
                <code className="landing-font-mono text-landing-accent">useAnimatable</code>{' '}
                translate setters fed on every pointermove). Moving between thumbnails swaps the
                image with an{' '}
                <code className="landing-font-mono text-landing-accent">{'<Anime>'}</code>{' '}
                cross-fade so it never hard-cuts.
              </p>
              <ErrorBoundary>
                <CursorTrackingPreview />
              </ErrorBoundary>
            </section>

            {/* Add To Card — fly into basket along a curve */}
            <section className="mb-16">
              <SectionHeader
                title="Add To Cart · Arc Fly"
                chip="Anime · keyframes"
                codeKey="add-to-card"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Click <em>Add to cart</em> and a sprite arcs from the card to the basket along a
                three-point keyframe curve (origin → lifted midpoint → basket). The declarative{' '}
                <code className="landing-font-mono text-landing-accent">{'<Anime>'}</code> drives
                translate, scale, and the basket&rsquo;s impact pulse.
              </p>
              <ErrorBoundary>
                <AddToCard />
              </ErrorBoundary>
            </section>

            {/* Pointer Collision Grid — swept detection */}
            <section className="mb-16">
              <SectionHeader
                title="Pointer Collision · Swept Grid"
                chip="useAnimatable"
                codeKey="pointer-grid"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A 20×20 grid that lights every cell the pointer sweeps — even on a fast flick. On
                each <code className="landing-font-mono">pointermove</code> a supercover line walks
                from the last cell to the current one, lighting all cells in between. Each cell owns
                a <code className="landing-font-mono text-landing-accent">useAnimatable</code> that
                flashes and fades it.
              </p>
              <ErrorBoundary>
                <PointerCollisionGrid />
              </ErrorBoundary>
            </section>

            {/* Tilt Card */}
            <section className="mb-16">
              <SectionHeader
                title="Tilt Card"
                chip="useAnimatable"
                codeKey="tilt-card"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                The card tilts in 3D toward the cursor. Pointer position maps to{' '}
                <code className="landing-font-mono text-landing-accent">rotateX</code>/{' '}
                <code className="landing-font-mono text-landing-accent">rotateY</code> setters from{' '}
                <code className="landing-font-mono text-landing-accent">useAnimatable</code>, which
                ease toward each new value — and a glare highlight follows the pointer. Leaving the
                card springs it back to level.
              </p>
              <ErrorBoundary>
                <TiltCard />
              </ErrorBoundary>
            </section>

            {/* Image Reveal Slider — before/after */}
            <section className="mb-16">
              <SectionHeader
                title="Image Reveal · Before / After"
                chip="useAnimatable"
                codeKey="image-reveal"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A draggable handle reveals one image over another. A single drag value feeds two{' '}
                <code className="landing-font-mono text-landing-accent">useAnimatable</code> setters
                — the overlay&rsquo;s <code className="landing-font-mono">width</code> and the
                handle&rsquo;s <code className="landing-font-mono">left</code> — easing in lockstep
                with pointer capture holding the drag through fast flicks.
              </p>
              <ErrorBoundary>
                <ImageRevealSlider />
              </ErrorBoundary>
            </section>

            {/* macOS Dock — fisheye magnification */}
            <section className="mb-16">
              <SectionHeader
                title="macOS Dock · Fisheye"
                chip="useAnimatable"
                codeKey="macos-dock"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Icons magnify toward the cursor with a smooth inverted-parabola falloff so neighbors
                rise too — the signature dock &ldquo;genie&rdquo;. Each icon owns a{' '}
                <code className="landing-font-mono text-landing-accent">useAnimatable</code> for{' '}
                <code className="landing-font-mono">scale</code> +{' '}
                <code className="landing-font-mono">translateY</code>; one dock-level pointermove
                computes every icon&rsquo;s target from its distance to the cursor. Leaving springs
                them back to rest.
              </p>
              <ErrorBoundary>
                <MacOSDock />
              </ErrorBoundary>
            </section>

            {/* Orchestrated easeReverse */}
            <section className="mb-16">
              <SectionHeader
                title="Orchestrated easeReverse · Exit Controls"
                chip="useAnimeTimeline"
                codeKey="orchestrated-easereverse"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Toggle <code className="landing-font-mono text-landing-accent">easeReverse</code> to
                compare transitions: ON executes a custom closing sequence with smooth, non-bouncy
                curves (<code className="landing-font-mono text-landing-accent">outQuad</code>) and
                adjustable speed, while OFF plays the entrance sequence in reverse (reversing the
                bouncy <code className="landing-font-mono text-landing-accent">outBack</code>{' '}
                animation).
              </p>
              <ErrorBoundary>
                <OrchestratedEaseReverse />
              </ErrorBoundary>
            </section>

            {/* Scrubbed Bento Gallery — scroll-scrubbed FLIP morph */}
            <section className="mb-16">
              <SectionHeader
                title="Scrubbed Bento Gallery · Scroll Zoom"
                chip="useAnimeOnScroll + utils.lerp"
                codeKey="scrubbed-bento"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A 3×3 bento grid sits centered inside a scrollable box; as you scroll{' '}
                <em>inside the box</em>, the grid tracks interpolate from compact to huge (
                <code className="landing-font-mono">33% → 100%</code>). Centering +{' '}
                <code className="landing-font-mono">overflow: hidden</code> turns that into a zoom —
                the center image fills the box while the rest scatter off-canvas, then a content
                panel fades in. A port of the GSAP &ldquo;Scrubbed Bento Gallery&rdquo; driven by
                one <code className="landing-font-mono text-landing-accent">useAnimeOnScroll</code>{' '}
                observer (scoped to a <code className="landing-font-mono">container</code>)
                scrubbing <code className="landing-font-mono text-landing-accent">utils.lerp</code>{' '}
                on the grid tracks.
              </p>
              <ErrorBoundary>
                <ScrubbedBentoGallery />
              </ErrorBoundary>
            </section>

            {/* Scroll-based Image Sequence — Apple AirPods Pro style image sequence */}
            <section className="mb-16">
              <SectionHeader
                title="Scroll-based Image Sequence · Apple Style"
                chip="useAnimeOnScroll + useAnime"
                codeKey="scroll-image-sequence"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                An Apple-style scroll-driven canvas image sequence preloading 147 frames. Syncs
                scroll progress to the active frame index using a plain object playhead, or switches
                to autoplay mode with loops and adjustable speeds. Storytelling overlays fade in and
                out at specific frames.
              </p>
              <ErrorBoundary>
                <ScrollImageSequence />
              </ErrorBoundary>
            </section>

            {/* Scroll comparison — pinned before/after reveal */}
            <section className="mb-16">
              <SectionHeader
                title="Image Comparison · Scroll Reveal"
                chip="<AnimeScroll> + opposing transforms"
                codeKey="scroll-image-comparison"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Scroll through a pinned before/after frame. The after panel moves in from the right
                while its image counter-moves from the left. AnimeScroll scopes progress to the
                fixed comparison panel, with no page-height expansion or infinite loop.
              </p>
              <ErrorBoundary>
                <ScrollImageComparison />
              </ErrorBoundary>
            </section>

            {/* Layered pinning — finite sticky panel stack */}
            <section className="mb-16">
              <SectionHeader
                title="Layered Pinning · Finite Stack"
                chip="<AnimeScroll> + sticky"
                codeKey="layered-pinning-loop"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A self-contained panel stack inspired by GreenSock&rsquo;s layered pinning pattern.
                Each panel pins at the top of the stage while the next panel layers over it in one
                continuous, finite scroll sequence.
              </p>
              <ErrorBoundary>
                <LayeredPinningLoop />
              </ErrorBoundary>
            </section>

            {/* Scroll Shader — velocity-reactive WebGL canvases */}
            <section className="mb-16">
              <SectionHeader
                title="Scroll Shader · Velocity Distortion"
                chip="<AnimeScroll> + WebGL"
                codeKey="scroll-shader"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A native WebGL image stack where AnimeScroll feeds signed scroll velocity into a
                cover-mapped shader. Move faster to pull the RGB channels apart; every frame falls
                back to its image when WebGL is unavailable.
              </p>
              <ErrorBoundary>
                <ScrollShader />
              </ErrorBoundary>
            </section>

            {/* Scroll Batch Gallery — staggered enter on scroll */}
            <section className="mb-16">
              <SectionHeader
                title="Scroll Batch Gallery · Staggered Enter"
                chip="IntersectionObserver + stagger()"
                codeKey="scroll-batch"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A grid of images that stagger-fades in as each enters the viewport — a port of
                GSAP&rsquo;s{' '}
                <code className="landing-font-mono text-landing-accent">ScrollTrigger.batch()</code>
                . A container-scoped{' '}
                <code className="landing-font-mono text-landing-accent">IntersectionObserver</code>
                collects items entering within the same 100ms window, then Anime.js animates that
                batch with <code className="landing-font-mono text-landing-accent">stagger()</code>.
              </p>
              <ErrorBoundary>
                <ScrollBatchGallery />
              </ErrorBoundary>
            </section>

            {/* Canvas Particles — timeline-driven canvas renderer */}
            <section className="mb-16">
              <SectionHeader
                title="Canvas Particles · Timeline Renderer"
                chip="AnimeTimeline + Canvas"
                codeKey="canvas-particles"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A canvas particle field driven by one{' '}
                <code className="landing-font-mono text-landing-accent">AnimeTimeline</code>. Each
                particle is a plain JavaScript target with function-based positions and staggered
                timing; the timeline&rsquo;s update callback redraws the canvas, while the controls
                toggle playback speed.
              </p>
              <ErrorBoundary>
                <CanvasParticles />
              </ErrorBoundary>
            </section>

            {/* Curve Swipe — SVG path morph */}
            <section className="mb-16">
              <SectionHeader
                title="Curve Swipe · SVG Morph"
                chip="AnimeTimeline · SVG path"
                codeKey="curve-swipe"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Click the stage to raise and lower an SVG curve. Two sequential{' '}
                <code className="landing-font-mono text-landing-accent">d</code> path morphs are
                composed in{' '}
                <code className="landing-font-mono text-landing-accent">AnimeTimeline</code>, then
                played forward or reversed from the same timeline.
              </p>
              <ErrorBoundary>
                <CurveSwipe />
              </ErrorBoundary>
            </section>

            {/* Dynamic Shape Overlays — cascading SVG path morphs */}
            <section className="mb-16">
              <SectionHeader
                title="Dynamic Shape Overlays · Cascade Morph"
                chip="AnimeMorph · SVG path"
                codeKey="dynamic-shape-overlays"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                Click the stage to cascade-cover it. Four stacked SVG layers each morph their{' '}
                <code className="landing-font-mono text-landing-accent">d</code> attribute through a
                keyframe sequence (flat → curve → full cover) via one{' '}
                <code className="landing-font-mono text-landing-accent">AnimeMorph</code> per layer;
                an incremental stagger on <code className="landing-font-mono">play()</code>/
                <code className="landing-font-mono">reverse()</code> makes the reveal read as a
                travelling wave. A port of the codrops &ldquo;Dynamic Shape Overlays&rdquo;.
              </p>
              <ErrorBoundary>
                <DynamicShapeOverlays />
              </ErrorBoundary>
            </section>

            {/* Horizontal SplitText — nested-scroll char reveal */}
            <section className="mb-16">
              <SectionHeader
                title="Horizontal SplitText · Nested Scroll"
                chip="SplitText + useAnimeOnScroll"
                codeKey="horizontal-split-text"
                onViewCode={openCode}
              />
              <p className="text-sm text-landing-muted max-w-2xl mb-5">
                A pinned box scrubs a long line of{' '}
                <code className="landing-font-mono text-landing-accent">SplitText</code> characters
                sideways as you scroll vertically. Each char settles in with a random vertical
                offset + rotation tied to its <em>horizontal</em> position on screen — GSAP&rsquo;s{' '}
                <code className="landing-font-mono text-landing-accent">containerAnimation</code>{' '}
                trick, replicated with one{' '}
                <code className="landing-font-mono text-landing-accent">useAnimeOnScroll</code>{' '}
                scrub driving a per-frame <code className="landing-font-mono">back.out</code> ease.
              </p>
              <ErrorBoundary>
                <HorizontalSplitText />
              </ErrorBoundary>
            </section>
          </div>

          <footer className="border-t border-landing-border py-8 text-center">
            <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/60">
              React AnimeJS {'✦'}
            </span>
          </footer>
        </ErrorBoundary>

        {/* Code modal — rendered once; opened by any section's View Code button. */}
        {activeCode && (
          <CodeModal open title={activeCode.title} code={activeCode.code} onClose={closeCode} />
        )}
      </div>
    </AnimeProvider>
  );
});
