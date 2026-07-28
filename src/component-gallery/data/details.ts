import type { DemoDetail } from "../types";
import type { DemoId } from './sections';

export const demoDetails = {
  "basic-animation": {
    component: "useAnime",
    summary: "Animate targets with CSS selectors, stagger, easing, and callbacks.",
    code: `useAnime({
  selector: '.box',
  translateX: [{ to: 120, duration: 600 }, { to: 0, duration: 400 }],
  scale: [{ to: 1.2, duration: 300 }, { to: 1, duration: 300 }],
  stagger: 80,
  ease: 'inOutQuad',
})`,
    props: [
      { name: "selector", type: "string", default: "-", desc: "CSS selector to target" },
      { name: "translateX", type: "number[]", default: "-", desc: "Horizontal translation keyframes" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between targets" },
      { name: "ease", type: "string", default: "linear", desc: "Easing function" },
      { name: "duration", type: "number", default: "1000", desc: "Animation duration in ms" },
    ],
  },

  "svg-morph": {
    component: "AnimeMorph",
    summary: "Morph between different SVG path shapes smoothly.",
    code: `<AnimeMorph target={targetRef} duration={2000} alternate loop autoplay>
  <polygon points={shapeA} />
</AnimeMorph>`,
    props: [
      { name: "target", type: "RefObject", default: "-", desc: "Target polygon/path ref" },
      { name: "duration", type: "number", default: "1000", desc: "Morph duration in ms" },
      { name: "ease", type: "string", default: "linear", desc: "Easing function" },
    ],
  },
  "svg-draw": {
    component: "AnimeDraw",
    summary: "Animate SVG path drawing with stroke-dashoffset.",
    code: `<AnimeDraw draw={['0 0', '0 1', '1 1']} duration={2000} loop autoplay>
  <path d={svgPath} stroke="currentColor" strokeWidth={2} />
</AnimeDraw>`,
    props: [
      { name: "draw", type: "string[]", default: "-", desc: "Draw range keyframes" },
      { name: "duration", type: "number", default: "1000", desc: "Draw duration in ms" },
      { name: "strokeWidth", type: "number", default: "2", desc: "Stroke width" },
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
  direction: 'alternate',
  frameRate: 60,
  onComplete: () => {},
  onUpdate: ({ progress, currentTime }) => {},
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
      { name: "state.progress", type: "number", default: "-", desc: "Current progress 0→1" },
    ],
  },

  "timeline": {
    component: "AnimeTimeline",
    summary: "Sequenced timeline animations with sync, labels, and imperative methods.",
    code: `const entries = [
  { targets: circleRef, translateX: [0, 100], duration: 800, position: 0 },
  { targets: diamondRef, translateX: [0, 100], rotate: ['0turn', '1turn'], position: 0 },
  { targets: sqRef, translateX: [0, 100], position: 400 },
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

function getRotationX(i: number): number {
  const outStart = i * STEP + DELAY
  const outEnd   = outStart + DUR
  const inStart  = (i - 1) * STEP + DELAY
  const inEnd    = inStart + DUR

  if (t >= outStart && t < outEnd) {
    const s = (t - outStart) / DUR; return -s * 90
  }
  if (t >= outEnd && t < inStart) { return -90 }
  if (t >= inStart && t < inEnd) {
    const s = (t - inStart) / DUR; return 90 - s * 90
  }
  return 0
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
} satisfies Record<DemoId, DemoDetail>;

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
    component: "useAnimeScope",
    summary: "Animation scopes with media queries, methods, and keepTime support.",
    code: `const { scope, scopeRef } = useAnimeScope({
  rootRef,
  defaults: { duration: 400 },
  mediaQueries: { '(min-width: 768px)': { duration: 800 } },
  onScopeReady: (scope) => {},
})`,
    props: [
      { name: "rootRef", type: "RefObject", default: "-", desc: "Scope root element ref" },
      { name: "defaults", type: "object", default: "-", desc: "Default animation parameters" },
      { name: "mediaQueries", type: "Record<string, object>", default: "-", desc: "Media query overrides" },
      { name: "keepTime", type: "boolean", default: "false", desc: "Preserve timing across re-renders" },
      { name: "scope.revert", type: "function", default: "-", desc: "Revert all scoped animations" },
      { name: "scope.refresh", type: "function", default: "-", desc: "Refresh scope state" },
      { name: "scope.add", type: "function", default: "-", desc: "Add scoped animation" },
    ],
  },

  "split-text": {
    component: "useSplitText",
    summary: "Text splitting into chars, words, lines with CJK support and effects.",
    code: `const { ref } = useSplitText({
  type: 'chars,words,lines',
  tag: 'span',
  aria: true,
  onSetup: ({ chars, words }) => {
    animate(chars, { translateY: [20, 0], opacity: [0, 1], stagger: 30 })
  },
})`,
    props: [
      { name: "type", type: "string", default: "chars", desc: "Split type: chars, words, lines" },
      { name: "tag", type: "string", default: "span", desc: "Wrapper element tag" },
      { name: "aria", type: "boolean", default: "false", desc: "Add accessibility attributes" },
      { name: "letterSpacing", type: "number", default: "0", desc: "Letter spacing adjustment" },
      { name: "splitLength", type: "string", default: "-", desc: "Custom split pattern" },
      { name: "onSetup", type: "(result) => void", default: "-", desc: "Setup callback with split elements" },
    ],
  },

  "toggle-switch": {
    component: "useAnime",
    summary: "Animated toggle switch with styled and disabled states.",
    code: `const { controls } = useAnime({
  selector: '.thumb',
  translateX: checked ? 20 : 0,
  backgroundColor: checked ? '#10b981' : '#374151',
  duration: 300,
  ease: 'outQuad',
  autoplay: false,
})`,
    props: [
      { name: "translateX", type: "number", default: "-", desc: "Thumb position" },
      { name: "backgroundColor", type: "string", default: "-", desc: "Track background color" },
      { name: "duration", type: "number", default: "300", desc: "Animation duration in ms" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disable interaction" },
    ],
  },

  "counter-countdown": {
    component: "useAnimeTimer",
    summary: "Animated counter and countdown with padding and format options.",
    code: `const { state } = useAnimeTimer({
  duration: 2000,
  onUpdate: ({ progress }) => {
    setValue(Math.round(from + (to - from) * progress));
  },
})`,
    props: [
      { name: "from", type: "number", default: "0", desc: "Start value" },
      { name: "to", type: "number", default: "-", desc: "End value" },
      { name: "duration", type: "number", default: "1000", desc: "Duration in ms" },
      { name: "format", type: "string", default: "-", desc: "Display format (padded, mm:ss)" },
    ],
  },

  "spinning-cube": {
    component: "useAnime",
    summary: "3D cube rotation with speed variants and interactive controls.",
    code: `useAnime({
  rotateY: 360,
  rotateX: 15,
  loop: true,
  duration: 4000,
  ease: 'linear',
})`,
    props: [
      { name: "rotateY", type: "number", default: "-", desc: "Y rotation degrees" },
      { name: "rotateX", type: "number", default: "-", desc: "X rotation degrees" },
      { name: "loop", type: "boolean", default: "true", desc: "Enable looping" },
      { name: "duration", type: "number", default: "4000", desc: "Duration in ms" },
    ],
  },

  "clippath-reveal": {
    component: "useAnime",
    summary: "Circle, diamond, star, and wipe clipPath reveal animations.",
    code: `useAnime({
  clipPath: ['circle(0%)', 'circle(70%)'],
  duration: 800,
  ease: 'outExpo',
})`,
    props: [
      { name: "clipPath", type: "string[]", default: "-", desc: "Clip path keyframes" },
      { name: "duration", type: "number", default: "800", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "outExpo", desc: "Easing function" },
    ],
  },

  "animated-slider": {
    component: "useAnime",
    summary: "Slide, fade, scale, flip transitions with visual slide showcase.",
    code: `useAnime({
  translateX: \`-\${current * 100}%\`,
  opacity: [0, 1],
  scale: [0.9, 1],
  duration: 500,
  ease: 'outExpo',
})`,
    props: [
      { name: "translateX", type: "string", default: "-", desc: "Slide offset" },
      { name: "opacity", type: "number[]", default: "-", desc: "Opacity keyframes" },
      { name: "scale", type: "number[]", default: "-", desc: "Scale keyframes" },
      { name: "rotateY", type: "number[]", default: "-", desc: "Flip rotation keyframes" },
      { name: "perspective", type: "number", default: "500", desc: "3D perspective" },
      { name: "duration", type: "number", default: "500", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "outExpo", desc: "Easing function" },
    ],
  },

  "reorder-list": {
    component: "AnimeLayout + AnimePresence",
    summary: "FLIP-based shuffle, move, add/remove, and grid reorder animations.",
    code: `<AnimePresence mode="popLayout">
  <AnimeLayout mode="auto" duration={400} ease="outExpo">
    {items.map(id => (
      <AnimeLayoutItem key={id}>...</AnimeLayoutItem>
    ))}
  </AnimeLayout>
</AnimePresence>`,
    props: [
      { name: "mode", type: "string", default: "auto", desc: "Layout mode" },
      { name: "duration", type: "number", default: "500", desc: "Duration in ms" },
      { name: "ease", type: "string", default: "outExpo", desc: "Easing function" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay" },
    ],
  },

  "scroll-linked-animations": {
    component: "useAnimeOnScroll",
    summary: "Parallax depth, reveal columns, conveyor, morph tile, and wave bar.",
    code: `useAnimeOnScroll({
  enter: 'min 80%',
  leave: 'max 20%',
  linked: animationRef.current,
  onEnter: (observer) => {},
  onUpdate: (observer) => {},
})`,
    props: [
      { name: "enter", type: "string", default: "-", desc: "Enter boundary condition" },
      { name: "leave", type: "string", default: "-", desc: "Leave boundary condition" },
      { name: "linked", type: "ScrollLinkedTarget", default: "-", desc: "Animation to link" },
      { name: "sync", type: "boolean", default: "-", desc: "Sync to scroll" },
      { name: "axis", type: "'x' | 'y'", default: "'y'", desc: "Scroll axis" },
    ],
  },

  "scramble-text": {
    component: "useAnimeScramble",
    summary: "Text scramble animation with autoplay, loop, and custom chars.",
    code: `const { ref, controls } = useAnimeScramble({
  text: 'Hello World',
  autoplay: true,
  loop: true,
  reversed: false,
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
})`,
    props: [
      { name: "text", type: "string", default: "-", desc: "Text to scramble" },
      { name: "chars", type: "string", default: "-", desc: "Custom character set" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Auto-start" },
      { name: "loop", type: "boolean", default: "false", desc: "Enable looping" },
      { name: "reversed", type: "boolean", default: "false", desc: "Reverse direction" },
      { name: "duration", type: "number", default: "1000", desc: "Duration in ms" },
    ],
  },

  tooltip: {
    component: "Anime",
    summary: "Hover or focus trigger with spring enter/exit and smart placement.",
    code: `const [open, setOpen] = useState(false)

<Anime
  opacity={open ? [0, 1] : [1, 0]}
  translateY={open ? [6, 0] : [0, 6]}
  scale={open ? [0.9, 1] : [1, 0.9]}
  duration={220}
  ease="outBack"
  deps={[open]}
>
  <span className="tooltip-pop">Tooltip text</span>
</Anime>`,
    props: [
      { name: "opacity", type: "number[]", default: "[0, 1]", desc: "Fade keyframes" },
      { name: "translateY", type: "number[]", default: "[6, 0]", desc: "Slide-in offset" },
      { name: "scale", type: "number[]", default: "[0.9, 1]", desc: "Pop scale" },
      { name: "duration", type: "number", default: "220", desc: "Enter/exit ms" },
      { name: "ease", type: "string", default: "outBack", desc: "Spring-like easing" },
    ],
  },

  "dropdown-menu": {
    component: "Anime",
    summary: "Button-triggered menu with staggered item entrance and click-outside dismiss.",
    code: `{items.map((item) => (
  <Anime
    key={item}
    opacity={open ? [0, 1] : [1, 0]}
    translateY={open ? [-8, 0] : [0, -8]}
    stagger={40}
    duration={200}
    ease="outQuad"
    deps={[open]}
  >
    <button className="menu-item">{item}</button>
  </Anime>
))}`,
    props: [
      { name: "stagger", type: "number", default: "40", desc: "Per-item delay cascade" },
      { name: "translateY", type: "number[]", default: "[-8, 0]", desc: "Item slide-in" },
      { name: "opacity", type: "number[]", default: "[0, 1]", desc: "Item fade" },
      { name: "duration", type: "number", default: "200", desc: "Per-item ms" },
      { name: "ease", type: "string", default: "outQuad", desc: "Item easing" },
    ],
  },

  accordion: {
    component: "animate",
    summary: "Expand/collapse panels with height animation and single/multi open modes.",
    code: `// Smooth height animation via animate() from react-animejs.
// anime.js can't interpolate height:'auto', so measure scrollHeight and
// tween to that number. useLayoutEffect runs before paint: freeze the
// current height, then animate — no flash, parallel item switching.
const AccordionItem = ({ title, body, isOpen, onToggle }) => {
  const contentRef = useRef(null)
  const panelRef = useRef(null)
  const isFirstRun = useRef(true)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const content = contentRef.current
    if (!panel || !content) return

    if (isFirstRun.current) {
      isFirstRun.current = false
      panel.style.height = isOpen ? 'auto' : '0px'
      return
    }

    // 1. Freeze at current rendered height (real start value for the tween).
    const currentHeight = panel.getBoundingClientRect().height
    panel.style.height = currentHeight + 'px'

    // 2. Tween to target (scrollHeight when opening, 0 when closing).
    animate(panel, {
      height: isOpen ? content.scrollHeight : 0,
      opacity: isOpen ? 1 : 0,
      duration: 320,
      ease: 'outExpo',
      // 3. Release inline height after opening so layout stays fluid.
      onComplete: () => { if (isOpen) panel.style.height = 'auto' },
    })
  }, [isOpen])

  return (
    <div className="overflow-hidden rounded-lg border">
      <button onClick={onToggle} aria-expanded={isOpen}>{title} ▼</button>
      <div ref={panelRef} style={{ height: 0 }} className="overflow-hidden">
        <div ref={contentRef}>{body}</div>
      </div>
    </div>
  )
}`,
    props: [
      { name: "targets", type: "HTMLElement", default: "panelRef.current", desc: "Panel wrapper element to animate" },
      { name: "height", type: "number", default: "0 / scrollHeight", desc: "Animate between 0 and measured content height" },
      { name: "opacity", type: "number", default: "0 / 1", desc: "Content fade in/out" },
      { name: "duration", type: "number", default: "320", desc: "Expand/collapse ms" },
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
    code: `// Sliding underline — <Anime> tweens the indicator on each tab change.
<Anime
  translateX={active * TAB_WIDTH}
  duration={300}
  ease="outExpo"
  deps={[active]}
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
      { name: "translateX", type: "number", default: "-", desc: "Indicator slide (via <Anime>)" },
      { name: "mode", type: "'wait'", default: "'wait'", desc: "Exit completes before next panel enters" },
      { name: "enter", type: "UseAnimeOptions", default: "-", desc: "Panel enter keyframes" },
      { name: "exit", type: "UseAnimeOptions", default: "-", desc: "Panel exit keyframes" },
      { name: "duration", type: "number", default: "220", desc: "Transition ms" },
    ],
  },
} satisfies Record<DemoId, DemoDetail>;
