import type { DemoDetail } from "../types";
import type { DemoId } from './sections';

export const demoDetails = {
  "basic-animation": {
    component: "useAnime",
    summary: "Animate targets with CSS selectors, stagger, easing, and callbacks.",
    code: `const { controls } = useAnime({
  selector: '.box',
  // Per-segment durations live inside keyframe objects, not at the top level.
  translateX: [{ to: 120, duration: 600 }, { to: 0, duration: 400 }],
  scale: [{ to: 1.2, duration: 300 }, { to: 1, duration: 300 }],
  stagger: 80,
  ease: 'inOutQuad',
  autoplay: false, // trigger manually via controls.restart()
})`,
    props: [
      { name: "selector", type: "string", default: "-", desc: "CSS selector to target" },
      { name: "translateX", type: "object[]", default: "-", desc: "Keyframes with per-segment { to, duration }" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between targets" },
      { name: "ease", type: "string", default: "'inOutQuad'", desc: "Easing function" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Start on mount (false = trigger via controls)" },
      { name: "controls.restart", type: "function", default: "-", desc: "Replay the animation" },
    ],
  },

  "svg-morph": {
    component: "AnimeMorph",
    summary: "Morph between different SVG path shapes smoothly.",
    code: `<AnimeMorph target={targetRef} duration={800} ease="inOutQuad" alternate loop autoplay deps={[shape]}>
  <polygon points={shapeA} />
</AnimeMorph>`,
    props: [
      { name: "target", type: "RefObject", default: "-", desc: "Target polygon/path ref" },
      { name: "duration", type: "number", default: "1000", desc: "Morph duration in ms" },
      { name: "ease", type: "string", default: "'inOutQuad'", desc: "Easing function" },
      { name: "alternate", type: "boolean", default: "false", desc: "Reverse direction each iteration" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop the morph" },
      { name: "deps", type: "unknown[]", default: "[]", desc: "Re-run when the shape changes" },
    ],
  },
  "svg-draw": {
    component: "AnimeDraw",
    summary: "Animate SVG path drawing with stroke-dashoffset.",
    code: `<AnimeDraw draw={['0 0', '0 1', '1 1']} delay={index * 100} duration={2000} ease="inOutQuad" loop autoplay>
  <path d={svgPath} stroke="currentColor" strokeWidth={2} />
</AnimeDraw>`,
    props: [
      { name: "draw", type: "string[]", default: "-", desc: "Draw range keyframes" },
      { name: "duration", type: "number", default: "1000", desc: "Draw duration in ms" },
      { name: "ease", type: "string", default: "'inOutQuad'", desc: "Easing function" },
      { name: "delay", type: "number", default: "0", desc: "Start delay (use index * N to stagger)" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop the draw" },
    ],
  },
  "svg-motion-path": {
    component: "AnimeMotionPath",
    summary: "Move elements along an SVG motion path.",
    code: `<AnimeMotionPath path={trackRef} duration={5000} ease="linear" loop autoplay>
  <circle r={5} fill="accent" />
</AnimeMotionPath>`,
    props: [
      { name: "path", type: "RefObject<SVGPathElement>", default: "-", desc: "SVG path ref to follow" },
      { name: "duration", type: "number", default: "1000", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "linear", desc: "Easing function" },
    ],
  },

  "timer": {
    component: "useAnimeTimer",
    summary: "Standalone timer with playback controls, lifecycle callbacks, and imperative methods.",
    code: `const { controls, state, isRunning } = useAnimeTimer({
  duration: 1000,
  loop: true,
  autoplay: true, // start immediately; pause/restart via controls
  frameRate: 30,
})`,
    props: [
      { name: "duration", type: "number", default: "1000", desc: "Timer duration in ms" },
      { name: "loop", type: "number | boolean", default: "false", desc: "Loop count or infinite" },
      { name: "direction", type: "string", default: "normal", desc: "normal | alternate | reverse" },
      { name: "frameRate", type: "number", default: "60", desc: "Update frame rate" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Start on mount" },
      { name: "controls.play", type: "function", default: "-", desc: "Start/resume playback" },
      { name: "controls.pause", type: "function", default: "-", desc: "Pause playback" },
      { name: "controls.restart", type: "function", default: "-", desc: "Restart timer" },
      { name: "state.currentTime", type: "number", default: "-", desc: "Elapsed ms" },
      { name: "state.progress", type: "number", default: "-", desc: "Current progress 0→1" },
      { name: "state.currentIteration", type: "number", default: "-", desc: "Loop iteration count" },
    ],
  },

  "timeline": {
    component: "AnimeTimeline",
    summary: "Sequenced timeline animations with sync, labels, and imperative methods.",
    code: `const entries = [
  { targets: circleRef, translateX: [0, 60, 0], duration: 1200, ease: 'inOutQuad', position: 0 },
  { targets: diamondRef, translateX: [0, 60, 0], rotate: ['0turn', '0.5turn', '0turn'], duration: 1200, ease: 'inOutQuad', position: 0 },
  { targets: sqRef, translateX: [0, 60, 0], scale: [1, 1.15, 1], duration: 1200, ease: 'inOutQuad', position: 200 },
];
<AnimeTimeline autoplay={false} entries={entries}>
  {({ controls, state }) => (
    <button onClick={() => controls.restart()}>Play</button>
  )}
</AnimeTimeline>`,
    props: [
      { name: "entries", type: "object[]", default: "-", desc: "Array of animation entries" },
      { name: "entries[].targets", type: "Ref | string", default: "-", desc: "Animation target" },
      { name: "entries[].position", type: "number | string", default: "-", desc: "Position offset or label" },
      { name: "entries[].duration", type: "number", default: "1000", desc: "Step duration in ms" },
      { name: "entries[].ease", type: "string", default: "'inOutQuad'", desc: "Per-entry easing" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Auto-start on mount" },
      { name: "controls.restart", type: "function", default: "-", desc: "Restart timeline" },
      { name: "state.progress", type: "number", default: "-", desc: "Current progress 0→1" },
    ],
  },

  "draggable": {
    component: "useAnimeDraggable",
    summary: "Physics-based drag with snap, spring release, container bounds, and programmatic controls.",
    code: `const {
  ref, isDragging, isGrabbed, position, progress, velocity,
  setX, setY, reset, enable, disable, refresh,
} = useAnimeDraggable({
  container: containerRef.current,
  containerPadding: 16,
  snap: 50,
  releaseStiffness: 120,
  releaseDamping: 20,
  onGrab: () => {},
  onDrag: () => {},
  onRelease: () => {},
  onSnap: () => {},
  onSettle: () => {},
})`,
    props: [
      { name: "container", type: "DraggableBounds", default: "-", desc: "Container element for bounds" },
      { name: "containerPadding", type: "number | number[]", default: "0", desc: "Padding inside container" },
      { name: "containerFriction", type: "number", default: "0.85", desc: "Friction against container bounds (0-1)" },
      { name: "releaseStiffness", type: "number", default: "80", desc: "Spring stiffness on release" },
      { name: "releaseDamping", type: "number", default: "20", desc: "Spring damping on release" },
      { name: "releaseMass", type: "number", default: "1", desc: "Mass for spring physics" },
      { name: "snap", type: "number | DraggableSnap", default: "-", desc: "Snap interval or per-axis config" },
      { name: "trigger", type: "string | HTMLElement", default: "-", desc: "CSS selector for drag handle" },
      { name: "x", type: "DraggableAxisParams | boolean", default: "-", desc: "X-axis config (false to disable)" },
      { name: "y", type: "DraggableAxisParams | boolean", default: "-", desc: "Y-axis config (false to disable)" },
      { name: "dragSpeed", type: "number", default: "1", desc: "Drag movement speed multiplier" },
      { name: "dragThreshold", type: "number", default: "0", desc: "Min px before drag activates" },
      { name: "velocityMultiplier", type: "number", default: "1", desc: "Release velocity multiplier" },
      { name: "releaseEase", type: "Easing", default: "outQuint", desc: "Release animation easing" },
      { name: "cursor", type: "boolean | DraggableCursorParams", default: "true", desc: "Cursor style config" },
    ],
  },

  "on-scroll": {
    component: "useAnimeOnScroll",
    summary: "Scroll-linked animation with progress-derived transforms, dual ref pattern (observer + scroll container), and a scrubbed vertical rolodex demo.",
    code: `const {
  ref, containerRef, controls, state,
  isReady, isInView, progress,
} = useAnimeOnScroll({
  enter: 'bottom top',
  leave: 'top bottom',
})

const p = Math.max(0, Math.min(1, progress))
const t = p * TOTAL // TOTAL = (slides.length - 1) * STEP + DELAY

// Each slide rotates in/out as a rolodex card. First & last slides have
// special-cased branches (no preceding/following card).
function getRotationX(i: number): number {
  const outStart = i * STEP + DELAY
  const outEnd   = outStart + DUR
  const inStart  = (i - 1) * STEP + DELAY
  const inEnd    = inStart + DUR

  if (i === 0) {
    if (t <= outStart) return 0
    if (t >= outEnd) return 90
    return ((t - outStart) / DUR) * 90
  }
  if (t <= inStart) return -90
  if (t <= inEnd) return -90 + ((t - inStart) / DUR) * 90
  if (t <= outStart) return 0
  if (t >= outEnd) return 90
  return ((t - outStart) / DUR) * 90
}

// ref → observed trigger element
// containerRef → inner scroll container
<div ref={containerRef} style={{ overflowY: 'auto' }}>
  <div ref={ref} style={{
    perspective: '800px',
    position: 'sticky', top: 0,
  }}>
    {slides.map((slide, i) => (
      <div key={i} style={{
        transform: \`rotateX(\${getRotationX(i)}deg)\`,
        backfaceVisibility: 'hidden',
      }}>
        {slide.content}
      </div>
    ))}
  </div>
</div>`,
    props: [
      { name: "ref", type: "RefObject<T>", default: "-", desc: "Observed element ref (trigger)" },
      { name: "containerRef", type: "RefObject<T>", default: "-", desc: "Scroll container ref" },
      { name: "controls", type: "object", default: "-", desc: "Imperative animation controls" },
      { name: "state", type: "object", default: "-", desc: "Observer state: progress, scroll, velocity, backward, inView" },
      { name: "isReady", type: "boolean", default: "-", desc: "True when observer is attached" },
      { name: "isInView", type: "boolean", default: "-", desc: "True when trigger is inside viewport" },
      { name: "progress", type: "number", default: "-", desc: "0-1 scroll progress value" },
      { name: "enter", type: "string", default: "-", desc: "Enter boundary (e.g. 'bottom top', 'min 80%')" },
      { name: "leave", type: "string", default: "-", desc: "Leave boundary (e.g. 'top bottom', 'max 20%')" },
      { name: "axis", type: "'x' | 'y'", default: "'y'", desc: "Scroll axis" },
      { name: "linked", type: "ScrollLinkedTarget", default: "-", desc: "Animation/timer/timeline to link" },
      { name: "sync", type: "boolean", default: "-", desc: "Sync animation to scroll" },
      { name: "repeat", type: "boolean", default: "-", desc: "Repeat on re-enter" },
      { name: "debug", type: "boolean", default: "false", desc: "Show debug overlay" },
      { name: "enabled", type: "boolean", default: "true", desc: "Enable/disable observer" },
      { name: "onEnter", type: "(observer) => void", default: "-", desc: "Enter callback (both directions)" },
      { name: "onLeave", type: "(observer) => void", default: "-", desc: "Leave callback (both directions)" },
      { name: "onEnterForward", type: "(observer) => void", default: "-", desc: "Enter callback (forward only)" },
      { name: "onLeaveForward", type: "(observer) => void", default: "-", desc: "Leave callback (forward only)" },
      { name: "onEnterBackward", type: "(observer) => void", default: "-", desc: "Enter callback (backward only)" },
      { name: "onLeaveBackward", type: "(observer) => void", default: "-", desc: "Leave callback (backward only)" },
      { name: "onUpdate", type: "(observer) => void", default: "-", desc: "Progress update callback" },
      { name: "onSyncComplete", type: "(observer) => void", default: "-", desc: "Sync complete callback" },
      { name: "onResize", type: "(observer) => void", default: "-", desc: "Resize callback" },
    ],
  },

  "layout": {
    component: "AnimeLayout",
    summary: "FLIP-based automatic and manual layout animations, supporting dynamic grid transitions, parent-child state propagation, and custom styling updates.",
    code: `const layoutRef = useRef<AnimeLayoutRef>(null);
const [grid, setGrid] = useState(1);

const nextGrid = () => {
  layoutRef.current?.update(() => {
    flushSync(() => {
      setGrid((prev) => (prev % 4) + 1);
    });
  });
}

<AnimeLayout
  ref={layoutRef}
  duration={600}
  ease="outExpo"
  wrapperProps={{ 'data-grid': grid }}
>
  {['A', 'B', 'C', 'D'].map((char) => (
    <AnimeLayoutItem key={char} layoutId={char}>
      Item {char}
    </AnimeLayoutItem>
  ))}
</AnimeLayout>`,
    props: [
      { name: "ref", type: "RefObject<AnimeLayoutRef>", default: "-", desc: "Imperative control ref" },
      { name: "duration", type: "number", default: "500", desc: "FLIP transition duration in ms" },
      { name: "ease", type: "string", default: "outExpo", desc: "Transition easing curve" },
      { name: "wrapperProps", type: "HTMLAttributes", default: "-", desc: "Forwarded container DOM attributes" },
      { name: "ref.current.update", type: "function", default: "-", desc: "Callback to update state synchronously during layout record" },
    ],
  },

  "scope": {
    component: "useAnime",
    summary: "Scoped animation contexts — one useAnime call targets many elements via a selector.",
    code: `// A single useAnime() with a CSS selector scopes the animation to every
// matching element inside the component. \`stagger\` ripples the tween across
// the matched targets. autoplay:false + controls.restart() = click-to-play.
const { controls } = useAnime({
  selector: '.scope-dot',
  scale: [
    { to: 1.5, duration: 200 },
    { to: 1, duration: 300 },
  ],
  stagger: 50,
  autoplay: false,
})

// Trigger re-runs the same scoped tween against all dots.
<button onClick={() => controls.restart()}>Trigger</button>`,
    props: [
      { name: "selector", type: "string", default: "-", desc: "CSS selector scoping the animation to multiple elements" },
      { name: "scale", type: "object[]", default: "-", desc: "Keyframes with per-segment { to, duration }" },
      { name: "stagger", type: "number", default: "0", desc: "Delay ripple between matched targets" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Start on mount (false = trigger via controls)" },
      { name: "controls.restart", type: "function", default: "-", desc: "Re-run the scoped animation" },
    ],
  },

  "split-text": {
    component: "SplitText",
    summary: "Declarative text splitting into chars/words/lines, animated via SplitTextEntry inside an AnimeTimeline.",
    code: `// Declarative SplitText + SplitTextEntry + AnimeTimeline. The animation is
// bound to the split elements themselves, so it reliably targets characters.
const timelineRef = useRef<AnimeTimelineRef>(null);
const splitRef = useRef<SplitTextRef>(null);

<AnimeTimeline ref={timelineRef} autoplay={false} defaults={{ ease: 'outBack', duration: 600 }}>
  <SplitText ref={splitRef} params={{ lines: true, words: true, chars: true }}>
    <p>SplitText</p>
  </SplitText>

  <SplitTextEntry
    splitRef={splitRef}
    splitMode="chars"
    opacity={[0, 1]}
    translateY={[40, 0]}
    scale={[0.8, 1]}
    stagger={40}
  />
</AnimeTimeline>

// Re-trigger: timelineRef.current?.controls.restart()`,
    props: [
      { name: "params", type: "object", default: "-", desc: "What to split: { lines, words, chars }" },
      { name: "splitMode", type: "'chars'|'words'|'lines'", default: "-", desc: "Which split units SplitTextEntry animates" },
      { name: "translateY", type: "number[]", default: "[40, 0]", desc: "Per-unit rise" },
      { name: "scale", type: "number[]", default: "[0.8, 1]", desc: "Per-unit scale" },
      { name: "stagger", type: "number", default: "40", desc: "Delay ripple between units" },
      { name: "defaults.ease", type: "string", default: "'outBack'", desc: "Timeline-wide easing" },
      { name: "autoplay", type: "boolean", default: "false", desc: "false = trigger via controls.restart()" },
    ],
  },

  "toggle-switch": {
    component: "Anime",
    summary: "Springy toggle: track color cross-fade, thumb slide + squash, and a ripple on every flip.",
    code: `// travel = track width - height, so the thumb hugs both edges symmetrically.
const travel = dims.width - dims.height;

{/* Thumb — slides with a springy settle (outBack) + subtle squash */}
<Anime autoplay duration={360} ease="outBack"
  translateX={isChecked ? travel : 0}
  scaleX={[1, 1.12, 1]}
>
  <div className="thumb" />
</Anime>

{/* Track — color cross-fade */}
<Anime autoplay duration={280} ease="outQuad"
  backgroundColor={isChecked ? 'var(--landing-accent)' : 'var(--landing-surface)'}
>
  <div className="track" />
</Anime>

{/* Ripple — remounted (key) on each toggle so it replays */}
<Anime key={rippleId} autoplay duration={420} ease="outQuad"
  scale={[0.4, 1.6]} opacity={[0.5, 0]}
>
  <div className="ripple" />
</Anime>`,
    props: [
      { name: "translateX", type: "number", default: "-", desc: "Thumb travel (track width − height)" },
      { name: "scaleX", type: "number[]", default: "[1, 1.12, 1]", desc: "Thumb squash on slide" },
      { name: "backgroundColor", type: "string", default: "-", desc: "Track color by state" },
      { name: "ease", type: "string", default: "'outBack'", desc: "Springy settle for the thumb" },
      { name: "autoplay", type: "boolean", default: "true", desc: "Plays on every state change" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disable interaction" },
      { name: "size", type: "'sm'|'md'|'lg'", default: "'md'", desc: "Switch size" },
    ],
  },

  "counter-countdown": {
    component: "useAnime",
    summary: "Number tween (counter) and a duration-based countdown, both via useAnime object targets.",
    code: `// The animated value lives on a stable plain object; anime.js mutates it
// in place each frame and we write it to the DOM in onUpdate.
const target = useMemo(() => ({ val: from }), [from]);

// Counter: tween val from current → \`to\`, round to integers.
const { controls } = useAnime({
  targets: target,
  val: to,
  duration,        // counter: 2500; countdown: from * 1000
  round: 1,
  ease: 'outExpo', // counter; countdown uses 'linear'
  loop,            // counter loops; countdown does not
  autoplay,
  onUpdate: () => writeValue(target.val),
});`,
    props: [
      { name: "targets", type: "object", default: "-", desc: "Plain object holding the tweened value ({ val })" },
      { name: "val", type: "number", default: "-", desc: "Target value to tween to" },
      { name: "round", type: "number", default: "1", desc: "Round to whole numbers each frame" },
      { name: "duration", type: "number", default: "-", desc: "Counter ms; countdown = from × 1000" },
      { name: "ease", type: "string", default: "'outExpo'", desc: "outExpo (counter) | linear (countdown)" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop (counter) or run once (countdown)" },
      { name: "format", type: "'seconds'|'mm:ss'|'padded'", default: "-", desc: "Display format" },
      { name: "size", type: "'sm'|'md'|'lg'", default: "'md'", desc: "Font size" },
    ],
  },

  "spinning-cube": {
    component: "Anime",
    summary: "3D cube with dual-axis rotation via turn/deg values and controls.",
    code: `<Anime
  autoplay={autoplay}
  duration={4000}
  loop
  ease="inOutQuad"
  rotateX={axis === 'y' ? '-20deg' : '1turn'}
  rotateY={axis === 'x' ? '-30deg' : '1turn'}
  onControlsReady={handleControlsReady}
>
  <div style={{ transformStyle: 'preserve-3d' }}>{faces}</div>
</Anime>`,
    props: [
      { name: "rotateY", type: "string | number", default: "'1turn'", desc: "Y rotation (turn/deg units; '-30deg' when axis='x')" },
      { name: "rotateX", type: "string | number", default: "'1turn'", desc: "X rotation (turn/deg units; '-20deg' when axis='y')" },
      { name: "ease", type: "string", default: "'inOutQuad'", desc: "Easing (not linear)" },
      { name: "loop", type: "boolean", default: "true", desc: "Loop the rotation" },
      { name: "duration", type: "number", default: "3000", desc: "Duration in ms" },
      { name: "axis", type: "'x'|'y'|'both'", default: "'both'", desc: "Rotation axis" },
      { name: "onControlsReady", type: "function", default: "-", desc: "Receives playback controls for pause/resume/reverse" },
    ],
  },

  "clippath-reveal": {
    component: "Anime",
    summary: "clipPath wipe reveal — circle, diamond, star, or inset — with loop/alternate.",
    code: `// 150% reliably covers corners on wide boxes (75% leaves gaps).
// The shape's from/to are derived from the \`shape\` prop.
<Anime
  autoplay
  loop
  alternate
  duration={1800}
  ease="outExpo"
  clipPath={['circle(0% at 50% 50%)', 'circle(150% at 50% 50%)']}
>
  <div className="reveal-panel">{children}</div>
</Anime>`,
    props: [
      { name: "clipPath", type: "string[]", default: "-", desc: "From/to clip paths derived from shape" },
      { name: "shape", type: "'circle'|'diamond'|'horizontal'|'vertical'|'star'", default: "'circle'", desc: "Reveal shape" },
      { name: "duration", type: "number", default: "1200", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "'outCubic'", desc: "Easing (preview uses outExpo)" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop the wipe" },
      { name: "alternate", type: "boolean", default: "false", desc: "Reverse each iteration" },
      { name: "onComplete", type: "function", default: "-", desc: "Fires when the reveal finishes" },
    ],
  },

  "animated-slider": {
    component: "AnimePresence",
    summary: "Carousel with crossfading slide transitions (slide, fade, scale, fade-slide, flip).",
    code: `// Each slide mounts/unmounts as \`current\` changes; AnimePresence animates
// the enter/exit. Directions swap based on nav direction (prev vs next).
const TRANSITIONS = {
  slide: {
    enter: { opacity: [0, 1], translateX: [80, 0] },
    exit:  { opacity: [1, 0], translateX: [0, -80] },
  },
  // fade, scale, fade-slide, flip follow the same enter/exit shape.
};

<AnimePresence mode="sync">
  <AnimePresenceChild
    key={current}
    enter={enter}
    exit={exit}
    duration={450}
    ease="outExpo"
  >
    <div>{children(items[current], current)}</div>
  </AnimePresenceChild>
</AnimePresence>`,
    props: [
      { name: "transition", type: "'slide'|'fade'|'scale'|'fade-slide'|'flip'", default: "'slide'", desc: "Enter/exit preset" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Enter keyframes (direction-aware)" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Exit keyframes (direction-aware)" },
      { name: "duration", type: "number", default: "500", desc: "Transition ms" },
      { name: "ease", type: "string", default: "'outCubic'", desc: "Easing (preview uses outExpo)" },
      { name: "loop", type: "boolean", default: "true", desc: "Wrap around at edges" },
      { name: "dots", type: "boolean", default: "true", desc: "Show nav dots" },
      { name: "arrows", type: "boolean", default: "true", desc: "Show prev/next arrows" },
    ],
  },

  "reorder-list": {
    component: "AnimeLayout",
    summary: "FLIP-based reorder/shuffle — auto mode animates items as their order changes.",
    code: `<AnimeLayout
  mode="auto"
  duration={450}
  ease="outExpo"
  enterFrom={{ opacity: 0, transform: 'scale(0.9)' }}
  leaveTo={{ opacity: 0, transform: 'scale(0.9)' }}
  style={{ gap }}
>
  {items.map((item) => (
    <AnimeLayoutItem key={getKey(item)} layoutId={getKey(item)} className="w-full">
      {children(item)}
    </AnimeLayoutItem>
  ))}
</AnimeLayout>`,
    props: [
      { name: "mode", type: "'auto'|'manual'", default: "'auto'", desc: "auto = animate on children change" },
      { name: "duration", type: "number", default: "500", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "'outExpo'", desc: "Easing function" },
      { name: "layoutId", type: "string", default: "-", desc: "Stable id tracking each item across reorders" },
      { name: "enterFrom", type: "CSSProperties", default: "{opacity:0}", desc: "Initial state for entering items" },
      { name: "leaveTo", type: "CSSProperties", default: "{opacity:0}", desc: "Final state for leaving items" },
      { name: "gap", type: "number", default: "8", desc: "Gap between items in px" },
    ],
  },

  "scroll-linked-animations": {
    component: "useAnimeOnScroll",
    summary: "Scroll-driven parallax — layer translate/opacity derived from scroll progress.",
    code: `// No linked animation or callbacks here: progress is read each scroll
// tick and mapped to per-layer transforms manually.
const { ref, containerRef, isInView, progress } = useAnimeOnScroll({
  enter: 'bottom top',
  leave: 'top bottom',
});

const p = Math.max(0, Math.min(1, progress));
const ty = p * layer.depth * -56; // depth drives parallax rate

<div ref={containerRef} style={{ overflowY: 'auto' }}>
  <div ref={ref}>
    {layers.map((layer) => (
      <div style={{ transform: \`translateY(\${p * layer.depth * -56}px)\` }}>
        {layer.label}
      </div>
    ))}
  </div>
</div>`,
    props: [
      { name: "enter", type: "string", default: "-", desc: "Enter boundary (e.g. 'bottom top')" },
      { name: "leave", type: "string", default: "-", desc: "Leave boundary (e.g. 'top bottom')" },
      { name: "ref", type: "RefObject<T>", default: "-", desc: "Observed trigger element" },
      { name: "containerRef", type: "RefObject<T>", default: "-", desc: "Inner scroll container" },
      { name: "progress", type: "number", default: "-", desc: "Clamped 0-1 scroll progress" },
      { name: "isInView", type: "boolean", default: "-", desc: "True when trigger is in viewport" },
      { name: "linked", type: "ScrollLinkedTarget", default: "-", desc: "Optional: animation to scrub (not used in this demo)" },
    ],
  },

  "scramble-text": {
    component: "useAnimeScramble",
    summary: "Decoding character scramble with a custom charset and optional cursor.",
    code: `// Takes a target ref + a nested params object; returns { rescramble, isReady }.
// No loop: each call decodes once. Call rescramble() to re-run (e.g. on shuffle).
const { rescramble, isReady } = useAnimeScramble({
  target: targetRef,
  params: {
    text: 'Hello World',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\\\/[]{}—=+*^?#',
    cursor: true,
  },
  autoplay: true,
});

<p ref={targetRef}>{text}</p>`,
    props: [
      { name: "target", type: "RefObject<T>", default: "-", desc: "Element ref to scramble (input)" },
      { name: "params.text", type: "string", default: "-", desc: "Final text to decode into" },
      { name: "params.chars", type: "string", default: "-", desc: "Scramble character set" },
      { name: "params.cursor", type: "boolean", default: "false", desc: "Show a blinking cursor" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Auto-start on mount" },
      { name: "rescramble", type: "function", default: "-", desc: "Re-trigger the decode (returned)" },
      { name: "isReady", type: "boolean", default: "-", desc: "True once the hook is initialized (returned)" },
    ],
  },

  tooltip: {
    component: "AnimePresence",
    summary: "Hover-triggered tooltip with three animation variants: Fade, Slide, and Bounce.",
    code: `const [open, setOpen] = useState(false)

// Three variants — pick one by changing enter/exit keyframes + duration:
// Fade:    { opacity: [0, 1] }                       400ms  outExpo
// Slide:   { opacity: [0, 1], translateX: [-16, 0] }  450ms outQuart
// Bounce:  { opacity: [0, 1], scale: [0.6, 1],
//            translateY: [10, 0] }                     600ms outBack

<div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
  <AnimePresence mode="sync" initial={false}>
    {open && (
      <AnimePresenceChild
        key="tip"
        enter={{ opacity: [0, 1], scale: [0.6, 1], translateY: [10, 0] }}
        exit={{ opacity: [1, 0], scale: [1, 0.6], translateY: [0, 10] }}
        duration={600}
        ease="outBack"
      >
        <span className="tooltip">Bounces in</span>
      </AnimePresenceChild>
    )}
  </AnimePresence>
  <button>Hover me</button>
</div>`,
    props: [
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Enter keyframes — opacity, translateX, scale, translateY" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Exit keyframes (mirror of enter)" },
      { name: "mode", type: "'sync'|'wait'|'popLayout'", default: "'sync'", desc: "Enter/exit sequencing" },
      { name: "duration", type: "number", default: "400-600", desc: "Enter/exit ms (400 fade, 450 slide, 600 bounce)" },
      { name: "ease", type: "string", default: "'outExpo'|'outQuart'|'outBack'", desc: "Per-variant easing" },
    ],
  },

  "dropdown-menu": {
    component: "AnimePresence",
    summary: "Button-triggered menu — the container scales/fades in, items cascade via per-item delay.",
    code: `// The whole menu mounts/unmounts on open; AnimePresenceChild animates the
// container (scale + fade). Each item <Anime> cascades via delay = index * 40.
<AnimePresence mode="sync">
  {open && (
    <AnimePresenceChild
      key="dropdown"
      enter={{ opacity: [0, 1], scale: [0.95, 1] }}
      exit={{ opacity: [1, 0], scale: [1, 0.95] }}
      duration={200}
      ease="outExpo"
    >
      <div className="menu">
        {items.map((item, index) => (
          <Anime
            key={item}
            opacity={[0, 1]}
            translateY={[-6, 0]}
            delay={index * 40}   // per-item cascade (not stagger)
            duration={200}
            ease="outQuad"
            autoplay
          >
            <button className="menu-item">{item}</button>
          </Anime>
        ))}
      </div>
    </AnimePresenceChild>
  )}
</AnimePresence>`,
    props: [
      { name: "mode", type: "'sync'|'wait'|'popLayout'", default: "'sync'", desc: "Container enter/exit sequencing" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Container scale + fade in" },
      { name: "delay", type: "number", default: "0", desc: "Per-item delay (index * N) for the cascade" },
      { name: "translateY", type: "number[]", default: "[-6, 0]", desc: "Item slide-in" },
      { name: "opacity", type: "number[]", default: "[0, 1]", desc: "Item fade" },
      { name: "duration", type: "number", default: "200", desc: "Per-item ms" },
    ],
  },

  accordion: {
    component: "AnimeLayout",
    summary: "Expand/collapse panels with height animation and single/multi open modes.",
    code: `// <AnimeLayout> FLIP-animates the panel height. On toggle, update()
// commits the new state (via flushSync), measures the before/after height
// delta, and tweens it — no manual measurement or raw animate().
const AccordionItem = ({ title, body, isOpen, onToggle }) => {
  const layoutRef = useRef(null)

  const handleToggle = () => {
    layoutRef.current?.update(
      () => flushSync(() => onToggle()),
      { duration: 320, ease: 'outExpo' },
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <button onClick={handleToggle} aria-expanded={isOpen}>{title} ▼</button>
      <AnimeLayout
        ref={layoutRef}
        mode="manual"
        duration={500}
        ease="outExpo"
        enterFrom={{ opacity: 0 }}
        leaveTo={{ opacity: 0 }}
      >
        {isOpen && (
          <AnimeLayout.Item key="panel" layoutId="panel">
            {body}
          </AnimeLayout.Item>
        )}
      </AnimeLayout>
    </div>
  )
}`,
    props: [
      { name: "mode", type: "'manual'|'auto'", default: "'manual'", desc: "manual = call update() to trigger FLIP; auto = animate on children change" },
      { name: "update", type: "(cb, params) => Timeline", default: "-", desc: "Records layout, runs cb (flushSync), animates the delta" },
      { name: "enterFrom", type: "CSSProperties", default: "{opacity:0}", desc: "Initial state for entering content" },
      { name: "leaveTo", type: "CSSProperties", default: "{opacity:0}", desc: "Final state for leaving content" },
      { name: "duration", type: "number", default: "500", desc: "Layout transition ms (update override uses 320)" },
    ],
  },

  "accordion-presence": {
    component: "AnimePresence",
    summary:
      "Mount/unmount accordion panels with smooth height + opacity animation via AnimePresence.",
    code: `// The open panel mounts/unmounts as isOpen flips. Pass height: 'auto' —
// AnimePresenceChild measures the real content height internally and animates
// to it, then releases to 'auto' on completion. No manual measurement needed.
const AccordionItem = ({ title, body, isOpen, onToggle }) => (
  <div className="overflow-hidden rounded-lg border">
    <button onClick={onToggle} aria-expanded={isOpen}>{title} ▼</button>
    <AnimePresence mode="sync" initial={false}>
      {isOpen && (
        <AnimePresenceChild
          key="panel"
          enter={{ height: [0, 'auto'], opacity: [0, 1] }}
          exit={{ height: ['auto', 0], opacity: [1, 0] }}
          duration={320}
          ease="outExpo"
        >
          <div className="overflow-hidden">{body}</div>
        </AnimePresenceChild>
      )}
    </AnimePresence>
  </div>
)`,
    props: [
      { name: "mode", type: "'sync'|'wait'|'popLayout'", default: "'sync'", desc: "sync = parallel enter/exit when switching items" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Enter keyframes — height:'auto' is measured internally" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Exit keyframes — mirror of enter" },
      { name: "duration", type: "number", default: "320", desc: "Enter/exit ms" },
      { name: "ease", type: "string", default: "'outExpo'", desc: "Decelerating curve" },
    ],
  },

  toast: {
    component: "AnimePresence",
    summary: "Stacked notifications with enter/exit animations and auto-dismiss.",
    code: `<AnimePresence mode="popLayout">
  {toasts.map((t) => (
    <AnimePresenceChild
      key={t.id}
      enter={{ opacity: [0, 1], translateX: [40, 0], scale: [0.9, 1] }}
      exit={{ opacity: [1, 0], translateX: [0, 40], scale: [1, 0.9] }}
      duration={300}
      ease="outExpo"
    >
      <Toast onDismiss={() => dismiss(t.id)}>{t.msg}</Toast>
    </AnimePresenceChild>
  ))}
</AnimePresence>`,
    props: [
      { name: "mode", type: "'sync'|'wait'|'popLayout'", default: "'popLayout'", desc: "Exit sequencing" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Enter keyframes per child" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Exit keyframes per child" },
      { name: "duration", type: "number", default: "300", desc: "Enter/exit ms" },
      { name: "ease", type: "string", default: "'outExpo'", desc: "Easing curve" },
    ],
  },

  tabs: {
    component: "AnimePresence",
    summary: "Animated underline indicator with cross-fading content panels.",
    code: `// Measure the active tab's offset + width so the underline hugs each
// label exactly (no fixed-width box, no hardcoded offset math).
const [indicator, setIndicator] = useState({ x: 0, w: 0 });

useLayoutEffect(() => {
  const el = tabRefs.current[active];
  if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
}, [active]);

// <Anime> slides AND resizes the underline to the active tab.
// \`autoplay\` is required: hooks default to autoplay={false}, so deps
// alone would recreate the tween without ever playing it.
<Anime
  translateX={indicator.x}
  width={indicator.w}
  duration={300}
  ease="outExpo"
  autoplay
  deps={[indicator.x, indicator.w]}
>
  <span className="underline" />
</Anime>

// Active panel mounts/unmounts as \`active\` changes. <AnimePresence>
// drives the cross-fade; mode="wait" gives a clean out-then-in swap.
<AnimePresence mode="wait" initial={false}>
  <AnimePresenceChild
    key={panels[active].label}
    enter={{ opacity: [0, 1], translateY: [6, 0] }}
    exit={{ opacity: [1, 0], translateY: [0, -6] }}
    duration={220}
    ease="outQuad"
  >
    <div className="panel">{panels[active].body}</div>
  </AnimePresenceChild>
</AnimePresence>`,
    props: [
      { name: "translateX", type: "number", default: "-", desc: "Indicator slide to active tab offset" },
      { name: "width", type: "number", default: "-", desc: "Indicator width matching active tab" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Plays the (re)created tween — required with deps" },
      { name: "deps", type: "unknown[]", default: "[]", desc: "Re-runs the animation when values change" },
      { name: "mode", type: "'wait'", default: "'wait'", desc: "Exit completes before next panel enters" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Panel enter keyframes" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Panel exit keyframes" },
      { name: "duration", type: "number", default: "220", desc: "Transition ms" },
    ],
  },
} satisfies Record<DemoId, DemoDetail>;
