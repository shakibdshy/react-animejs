import type { DemoDetail, DemoSection } from "./types";

export const demoSections: DemoSection[] = [
  {
    title: "Core Features",
    path: "/demo/core-features",
    description:
      "CSS selectors, JS objects, array targets, v4 features, call functions",
    category: "core",
  },
  {
    title: "SVG Utilities",
    path: "/demo/svg",
    description: "Advanced SVG animation utilities and helpers",
    category: "svg",
  },
  {
    title: "SVG Path Drawing",
    path: "/demo/svg-path-draw",
    description:
      "Animated SVG path drawing — waves, hearts, lightning, landscapes, and more",
    category: "svg",
  },
  {
    title: "Timers",
    path: "/demo/timers",
    description:
      "Standalone timers, alternating, reversed, delay, callbacks, methods",
    category: "core",
  },
  {
    title: "Timelines",
    path: "/demo/timelines",
    description:
      "Timeline animations, features, syncing, WAAPI integration",
    category: "core",
  },
  {
    title: "Playback Settings",
    path: "/demo/playback-settings",
    description:
      "Defaults, delay, loop, alternate, reversed, autoplay, frame rate",
    category: "core",
  },
  {
    title: "Callbacks",
    path: "/demo/callbacks",
    description:
      "onBegin, onComplete, onUpdate, onRender, onLoop, onPause, then",
    category: "core",
  },
  {
    title: "Methods",
    path: "/demo/methods",
    description:
      "Playback, add, set, sync, labels, remove, refresh, stretch, revert",
    category: "core",
  },
  {
    title: "Draggable",
    path: "/demo/draggable",
    description:
      "Drag interactions, spring physics, snapping, constraints, controls",
    category: "interaction",
  },
  {
    title: "On Scroll",
    path: "/demo/onscroll",
    description:
      "Scroll-triggered playback, scrub, directional callbacks",
    category: "scroll",
  },
  {
    title: "Layout",
    path: "/demo/layout",
    description:
      "Layout animations, enter/exit, stagger, methods, AnimeLayout component",
    category: "core",
  },
  {
    title: "Scope",
    path: "/demo/scope",
    description:
      "Scoping, constructor, root, defaults, media queries, methods, revert",
    category: "core",
  },
  {
    title: "Split Text",
    path: "/demo/split-text",
    description:
      "Text splitting, templates, CJK support, effects, advanced patterns",
    category: "core",
  },
  {
    title: "Easings",
    path: "/demo/easings",
    description:
      "cubicBezier, linear, steps, irregular, spring physics",
    category: "core",
  },
  {
    title: "Utilities",
    path: "/demo/utilities",
    description:
      "Math, random, string, DOM and value utility functions",
    category: "core",
  },
  {
    title: "AnimePresence",
    path: "/demo/animate-presence",
    description:
      "Enter/exit animations with sync, wait, and popLayout modes",
    category: "ui",
  },
  {
    title: "Toggle Switch",
    path: "/demo/toggle-switch",
    description: "Animated toggle switch with smooth transitions",
    category: "ui",
  },
  {
    title: "Counter & Countdown",
    path: "/demo/counter-countdown",
    description:
      "Animated counters and countdown timers with formatting",
    category: "ui",
  },
  {
    title: "Spinning 3D Cube",
    path: "/demo/spinning-cube",
    description:
      "CSS 3D cube with anime.js rotation, axis control, and speed variants",
    category: "ui",
  },
  {
    title: "ClipPath Reveal",
    path: "/demo/clippath-reveal",
    description:
      "Custom clipPath animations — circle, diamond, star, horizontal & vertical wipes",
    category: "svg",
  },
  {
    title: "Animated Slider",
    path: "/demo/animated-slider",
    description:
      "Smooth slide transitions with left/right navigation and multiple effects",
    category: "ui",
  },
  {
    title: "Reorder Animation",
    path: "/demo/reorder-list",
    description:
      "Animated reorder with FLIP layout, add/remove, and grid layout changes",
    category: "ui",
  },
  {
    title: "Scroll-Linked Animations",
    path: "/demo/scroll-linked-animations",
    description:
      "Parallax, fade-in, horizontal scrub, scale/rotate, color shift, and progress indicators",
    category: "scroll",
  },
  {
    title: "Scramble Text",
    path: "/demo/scramble-text",
    description:
      "Text scramble/reveal effect with custom chars, reveal rate, cursor, and looping",
    category: "ui",
  },
  {
    title: "UseAnimatable",
    path: "/demo/utilities",
    description:
      "Create animatable values for reactive animation state management",
    category: "core",
  },
];

export const demoDetails: DemoDetail[] = [
  {
    component: "useAnime",
    summary:
      "The foundational animation hook. Accepts any CSS selector, DOM ref, or JS object as a target — the same power as anime.js animate(), expressed as a React hook with automatic cleanup.",
    code: `import { useAnime } from 'react-animejs'

function Example() {
  const { ref } = useAnime({
    selector: '.box',
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.8, 1],
    duration: 800,
    ease: 'outCubic',
    delay: 100,
  })

  return <div ref={ref} className="box">Hello</div>
}`,
    props: [
      { name: "selector", type: "string", default: "—", desc: "CSS selector for child targets" },
      { name: "ref", type: "RefObject", default: "—", desc: "Direct DOM element ref" },
      { name: "opacity", type: "[number, number]", default: "—", desc: "Opacity keyframes [from, to]" },
      { name: "translateY", type: "[number, number]", default: "—", desc: "Vertical translation keyframes" },
      { name: "duration", type: "number", default: "1000", desc: "Duration in ms" },
      { name: "ease", type: "Easing", default: "'outCubic'", desc: "Easing function name" },
      { name: "delay", type: "number", default: "0", desc: "Delay before start (ms)" },
    ],
  },
  {
    component: "AnimeDraw",
    summary:
      "SVG path drawing component. Animates the drawing of an SVG path using stroke-dashoffset. Supports any path shape with configurable direction and easing.",
    code: `import { AnimeDraw } from 'react-animejs'

function HeartPath() {
  return (
    <AnimeDraw
      path="M12,21.35 l-1.45,-1.32 C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3 c1.74,0 3.41,0.81 4.5,2.09 C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.42 22,8.5 c0,3.78 -3.4,6.86 -8.55,11.54 L12,21.35Z"
      duration={2500}
      ease="inOutCubic"
      strokeWidth={3}
      color="var(--accent)"
    >
      <svg viewBox="0 0 24 24" width={120} />
    </AnimeDraw>
  )
}`,
    props: [
      { name: "path", type: "string", default: "—", desc: "SVG path d attribute" },
      { name: "duration", type: "number", default: "1500", desc: "Draw duration in ms" },
      { name: "ease", type: "Easing", default: "'outCubic'", desc: "Easing function" },
      { name: "strokeWidth", type: "number", default: "2", desc: "Path stroke width" },
      { name: "color", type: "string", default: "'currentColor'", desc: "Path stroke color" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop draw/undraw" },
    ],
  },
  {
    component: "AnimeDraw",
    summary:
      "Animates the drawing of an SVG path using stroke-dashoffset. Supports any path shape — waves, hearts, stars, complex curves — with configurable direction and easing.",
    code: `import { AnimeDraw } from 'react-animejs'

function WavePath() {
  return (
    <AnimeDraw
      path="M10,30 Q40,5 70,30 T130,30"
      duration={2000}
      ease="inOutCubic"
      strokeWidth={3}
      color="var(--accent)"
    >
      <svg viewBox="0 0 160 60" width={200} />
    </AnimeDraw>
  )
}`,
    props: [
      { name: "path", type: "string", default: "—", desc: "SVG path d attribute" },
      { name: "duration", type: "number", default: "1500", desc: "Draw duration in ms" },
      { name: "ease", type: "Easing", default: "'outCubic'", desc: "Easing function" },
      { name: "strokeWidth", type: "number", default: "2", desc: "Path stroke width" },
      { name: "color", type: "string", default: "'currentColor'", desc: "Path stroke color" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop draw/undraw" },
    ],
  },
  {
    component: "useAnimeTimer",
    summary:
      "A hook-based timer that integrates with the animation frame loop. Supports countdown, count-up, alternating directions, and callback chaining.",
    code: `import { useAnimeTimer } from 'react-animejs'

function CountdownTimer({ seconds }) {
  const { time, isRunning, start, pause, reset } = useAnimeTimer({
    from: seconds,
    to: 0,
    step: -1,
    interval: 1000,
    autoplay: false,
    onComplete: () => console.log('Done!'),
  })

  return (
    <div>
      <span>{time}s</span>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
    props: [
      { name: "from", type: "number", default: "0", desc: "Starting value" },
      { name: "to", type: "number", default: "60", desc: "Ending value" },
      { name: "step", type: "number", default: "1", desc: "Increment per tick" },
      { name: "interval", type: "number", default: "1000", desc: "Tick interval in ms" },
      { name: "autoplay", type: "boolean", default: "false", desc: "Start on mount" },
      { name: "onComplete", type: "Function", default: "—", desc: "Callback when timer reaches 'to'" },
    ],
  },
  {
    component: "AnimeTimeline",
    summary:
      "Orchestrate multi-step animation sequences with precise timing. Each step runs in order, supports keyframe targets, and can be synced with external timelines.",
    code: `import { AnimeTimeline } from 'react-animejs'

function Sequence() {
  return (
    <AnimeTimeline>
      <div className="box" data-translate-x={100} data-duration={400} />
      <div className="box" data-translate-y={60} data-rotate={180} data-duration={300} />
      <div className="circle" data-scale={1.5} data-duration={200} />
    </AnimeTimeline>
  )
}`,
    props: [
      { name: "loop", type: "boolean | number", default: "false", desc: "Loop count" },
      { name: "autoplay", type: "boolean", default: "true", desc: "Play on mount" },
      { name: "direction", type: "'normal' | 'alternate'", default: "'normal'", desc: "Play direction" },
    ],
  },
  {
    component: "AnimeProvider",
    summary:
      "A top-level provider that sets global animation defaults — duration, easing, delay, loop behavior, and frame rate — inherited by every animated child.",
    code: `import { AnimeProvider, useAnime } from 'react-animejs'

function App() {
  return (
    <AnimeProvider
      defaultDuration={500}
      defaultEasing="outQuad"
    >
      <Box />
    </AnimeProvider>
  )
}

function Box() {
  const { ref } = useAnime({
    selector: '.box',
    opacity: [0, 1],
  })
  return <div ref={ref} className="box">Inherits 500ms</div>
}`,
    props: [
      { name: "defaultDuration", type: "number", default: "1000", desc: "Global default duration (ms)" },
      { name: "defaultEasing", type: "string", default: "'outCubic'", desc: "Global default easing" },
      { name: "defaultDelay", type: "number", default: "0", desc: "Global default delay (ms)" },
      { name: "loop", type: "boolean | number", default: "false", desc: "Global loop setting" },
      { name: "frameRate", type: "number", default: "60", desc: "Target frame rate" },
    ],
  },
  {
    component: "useAnime (callbacks)",
    summary:
      "Every animation hook exposes lifecycle callbacks: onBegin, onUpdate, onComplete, onRender, onLoop, onPause. Use them to chain UI updates or trigger side effects.",
    code: `import { useAnime } from 'react-animejs'

function CallbackExample() {
  const [phase, setPhase] = React.useState('idle')

  useAnime({
    selector: '.card',
    opacity: [0, 1],
    translateY: [40, 0],
    duration: 600,
    onBegin: () => setPhase('animating'),
    onComplete: () => setPhase('done'),
    onUpdate: (anim) => {
      console.log('progress:', anim.progress)
    },
  })

  return <div className="card">Phase: {phase}</div>
}`,
    props: [
      { name: "onBegin", type: "Function", default: "—", desc: "Called when animation starts" },
      { name: "onComplete", type: "Function", default: "—", desc: "Called when animation finishes" },
      { name: "onUpdate", type: "Function", default: "—", desc: "Called every frame with anim instance" },
      { name: "onLoop", type: "Function", default: "—", desc: "Called each loop iteration" },
      { name: "onPause", type: "Function", default: "—", desc: "Called on pause" },
      { name: "onRender", type: "Function", default: "—", desc: "Called each render with current value" },
    ],
  },
  {
    component: "useAnimeControls",
    summary:
      "Access the underlying anime.js controls to call imperative methods: play(), pause(), seek(), restart(), reverse(), and more.",
    code: `import { useAnime, useAnimeControls } from 'react-animejs'

function ImperativeControl() {
  const { controls } = useAnime({
    selector: '.box',
    translateX: [0, 300],
    duration: 2000,
    autoplay: false,
  })

  return (
    <div>
      <div className="box" />
      <button onClick={() => controls?.play()}>Play</button>
      <button onClick={() => controls?.pause()}>Pause</button>
      <button onClick={() => controls?.reverse()}>Reverse</button>
      <button onClick={() => controls?.seek(500)}>Seek 500ms</button>
    </div>
  )
}`,
    props: [
      { name: "controls.play()", type: "Function", default: "—", desc: "Start/resume animation" },
      { name: "controls.pause()", type: "Function", default: "—", desc: "Pause animation" },
      { name: "controls.reverse()", type: "Function", default: "—", desc: "Reverse direction" },
      { name: "controls.seek(t)", type: "Function", default: "—", desc: "Jump to position (ms)" },
      { name: "controls.restart()", type: "Function", default: "—", desc: "Restart from beginning" },
    ],
  },
  {
    component: "useAnimeDraggable",
    summary:
      "Make any element draggable with spring physics. Supports snapping to grid, containment bounds, axis constraints, and interactive control.",
    code: `import { useAnimeDraggable } from 'react-animejs'

function DragExample() {
  const { ref } = useAnimeDraggable({
    axis: 'both',
    bounds: 'parent',
    snap: { x: [0, 100, 200], y: [0, 100] },
    onDrag: (pos) => console.log(pos),
    onRelease: (pos) => console.log('released', pos),
  })

  return (
    <div ref={ref} className="drag-handle">
      Drag me
    </div>
  )
}`,
    props: [
      { name: "axis", type: "'x' | 'y' | 'both'", default: "'both'", desc: "Constraint axis" },
      { name: "bounds", type: "'parent' | Element | Rect", default: "—", desc: "Containment bounds" },
      { name: "snap", type: "Object", default: "—", desc: "Snap-to-grid positions" },
      { name: "onDrag", type: "Function", default: "—", desc: "Called every drag frame" },
      { name: "onRelease", type: "Function", default: "—", desc: "Called on release" },
    ],
  },
  {
    component: "useAnimeOnScroll",
    summary:
      "Link animation playback to scroll position. Supports scrub (1:1 scroll-linked), enter/leave triggers, directional callbacks, and parallax speed mapping.",
    code: `import { useAnimeOnScroll } from 'react-animejs'

function ScrollSection() {
  const { ref } = useAnimeOnScroll({
    selector: '.parallax-el',
    translateY: [0, -120],
    scrub: 1.5,
    start: 'top 80%',
    end: 'bottom 20%',
    onEnter: () => console.log('entered'),
    onLeave: () => console.log('left'),
  })

  return (
    <div ref={ref}>
      <div className="parallax-el">Scroll-linked content</div>
    </div>
  )
}`,
    props: [
      { name: "scrub", type: "boolean | number", default: "false", desc: "Link to scroll (number = smoothing)" },
      { name: "start", type: "string", default: "'top bottom'", desc: "Scroll start position" },
      { name: "end", type: "string", default: "'bottom top'", desc: "Scroll end position" },
      { name: "onEnter", type: "Function", default: "—", desc: "Called when target enters viewport" },
      { name: "onLeave", type: "Function", default: "—", desc: "Called when target leaves viewport" },
    ],
  },
  {
    component: "AnimeLayout",
    summary:
      "FLIP-based layout animation component. Animates elements when their position in a reflow changes — enter, exit, reorder, and stagger between layout states.",
    code: `import { AnimeLayout, AnimeLayoutItem } from 'react-animejs'

function GridLayout({ items }) {
  return (
    <AnimeLayout duration={400} ease="outQuad" stagger={30}>
      <div className="grid">
        {items.map(item => (
          <AnimeLayoutItem key={item.id}>
            <div className="card">{item.name}</div>
          </AnimeLayoutItem>
        ))}
      </div>
    </AnimeLayout>
  )
}`,
    props: [
      { name: "duration", type: "number", default: "400", desc: "Layout animation duration" },
      { name: "ease", type: "Easing", default: "'outQuad'", desc: "Layout animation easing" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between items" },
      { name: "mode", type: "'popLayout' | 'sync' | 'wait'", default: "'popLayout'", desc: "Animation mode" },
    ],
  },
  {
    component: "useAnime + scope",
    summary:
      "Limit animation scope to a DOM subtree via ref. Avoid selector collisions in complex components. Supports scoped constructors, root elements, and revert on unmount.",
    code: `import { useAnime } from 'react-animejs'

function ScopedSection() {
  const { ref } = useAnime({
    selector: '.feature-card',
    opacity: [0, 1],
    translateY: [20, 0],
    stagger: 50,
  })

  return (
    <div ref={ref} id="feature-section">
      <div className="feature-card">Card 1</div>
      <div className="feature-card">Card 2</div>
      <div className="feature-card">Card 3</div>
    </div>
  )
}`,
    props: [
      { name: "ref", type: "RefObject", default: "—", desc: "Scope root element ref" },
      { name: "selector", type: "string", default: "—", desc: "Scoped CSS selector within ref" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between items" },
    ],
  },
  {
    component: "useAnimeScramble",
    summary:
      "Split text into characters, words, or lines for staggered typography animations. Supports staggered reveal, custom grouping, and advanced text effects.",
    code: `import { useAnime } from 'react-animejs'

function AnimatedHeadline({ text }) {
  const { ref } = useAnime({
    selector: '.char',
    opacity: [0, 1],
    translateY: [40, 0],
    stagger: 30,
    duration: 500,
    ease: 'outBack',
  })

  return (
    <h1 ref={ref}>
      {text.split('').map((char, i) => (
        <span key={i} className="char" style={{ display: 'inline-block' }}>
          {char === ' ' ? '\\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}`,
    props: [
      { name: "selector", type: "string", default: "—", desc: "Selector for split characters" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between characters" },
      { name: "opacity", type: "[number, number]", default: "—", desc: "Opacity keyframes" },
      { name: "translateY", type: "[number, number]", default: "—", desc: "Vertical translation keyframes" },
      { name: "duration", type: "number", default: "500", desc: "Per-character duration" },
    ],
  },
  {
    component: "useAnime (easings)",
    summary:
      "Custom easing curves including cubicBezier, linear, steps, and spring physics presets. Each easing function maps input progress to output progress over time.",
    code: `import { useAnime } from 'react-animejs'

function EasingDemo() {
  const { ref } = useAnime({
    selector: '.dot',
    translateX: [0, 200],
    duration: 1000,
    ease: 'outElastic',
  })

  return <div ref={ref} className="dot" />
}

// Available easings:
// 'linear', 'inQuad', 'outQuad', 'inOutQuad',
// 'inCubic', 'outCubic', 'inOutCubic',
// 'inQuart', 'outQuart', 'inOutQuart',
// 'inQuint', 'outQuint', 'inOutQuint',
// 'inSine', 'outSine', 'inOutSine',
// 'inExpo', 'outExpo', 'inOutExpo',
// 'inCirc', 'outCirc', 'inOutCirc',
// 'inBack', 'outBack', 'inOutBack',
// 'inElastic', 'outElastic', 'inOutElastic',
// 'outBounce', 'inBounce', 'inOutBounce'`,
    props: [
      { name: "ease", type: "Easing", default: "'outCubic'", desc: "Easing function name" },
      { name: "duration", type: "number", default: "1000", desc: "Animation duration" },
    ],
  },
  {
    component: "anime utilities",
    summary:
      "Functional utilities for animation math (clamp, lerp, mapRange), random generation, string interpolation, DOM measurement, and value conversion — all from anime.js.",
    code: `import { animate, stagger, utils } from 'animejs'

// The underlying anime.js library provides:
// animate() — core animation function
// stagger() — stagger delay helper
// createTimeline() — timeline sequencing
// onScroll() — scroll-linked animations
// createScope() — scoped animation trees

// react-animejs wraps these as React hooks:
import {
  useAnime,
  useAnimeOnScroll,
  useAnimeTimeline,
  useAnimeTimer,
  useAnimeDraggable,
  useAnimeControls,
  useAnimeScramble,
  useAnimatable,
} from 'react-animejs'`,
    props: [
      { name: "useAnime()", type: "Hook", default: "—", desc: "Core animation hook" },
      { name: "useAnimeOnScroll()", type: "Hook", default: "—", desc: "Scroll-linked animation hook" },
      { name: "useAnimeTimeline()", type: "Hook", default: "—", desc: "Timeline sequencing hook" },
      { name: "useAnimeTimer()", type: "Hook", default: "—", desc: "Timer/countdown hook" },
      { name: "useAnimeDraggable()", type: "Hook", default: "—", desc: "Drag interaction hook" },
      { name: "useAnimeControls()", type: "Hook", default: "—", desc: "Imperative playback controls" },
    ],
  },
  {
    component: "AnimePresence",
    summary:
      "Enter/exit animations for React children with support for staggered mount, sync mode, wait mode, and popLayout (animate siblings out of the way before inserting).",
    code: `import { AnimePresence } from 'react-animejs'

function NotificationList({ items }) {
  return (
    <AnimePresence
      mode="popLayout"
      enter={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      duration={350}
      stagger={40}
    >
      {items.map(item => (
        <div key={item.id} className="notification">
          {item.text}
        </div>
      ))}
    </AnimePresence>
  )
}`,
    props: [
      { name: "mode", type: "'sync' | 'wait' | 'popLayout'", default: "'sync'", desc: "Animation coordination mode" },
      { name: "enter", type: "AnimeParams", default: "—", desc: "Enter animation keyframes" },
      { name: "exit", type: "AnimeParams", default: "—", desc: "Exit animation keyframes" },
      { name: "duration", type: "number", default: "300", desc: "Animation duration" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger delay between items" },
    ],
  },
  {
    component: "useAnime (toggle)",
    summary:
      "A fully animated toggle switch with smooth track/thumb transitions, accessible keyboard support, and controlled/uncontrolled modes.",
    code: `import { useAnime } from 'react-animejs'

function ToggleSwitch({ checked, onChange }) {
  const { ref } = useAnime({
    selector: '.toggle-thumb',
    translateX: checked ? 20 : 0,
    backgroundColor: checked ? 'var(--accent)' : 'var(--border)',
    duration: 300,
    ease: 'outQuad',
    deps: [checked],
  })

  return (
    <label ref={ref} role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="toggle-track"
    >
      <span className="toggle-thumb" />
    </label>
  )
}`,
    props: [
      { name: "checked", type: "boolean", default: "false", desc: "Controlled checked state" },
      { name: "onChange", type: "Function", default: "—", desc: "Change handler" },
      { name: "duration", type: "number", default: "300", desc: "Transition duration (ms)" },
      { name: "deps", type: "any[]", default: "—", desc: "Dependencies to trigger re-animation" },
    ],
  },
  {
    component: "useAnime (counter)",
    summary:
      "Animated number display with smooth counting transitions. Use useAnime to animate a custom property and read it on each update frame.",
    code: `import { useAnime } from 'react-animejs'

function Counter({ from = 0, to = 10000, duration = 2000 }) {
  const [value, setValue] = React.useState(from)
  const targetRef = React.useRef({ val: from })

  useAnime({
    targets: targetRef.current,
    val: to,
    duration,
    ease: 'outQuad',
    onUpdate: () => setValue(Math.round(targetRef.current.val)),
  })

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value.toLocaleString()}
    </span>
  )
}`,
    props: [
      { name: "from", type: "number", default: "0", desc: "Starting value" },
      { name: "to", type: "number", default: "100", desc: "Ending value" },
      { name: "duration", type: "number", default: "1000", desc: "Animation duration (ms)" },
      { name: "ease", type: "Easing", default: "'outQuad'", desc: "Easing function" },
      { name: "onUpdate", type: "Function", default: "—", desc: "Frame update callback" },
    ],
  },
  {
    component: "useAnime (3D rotation)",
    summary:
      "A CSS 3D cube driven by useAnime. Control axis (X, Y, Z), speed, easing, and direction. Demonstrates how react-animejs handles 3D transforms declaratively.",
    code: `import { useAnime } from 'react-animejs'

function Cube3D({ axis = 'y', speed = 1 }) {
  const rotation = { y: 360 }
  if (axis.includes('x')) Object.assign(rotation, { x: 15 })

  const { ref } = useAnime({
    selector: '.cube',
    ...rotation,
    duration: 4000 / speed,
    ease: 'linear',
    loop: true,
  })

  return (
    <div ref={ref} style={{ perspective: 600 }}>
      <div className="cube" style={{ transformStyle: 'preserve-3d' }}>
        <div className="face front">✦</div>
        <div className="face back">✦</div>
        <div className="face right">✦</div>
        <div className="face left">✦</div>
        <div className="face top">✦</div>
        <div className="face bottom">✦</div>
      </div>
    </div>
  )
}`,
    props: [
      { name: "axis", type: "'x' | 'y' | 'z' | 'xy' | 'xyz'", default: "'y'", desc: "Rotation axis" },
      { name: "speed", type: "number", default: "1", desc: "Rotation speed multiplier" },
      { name: "ease", type: "Easing", default: "'linear'", desc: "Rotation easing" },
      { name: "loop", type: "boolean | number", default: "true", desc: "Loop rotation" },
    ],
  },
  {
    component: "useAnime (clipPath)",
    summary:
      "Reveal content with custom clip-path shapes — circle, diamond, star, horizontal wipe, vertical wipe. Each shape animates from hidden to fully visible.",
    code: `import { useAnime } from 'react-animejs'

function ClipReveal({ shape = 'circle', duration = 800 }) {
  const clipMap = {
    circle:    ['circle(0%)', 'circle(70%)'],
    diamond:   ['polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'],
    'wipe-right': ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
  }

  const { ref } = useAnime({
    selector: '.clip-content',
    clipPath: clipMap[shape] || clipMap.circle,
    duration,
    ease: 'inOutCubic',
  })

  return (
    <div ref={ref}>
      <div className="clip-content">
        <img src="/hero.jpg" alt="Revealed" />
      </div>
    </div>
  )
}`,
    props: [
      { name: "shape", type: "string", default: "'circle'", desc: "Clip shape type" },
      { name: "duration", type: "number", default: "800", desc: "Reveal duration (ms)" },
      { name: "ease", type: "Easing", default: "'inOutCubic'", desc: "Easing function" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop reveal/hide" },
    ],
  },
  {
    component: "useAnime (slider)",
    summary:
      "A slide-based carousel with animated transitions. Uses useAnime for smooth translateX transitions between slides with configurable easing.",
    code: `import { useAnime } from 'react-animejs'

function AnimatedSlider({ children }) {
  const [current, setCurrent] = React.useState(0)
  const slides = React.Children.toArray(children)

  const { controls } = useAnime({
    selector: '.slider-track',
    translateX: [\`-\${current * 100}%\`],
    duration: 500,
    ease: 'outQuad',
    deps: [current],
  })

  return (
    <div className="slider">
      <div className="slider-track">
        {slides.map((slide, i) => (
          <div key={i} className="slide">{slide}</div>
        ))}
      </div>
      <button onClick={() => setCurrent(c => Math.max(0, c - 1))}>
        ← Prev
      </button>
      <button onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))}>
        Next →
      </button>
    </div>
  )
}`,
    props: [
      { name: "effect", type: "string", default: "'slide'", desc: "Transition effect" },
      { name: "duration", type: "number", default: "500", desc: "Transition duration (ms)" },
      { name: "ease", type: "Easing", default: "'outQuad'", desc: "Transition easing" },
      { name: "autoplay", type: "number | boolean", default: "false", desc: "Autoplay interval (ms)" },
    ],
  },
  {
    component: "AnimeLayout (reorder)",
    summary:
      "Animated list/grid reordering with FLIP layout transitions. Uses AnimeLayout for enter/exit animations and smooth layout shifts when items change position.",
    code: `import { AnimeLayout, AnimeLayoutItem } from 'react-animejs'

function SortableList() {
  const [items, setItems] = React.useState([
    { id: 1, text: 'Alpha' },
    { id: 2, text: 'Beta' },
    { id: 3, text: 'Gamma' },
  ])

  const shuffle = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  return (
    <div>
      <button onClick={shuffle}>Shuffle</button>
      <AnimeLayout duration={400} ease="outQuad">
        {items.map(item => (
          <AnimeLayoutItem key={item.id}>
            <div className="card">{item.text}</div>
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
    </div>
  )
}`,
    props: [
      { name: "duration", type: "number", default: "400", desc: "Layout transition duration" },
      { name: "ease", type: "Easing", default: "'outQuad'", desc: "Layout easing" },
      { name: "stagger", type: "number", default: "0", desc: "Stagger between items" },
    ],
  },
  {
    component: "useAnimeOnScroll (linked)",
    summary:
      "Composable scroll-linked effects — parallax, fade-in, horizontal scrub, scale/rotate on scroll — all driven by useAnimeOnScroll with ScrollTrigger integration.",
    code: `import { useAnimeOnScroll } from 'react-animejs'

function ScrollScene() {
  const { ref } = useAnimeOnScroll({
    selector: '.parallax-img',
    translateY: [0, -120],
    scrub: 1,
  })

  const { ref: ref2 } = useAnimeOnScroll({
    selector: '.floating-card',
    translateX: [0, 60],
    scrub: 0.5,
  })

  return (
    <div>
      <div ref={ref}>
        <img className="parallax-img" src="/hero.jpg" />
      </div>
      <div ref={ref2}>
        <div className="floating-card" />
      </div>
    </div>
  )
}`,
    props: [
      { name: "scrub", type: "number | boolean", default: "false", desc: "Smoothing factor for scroll link" },
      { name: "start", type: "string", default: "'top bottom'", desc: "Scroll start position" },
      { name: "end", type: "string", default: "'bottom top'", desc: "Scroll end position" },
      { name: "onProgress", type: "Function", default: "—", desc: "Called with 0–1 progress" },
    ],
  },
  {
    component: "useAnimeScramble",
    summary:
      "Text scramble/reveal effect — animates from random characters to the final text. Configurable character set, reveal rate, cursor blink, and looping behavior.",
    code: `import { useAnimeScramble } from 'react-animejs'

function HeroHeadline() {
  const { ref } = useAnimeScramble({
    text: 'Build without limits',
    duration: 2000,
    chars: '!<>-_\\\\/[]{}—=+*^?#',
    revealRate: 1.2,
    cursor: true,
    loop: true,
  })

  return <h1 ref={ref} />
}`,
    props: [
      { name: "text", type: "string", default: "—", desc: "Target text to reveal" },
      { name: "duration", type: "number", default: "1500", desc: "Total animation duration (ms)" },
      { name: "chars", type: "string", default: "'!<>-_\\\\/[]{}—=+*^?#'", desc: "Character set for scramble" },
      { name: "revealRate", type: "number", default: "1", desc: "Speed multiplier for revelation" },
      { name: "cursor", type: "boolean", default: "false", desc: "Show blinking cursor" },
      { name: "loop", type: "boolean", default: "false", desc: "Loop the scramble effect" },
    ],
  },
  {
    component: "useAnimatable",
    summary:
      "Create animatable values for reactive animation state management. Returns a ref-driven value that can be smoothly interpolated by anime.js.",
    code: `import { useAnimatable } from 'react-animejs'

function ReactiveValue() {
  const [target, setTarget] = React.useState(0)
  const value = useAnimatable(target, {
    duration: 600,
    ease: 'outQuad',
  })

  return (
    <div>
      <span>{Math.round(value)}</span>
      <button onClick={() => setTarget(100)}>Go to 100</button>
      <button onClick={() => setTarget(0)}>Reset</button>
    </div>
  )
}`,
    props: [
      { name: "target", type: "number", default: "—", desc: "Target value to animate toward" },
      { name: "duration", type: "number", default: "600", desc: "Interpolation duration (ms)" },
      { name: "ease", type: "Easing", default: "'outCubic'", desc: "Interpolation easing" },
    ],
  },
];

export const CATEGORIES = [
  "all",
  "core",
  "svg",
  "scroll",
  "interaction",
  "ui",
] as const;

export type FilterCategory = (typeof CATEGORIES)[number];

export const PREVIEW_ANIM_IDS = [
  "stagger-boxes",
  "svg-pulse",
  "svg-path-draw",
  "counter",
  "bars-grow",
  "ring-orbit",
  "bounce-dots",
  "scale-box",
  "cube-rotate",
  "clip-reveal",
  "scramble",
] as const;

export function getPreviewAnimId(index: number): string {
  return PREVIEW_ANIM_IDS[index % PREVIEW_ANIM_IDS.length];
}
