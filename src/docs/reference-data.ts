export interface ReferenceProperty {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  signature: string;
  description: string;
  usage: string;
  example: string;
  properties: ReferenceProperty[];
}

const localImport = "from '@shakibdshy/react-animejs'";

export const hookReferences: ReferenceEntry[] = [
  {
    id: 'use-anime',
    name: 'useAnime',
    signature: 'useAnime<T>(options?: UseAnimeOptions)',
    description:
      'Creates and owns an Anime.js animation for a mounted DOM or SVG target. Use it as the default animation hook when a component needs reactive state and playback controls.',
    usage: `import { useAnime } ${localImport}\n\nconst animation = useAnime({\n  opacity: [0, 1],\n})`,
    example: `const { ref, controls, state } = useAnime({\n  translateY: [24, 0],\n  opacity: [0, 1],\n  duration: 700,\n  autoplay: false,\n})\n\nreturn (\n  <button ref={ref} onClick={controls.play}>\n    {Math.round(state.progress)}%\n  </button>\n)`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeOptions',
        description:
          'Anime.js properties, playback settings, callbacks, selector/targets, deps, enabled, and a shared controller.',
      },
      {
        name: 'returns',
        type: 'UseAnimeReturn<T>',
        description: 'ref, animation, controls, state, isPlaying, isReady, and scrollObserver.',
      },
    ],
  },
  {
    id: 'use-anime-timer',
    name: 'useAnimeTimer',
    signature: 'useAnimeTimer(options?: UseAnimeTimerOptions)',
    description:
      'Creates an Anime.js timer with React-safe lifecycle management. It is useful for countdowns, loops, and animation-synchronised timing.',
    usage: `import { useAnimeTimer } ${localImport}\n\nconst timer = useAnimeTimer({\n  duration: 1000,\n  loop: true,\n})`,
    example: `const { count, controls, isRunning } = useAnimeTimer({\n  duration: 1000,\n  loop: true,\n  trackLoopCount: true,\n  autoplay: true,\n})\n\nreturn (\n  <button onClick={controls.pause}>\n    {isRunning ? count : 'Paused'}\n  </button>\n)`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeTimerOptions',
        description: 'Playback settings plus deps, enabled, tracking flags, and timer callbacks.',
      },
      {
        name: 'trackLoopCount?',
        type: 'boolean',
        description: 'Tracks completed loops in React state.',
      },
      {
        name: 'autoUpdateRefs?',
        type: 'boolean',
        description: 'Updates countRef and iterationTimeRef without a render each tick.',
      },
      {
        name: 'returns',
        type: 'UseAnimeTimerReturn',
        description: 'timer, controls, state, tracking values, display refs, and readiness flags.',
      },
    ],
  },
  {
    id: 'use-anime-timeline',
    name: 'useAnimeTimeline',
    signature: 'useAnimeTimeline(options?, entries?)',
    description:
      'Creates a sequenced Anime.js timeline. Define stable entries up front or add, label, sync, and call entries later through controls.',
    usage: `import { useAnimeTimeline } ${localImport}\n\nconst timeline = useAnimeTimeline(\n  { autoplay: false },\n  entries,\n)`,
    example: `const { controls } = useAnimeTimeline(\n  { autoplay: false },\n  [\n    {\n      targets: titleRef,\n      opacity: [0, 1],\n      position: 0,\n    },\n    {\n      targets: cardRef,\n      translateY: [16, 0],\n      position: '-=200',\n    },\n  ],\n)\n\nreturn <button onClick={controls.play}>Play</button>`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeTimelineOptions',
        description: 'Timeline playback settings, callbacks, defaults, deps, and enabled.',
      },
      {
        name: 'entries?',
        type: 'TimelineEntry[]',
        description: 'Animation, timer, call, sync, or label entries.',
      },
      {
        name: 'position',
        type: 'number | string',
        description: 'An entry position such as 0, +=300, -=200, labels, <, or >.',
      },
      {
        name: 'returns',
        type: 'UseAnimeTimelineReturn',
        description: 'timeline ref, controls, state, isPlaying, and isReady.',
      },
    ],
  },
  {
    id: 'use-anime-layout',
    name: 'useAnimeLayout',
    signature: 'useAnimeLayout<T>(options?: UseAnimeLayoutOptions)',
    description:
      'Creates FLIP-style layout animation controls for a root and its changing children. Use it when you own the refs and need manual measurement or update control.',
    usage: `import { useAnimeLayout } ${localImport}\n\nconst layout = useAnimeLayout({\n  duration: 500,\n})`,
    example: `const { ref, controls } = useAnimeLayout({\n  duration: 500,\n  ease: 'outExpo',\n})\n\nuseLayoutEffect(() => {\n  controls.update()\n}, [items])\n\nreturn <div ref={ref}>{items.map(renderItem)}</div>`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeLayoutOptions',
        description: 'AutoLayout parameters plus root, children, deps, enabled, and callbacks.',
      },
      {
        name: 'duration?',
        type: 'number',
        description: 'Length of the layout transition in milliseconds.',
      },
      {
        name: 'returns',
        type: 'UseAnimeLayoutReturn<T>',
        description: 'root ref, layout instance, state, controls, and readiness.',
      },
    ],
  },
  {
    id: 'use-anime-draggable',
    name: 'useAnimeDraggable',
    signature: 'useAnimeDraggable<T>(options?: UseAnimeDraggableOptions)',
    description:
      'Makes an element draggable with Anime.js physics, optional bounds, snapping, and reactive drag information.',
    usage: `import { useAnimeDraggable } ${localImport}\n\nconst draggable = useAnimeDraggable({\n  axis: 'x',\n})`,
    example: `const { ref, isDragging, position } = useAnimeDraggable({\n  container: containerRef.current,\n  releaseStiffness: 120,\n  releaseDamping: 20,\n})\n\nreturn (\n  <div ref={ref}>\n    x: {Math.round(position.x)}\n    {isDragging && ' dragging'}\n  </div>\n)`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeDraggableOptions',
        description: 'Draggable configuration, callbacks, bounds, axis, snapping, and physics.',
      },
      {
        name: 'container?',
        type: 'HTMLElement | RefObject',
        description: 'The element that constrains the draggable target.',
      },
      {
        name: 'snap?',
        type: 'DraggableSnap',
        description: 'Snap configuration for the released target.',
      },
      {
        name: 'returns',
        type: 'UseAnimeDraggableReturn<T>',
        description: 'ref, draggable, controls, position, velocity, progress, and isDragging.',
      },
    ],
  },
  {
    id: 'use-anime-onscroll',
    name: 'useAnimeOnScroll',
    signature: 'useAnimeOnScroll<T, C>(options?: UseAnimeOnScrollOptions)',
    description:
      'Owns an Anime.js scroll observer and exposes target and container refs, reactive scroll state, and observer controls.',
    usage: `import { useAnimeOnScroll } ${localImport}\n\nconst scroll = useAnimeOnScroll({\n  enter: 'bottom center',\n})`,
    example: `const { ref, progress, isInView } = useAnimeOnScroll({\n  enter: 'bottom center',\n  leave: 'top center',\n  sync: true,\n})\n\nreturn (\n  <section ref={ref}>\n    {isInView ? Math.round(progress * 100) : 0}%\n  </section>\n)`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeOnScrollOptions',
        description:
          'Observer parameters plus target/container, linking, deps, enabled, and callbacks.',
      },
      {
        name: 'sync?',
        type: 'boolean',
        description: 'Synchronises the linked animation or observer progress with scrolling.',
      },
      {
        name: 'enter? / leave?',
        type: 'ScrollThresholdValue',
        description: 'Viewport threshold values that define the active range.',
      },
      {
        name: 'returns',
        type: 'UseAnimeOnScrollReturn<T, C>',
        description: 'refs, observer, controls, state, progress, visibility, and readiness.',
      },
    ],
  },
  {
    id: 'use-anime-controls',
    name: 'useAnimeControls',
    signature: 'useAnimeControls()',
    description:
      'Creates one shared controller that coordinates multiple useAnime animations without passing instance refs between components.',
    usage: `import { useAnimeControls } ${localImport}\n\nconst controller = useAnimeControls()`,
    example: `const controller = useAnimeControls()\n\nuseAnime({\n  translateX: 120,\n  controller,\n})\n\nuseAnime({\n  opacity: [0, 1],\n  controller,\n})\n\nreturn <button onClick={controller.restart}>Restart both</button>`,
    properties: [
      {
        name: 'parameters',
        type: 'none',
        description: 'The controller is created without configuration.',
      },
      {
        name: 'returns',
        type: 'AnimeController',
        description: 'Playback controls plus register(animation) for hook integration.',
      },
    ],
  },
  {
    id: 'use-anime-waapi',
    name: 'useAnimeWAAPI',
    signature: 'useAnimeWAAPI<T>(options?: UseAnimeWAAPIOptions)',
    description:
      'Runs Web Animations API work through a React hook while preserving the familiar controls and lifecycle cleanup.',
    usage: `import { useAnimeWAAPI } ${localImport}\n\nconst animation = useAnimeWAAPI({\n  keyframes: [{ opacity: 0 }, { opacity: 1 }],\n})`,
    example: `const { ref, controls } = useAnimeWAAPI({\n  keyframes: [\n    { transform: 'scale(.96)' },\n    { transform: 'scale(1)' },\n  ],\n  duration: 300,\n  autoplay: false,\n})\n\nreturn <button ref={ref} onClick={controls.play}>Open</button>`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeWAAPIOptions',
        description:
          'WAAPI keyframes, timing settings, target options, callbacks, deps, and enabled.',
      },
      {
        name: 'keyframes?',
        type: 'Keyframe[]',
        description: 'The browser-native keyframes to animate.',
      },
      {
        name: 'returns',
        type: 'UseAnimeWAAPIReturn<T>',
        description: 'ref, WAAPI animation, controls, state, and readiness.',
      },
    ],
  },
  {
    id: 'use-anime-scope',
    name: 'useAnimeScope',
    signature: 'useAnimeScope<T>(options?: UseAnimeScopeOptions<T>)',
    description:
      'Creates an Anime.js scope with cleanup, scoped selectors, shared defaults, and media-query-aware reactivity.',
    usage: `import { useAnimeScope } ${localImport}\n\nconst scope = useAnimeScope({\n  root: rootRef,\n})`,
    example: `const { ref, scope } = useAnimeScope({\n  mediaQueries: {\n    desktop: '(min-width: 768px)',\n  },\n  defaults: {\n    duration: 600,\n  },\n})\n\nreturn (\n  <section ref={ref}>\n    {scope.current?.matches.desktop && 'Desktop'}\n  </section>\n)`,
    properties: [
      {
        name: 'options?',
        type: 'UseAnimeScopeOptions<T>',
        description: 'Root, media queries, defaults, deps, enabled, and scope lifecycle callbacks.',
      },
      {
        name: 'mediaQueries?',
        type: 'ScopeMediaQueries',
        description: 'Named media queries that re-run scoped work when matches change.',
      },
      {
        name: 'returns',
        type: 'UseAnimeScopeReturn<T>',
        description: 'ref, scope instance, methods, media matches, and readiness.',
      },
    ],
  },
  {
    id: 'use-split-text',
    name: 'useSplitText',
    signature: 'useSplitText(options?: UseSplitTextOptions)',
    description:
      'Splits a text target into characters, words, or lines and gives you the Anime.js TextSplitter plus safe lifecycle methods.',
    usage: `import { useSplitText } ${localImport}\n\nconst split = useSplitText({\n  chars: true,\n})`,
    example: `const { ref, split, isReady } = useSplitText({\n  chars: true,\n  words: true,\n})\n\nuseEffect(() => {\n  if (isReady) {\n    animate(split.current?.chars, {\n      opacity: [0, 1],\n    })\n  }\n}, [isReady])\n\nreturn <h1 ref={ref}>Hello</h1>`,
    properties: [
      {
        name: 'options?',
        type: 'UseSplitTextOptions',
        description: 'Text splitter parameters plus deps and enabled.',
      },
      {
        name: 'chars? / words? / lines?',
        type: 'boolean',
        description: 'Selects which text units the splitter creates.',
      },
      {
        name: 'returns',
        type: 'UseSplitTextReturn',
        description: 'ref, splitter ref, split/revert/refresh methods, and isReady.',
      },
    ],
  },
  {
    id: 'use-animatable',
    name: 'useAnimatable',
    signature: 'useAnimatable<T>(config)',
    description:
      'Creates a reactive Anime.js animatable value for DOM elements or arbitrary compatible objects.',
    usage: `import { useAnimatable } ${localImport}\n\nconst value = useAnimatable({ initial: 0 })`,
    example: `const progress = useAnimatable({ initial: 0 })\n\nreturn <input\n  type="range"\n  onChange={(event) => progress.set(Number(event.target.value))}\n/>`,
    properties: [
      {
        name: 'config',
        type: 'AnimatableConfig',
        description: 'Initial value, target, property settings, and optional callbacks.',
      },
      {
        name: 'initial',
        type: 'number | string',
        description: 'Initial value supplied to the animatable instance.',
      },
      {
        name: 'returns',
        type: 'UseAnimatableReturn<T>',
        description: 'animatable instance, current value, setter, and lifecycle state.',
      },
    ],
  },
  {
    id: 'use-animatable-event',
    name: 'useAnimatableEvent',
    signature: 'useAnimatableEvent(event, handler)',
    description:
      'Binds an event handler to an HTMLElement event with the same stable lifecycle conventions as the rest of the library.',
    usage: `import { useAnimatableEvent } ${localImport}\n\nuseAnimatableEvent('pointermove', onMove)`,
    example: `const ref = useRef<HTMLDivElement>(null)\nuseAnimatableEvent(ref, 'pointermove', (event) => {\n  pointer.set(event.clientX)\n})\n\nreturn <div ref={ref} />`,
    properties: [
      {
        name: 'target',
        type: 'RefObject<HTMLElement>',
        description: 'The element whose event listener should be managed.',
      },
      {
        name: 'event',
        type: 'keyof HTMLElementEventMap',
        description: 'The browser event to subscribe to.',
      },
      {
        name: 'handler',
        type: 'EventListener',
        description: 'The handler called for each matching event.',
      },
    ],
  },
  {
    id: 'use-anime-adapter',
    name: 'useAnimeAdapter',
    signature: 'useAnimeAdapter(config: AnimeAdapterConfig)',
    description:
      'Registers a React-managed Anime.js adapter so custom objects, canvas primitives, or render-engine values can be targeted.',
    usage: `import { useAnimeAdapter } ${localImport}\n\nuseAnimeAdapter({\n  id: 'canvas',\n  detect,\n  targets,\n})`,
    example: `useAnimeAdapter({\n  id: 'sprite',\n  detect: (value) => value?.kind === 'sprite',\n  targets: [\n    {\n      detect: () => true,\n      properties: {\n        x: {\n          get: (sprite) => sprite.x,\n          set: (sprite, value) => {\n            sprite.x = value\n          },\n        },\n      },\n    },\n  ],\n})`,
    properties: [
      {
        name: 'config',
        type: 'AnimeAdapterConfig',
        description: 'Adapter id, root detector, and target property definitions.',
      },
      { name: 'id', type: 'string', description: 'Stable unique adapter name.' },
      {
        name: 'targets',
        type: 'AnimeAdapterTarget[]',
        description: 'The custom target types and get/set property adapters.',
      },
      {
        name: 'returns',
        type: 'UseAnimeAdapterReturn',
        description: 'adapter instance and isReady.',
      },
    ],
  },
  {
    id: 'use-svg-animation',
    name: 'useSvgAnimation',
    signature: 'useSvgAnimation<TSvg>(options: SvgAnimationOptions)',
    description:
      'Provides shared target refs, playback controls, and cleanup for custom SVG animation components.',
    usage: `import { useSvgAnimation } ${localImport}\n\nconst svg = useSvgAnimation({\n  createConfig,\n})`,
    example: `const { childRef, controls } = useSvgAnimation<SVGPathElement>({\n  createConfig: (target) => ({\n    targets: target,\n    strokeDashoffset: [100, 0],\n  }),\n})\n\nreturn <path ref={childRef} onClick={controls.play} />`,
    properties: [
      {
        name: 'options',
        type: 'SvgAnimationOptions',
        description:
          'Config factory, animation properties, callbacks, autoplay, deps, and enabled.',
      },
      {
        name: 'createConfig',
        type: '(target) => object',
        description: 'Builds the Anime.js configuration for the resolved SVG target.',
      },
      {
        name: 'returns',
        type: 'SvgComponentRef',
        description: 'childRef, animation, controls, state, and readiness.',
      },
    ],
  },
  {
    id: 'use-anime-scramble',
    name: 'useAnimeScramble',
    signature: 'useAnimeScramble(options: UseAnimeScrambleOptions)',
    description:
      'Controls Anime.js text scrambling as a React hook, including automatic cleanup and a stable update method.',
    usage: `import { useAnimeScramble } ${localImport}\n\nconst scramble = useAnimeScramble({\n  text: 'Ready',\n})`,
    example: `const { ref, scramble } = useAnimeScramble({\n  text: 'Build in motion',\n  duration: 650,\n  autoplay: false,\n})\n\nreturn (\n  <button ref={ref} onMouseEnter={() => scramble()}>\n    Build in motion\n  </button>\n)`,
    properties: [
      {
        name: 'options',
        type: 'UseAnimeScrambleOptions',
        description: 'Text, characters, duration, autoplay, callbacks, and dependencies.',
      },
      {
        name: 'text',
        type: 'string',
        description: 'The target text to reveal through scrambling.',
      },
      {
        name: 'returns',
        type: 'UseAnimeScrambleReturn',
        description: 'ref, scramble function, animation state, controls, and readiness.',
      },
    ],
  },
];

export const componentReferences: ReferenceEntry[] = [
  {
    id: 'anime-provider',
    name: 'AnimeProvider',
    signature: '<AnimeProvider>{children}</AnimeProvider>',
    description:
      'Provides a shared scope context so descendant hooks can resolve scoped targets and clean up together.',
    usage: `import { AnimeProvider } ${localImport}`,
    example: `<AnimeProvider>\n  <PageWithScopedAnimations />\n</AnimeProvider>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The subtree that can consume scope context.',
        required: true,
      },
    ],
  },
  {
    id: 'anime-component',
    name: 'Anime',
    signature: '<Anime {...animationProps}>',
    description:
      'A declarative single-target animation wrapper built on useAnime. It forwards a ref to its child target and accepts animation options.',
    usage: `import { Anime } ${localImport}`,
    example: `<Anime\n  opacity={[0, 1]}\n  translateY={[16, 0]}\n  duration={500}\n  autoplay\n>\n  <h2>Visible in JSX</h2>\n</Anime>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The DOM or SVG target to animate.',
        required: true,
      },
      {
        name: 'autoplay?',
        type: 'boolean | ScrollObserverParams',
        description: 'Starts the animation automatically or via scroll.',
      },
      {
        name: 'onStateChange?',
        type: '(state) => void',
        description: 'Receives meaningful reactive animation state changes.',
      },
    ],
  },
  {
    id: 'anime-scroll',
    name: 'AnimeScroll',
    signature: '<AnimeScroll {...scrollOptions}>{render}</AnimeScroll>',
    description:
      'A render-prop wrapper around useAnimeOnScroll that adds no target wrapper element.',
    usage: `import { AnimeScroll } ${localImport}`,
    example: `<AnimeScroll\n  enter="bottom center"\n  sync\n>\n  {({ ref, progress }) => (\n    <div ref={ref}>{Math.round(progress * 100)}%</div>\n  )}\n</AnimeScroll>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode | (api) => ReactNode',
        description: 'Static content or a render function that receives refs, controls, and state.',
      },
      {
        name: 'enter? / leave?',
        type: 'ScrollThresholdValue',
        description: 'Observer thresholds.',
      },
      { name: 'onReady?', type: '(api) => void', description: 'Runs once the observer is ready.' },
    ],
  },
  {
    id: 'anime-batch',
    name: 'AnimeBatch',
    signature: '<AnimeBatch animation={...}>{children}</AnimeBatch>',
    description:
      'Observes descendants marked with data-anime-batch and animates them in short, configurable viewport batches.',
    usage: `import { AnimeBatch } ${localImport}`,
    example: `<AnimeBatch\n  animation={{\n    opacity: [0, 1],\n    translateY: [12, 0],\n  }}\n>\n  <Card data-anime-batch />\n  <Card data-anime-batch />\n</AnimeBatch>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Content containing data-anime-batch targets.',
        required: true,
      },
      {
        name: 'animation',
        type: 'AnimeBatchAnimation',
        description: 'Animation properties for each observed batch item.',
        required: true,
      },
      { name: 'batchSize?', type: 'number', description: 'Maximum items animated in one batch.' },
    ],
  },
  {
    id: 'anime-draw',
    name: 'AnimeDraw',
    signature: '<AnimeDraw {...animationProps}>',
    description:
      'Draws a compatible SVG shape by animating its drawable path values through useSvgAnimation.',
    usage: `import { AnimeDraw } ${localImport}`,
    example: `<AnimeDraw\n  strokeDashoffset={[1, 0]}\n  duration={900}\n>\n  <path d="M0 20 L100 20" />\n</AnimeDraw>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The SVG path or drawable shape.',
        required: true,
      },
      {
        name: 'autoplay?',
        type: 'boolean',
        description: 'Starts the draw animation automatically.',
      },
      { name: 'duration?', type: 'number', description: 'Draw duration in milliseconds.' },
    ],
  },
  {
    id: 'anime-morph',
    name: 'AnimeMorph',
    signature: '<AnimeMorph to="...">',
    description:
      'Morphs a supported SVG path to a new shape using the shared SVG animation lifecycle.',
    usage: `import { AnimeMorph } ${localImport}`,
    example: `<AnimeMorph\n  to="M10 10 H90 V90 H10 Z"\n  duration={700}\n>\n  <path d="M50 10 L90 90 H10 Z" />\n</AnimeMorph>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The SVG path to morph.',
        required: true,
      },
      {
        name: 'to',
        type: 'string | SVGPathElement',
        description: 'Destination path data or target path.',
        required: true,
      },
      { name: 'duration?', type: 'number', description: 'Morph duration in milliseconds.' },
    ],
  },
  {
    id: 'anime-motion-path',
    name: 'AnimeMotionPath',
    signature: '<AnimeMotionPath path="...">',
    description:
      'Moves an SVG element along an SVG path while exposing the familiar playback controls through its ref.',
    usage: `import { AnimeMotionPath } ${localImport}`,
    example: `<AnimeMotionPath\n  path="#orbit"\n  duration={1600}\n>\n  <circle r="6" />\n</AnimeMotionPath>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The SVG element to move.',
        required: true,
      },
      {
        name: 'path',
        type: 'string | SVGPathElement',
        description: 'Motion path selector or SVG path element.',
        required: true,
      },
      {
        name: 'rotate?',
        type: 'boolean | number',
        description: 'Rotates the target along the path.',
      },
    ],
  },
  {
    id: 'anime-presence',
    name: 'AnimePresence',
    signature: '<AnimePresence mode="sync">',
    description:
      'Coordinates enter and exit animation for keyed direct children using AnimePresenceChild.',
    usage: `import { AnimePresence, AnimePresenceChild } ${localImport}`,
    example: `<AnimePresence mode="wait">\n  {open && (\n    <AnimePresenceChild\n      key="panel"\n      enter={{ opacity: [0, 1] }}\n      exit={{ opacity: [1, 0] }}\n    >\n      <Panel />\n    </AnimePresenceChild>\n  )}\n</AnimePresence>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Keyed direct AnimePresenceChild elements.',
        required: true,
      },
      {
        name: 'mode?',
        type: 'sync | wait | popLayout',
        description: 'How exiting and entering children are sequenced.',
      },
      {
        name: 'initial?',
        type: 'boolean',
        description: 'Whether children animate on the first mount.',
      },
      {
        name: 'onExitComplete?',
        type: '() => void',
        description: 'Runs after all exiting children finish.',
      },
    ],
  },
  {
    id: 'anime-presence-child',
    name: 'AnimePresenceChild',
    signature: '<AnimePresenceChild enter={...} exit={...}>',
    description:
      'Defines the enter and exit animation for one keyed child managed by AnimePresence.',
    usage: `import { AnimePresenceChild } ${localImport}`,
    example: `<AnimePresenceChild\n  key="notice"\n  enter={{ opacity: [0, 1] }}\n  exit={{\n    opacity: [1, 0],\n    translateY: 12,\n  }}\n>\n  <Notice />\n</AnimePresenceChild>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The element that enters and exits.',
        required: true,
      },
      {
        name: 'enter?',
        type: 'UseAnimeOptions',
        description: 'Animation properties applied when the child enters.',
      },
      {
        name: 'exit?',
        type: 'UseAnimeOptions',
        description: 'Animation properties applied when the child exits.',
      },
    ],
  },
  {
    id: 'anime-layout',
    name: 'AnimeLayout',
    signature: '<AnimeLayout>{children}</AnimeLayout>',
    description:
      'Declarative FLIP layout container built on useAnimeLayout. Pair it with AnimeLayout.Item for list, grid, and reorder transitions.',
    usage: `import { AnimeLayout } ${localImport}`,
    example: `<AnimeLayout\n  duration={500}\n  autoAnimate\n>\n  {items.map((item) => (\n    <AnimeLayout.Item key={item.id} id={item.id}>\n      <Card item={item} />\n    </AnimeLayout.Item>\n  ))}\n</AnimeLayout>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Layout items, usually AnimeLayout.Item children.',
        required: true,
      },
      {
        name: 'autoAnimate?',
        type: 'boolean',
        description: 'Measures and animates after children change.',
      },
      {
        name: 'enterFrom? / leaveTo?',
        type: 'AnimeLayoutStateParams',
        description: 'Enter and leave transform states.',
      },
      {
        name: 'onReady?',
        type: '(api) => void',
        description: 'Receives the layout ref API after initialisation.',
      },
    ],
  },
  {
    id: 'anime-layout-item',
    name: 'AnimeLayout.Item',
    signature: '<AnimeLayout.Item id="...">',
    description:
      'Registers one stable child with its parent AnimeLayout. The id makes movement across renders identifiable.',
    usage: `import { AnimeLayout } ${localImport}`,
    example: `<AnimeLayout.Item id={item.id}>\n  <Card item={item} />\n</AnimeLayout.Item>`,
    properties: [
      {
        name: 'id',
        type: 'string',
        description: 'Stable item identity used for layout measurement.',
        required: true,
      },
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The layout element to register.',
        required: true,
      },
      { name: 'as?', type: 'ElementType', description: 'Element type used for the item wrapper.' },
    ],
  },
  {
    id: 'anime-timeline',
    name: 'AnimeTimeline',
    signature: '<AnimeTimeline entries={...}>{children}</AnimeTimeline>',
    description:
      'Declarative timeline provider built on useAnimeTimeline. Children can be static or a render function receiving controls and state.',
    usage: `import { AnimeTimeline } ${localImport}`,
    example: `<AnimeTimeline\n  autoplay={false}\n  entries={entries}\n>\n  {({ controls }) => (\n    <button onClick={controls.play}>Play sequence</button>\n  )}\n</AnimeTimeline>`,
    properties: [
      {
        name: 'entries?',
        type: 'TimelineEntry[]',
        description: 'Initial static timeline entries.',
      },
      {
        name: 'children?',
        type: 'ReactNode | (api) => ReactNode',
        description: 'Static content or a render prop for timeline state.',
      },
      {
        name: 'onReady?',
        type: '(api) => void',
        description: 'Runs when the timeline can accept imperative entries.',
      },
      {
        name: 'onStateChange?',
        type: '(state) => void',
        description: 'Receives meaningful timeline state changes.',
      },
    ],
  },
  {
    id: 'anime-waapi',
    name: 'AnimeWAAPI',
    signature: '<AnimeWAAPI {...waapiOptions}>',
    description: 'Declarative Web Animations API component built on useAnimeWAAPI.',
    usage: `import { AnimeWAAPI } ${localImport}`,
    example: `<AnimeWAAPI\n  keyframes={[\n    { opacity: 0 },\n    { opacity: 1 },\n  ]}\n  duration={240}\n>\n  <div>Native animation</div>\n</AnimeWAAPI>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'The element animated with WAAPI.',
        required: true,
      },
      { name: 'keyframes?', type: 'Keyframe[]', description: 'Native Web Animations API frames.' },
      {
        name: 'onReady?',
        type: '(api) => void',
        description: 'Receives controls and the animation instance.',
      },
    ],
  },
  {
    id: 'anime-adapter',
    name: 'AnimeAdapter',
    signature: '<AnimeAdapter id="..." detect={...}>',
    description: 'Registers a custom adapter declaratively and renders no extra DOM node.',
    usage: `import { AnimeAdapter } ${localImport}`,
    example: `<AnimeAdapter id="sprite" detect={(value) => value?.kind === 'sprite'} targets={targets}>\n  <CanvasScene />\n</AnimeAdapter>`,
    properties: [
      { name: 'id', type: 'string', description: 'Stable adapter identifier.', required: true },
      {
        name: 'detect',
        type: '(value) => boolean',
        description: 'Identifies values managed by this adapter.',
        required: true,
      },
      {
        name: 'targets',
        type: 'AnimeAdapterTarget[]',
        description: 'Supported custom object properties.',
        required: true,
      },
      {
        name: 'children?',
        type: 'ReactNode',
        description: 'Content rendered inside the registration boundary.',
      },
    ],
  },
  {
    id: 'anime-scope',
    name: 'AnimeScope',
    signature: '<AnimeScope animate={...}>{children}</AnimeScope>',
    description:
      'Declarative scope boundary built on useAnimeScope. It can provide defaults, react to media queries, and expose registered methods.',
    usage: `import { AnimeScope } ${localImport}`,
    example: `<AnimeScope animate={({ animate }) => animate('.item', { opacity: [0, 1] })}>\n  <div className="item" />\n</AnimeScope>`,
    properties: [
      {
        name: 'children',
        type: 'ReactNode | (matches) => ReactNode',
        description: 'Scoped content or a render function receiving media matches.',
        required: true,
      },
      {
        name: 'animate?',
        type: 'AnimeScopeAnimateFn',
        description: 'Runs scoped animation work and can return cleanup.',
      },
      {
        name: 'mediaQueries?',
        type: 'ScopeMediaQueries',
        description: 'Named responsive conditions.',
      },
      {
        name: 'defaults?',
        type: 'ScopeDefaults',
        description: 'Default animation parameters for scoped animations.',
      },
    ],
  },
  {
    id: 'split-text',
    name: 'SplitText',
    signature: '<SplitText params={...}>{children}</SplitText>',
    description:
      'Declarative text splitting component with a ref API for split, revert, refresh, and the TextSplitter instance.',
    usage: `import { SplitText } ${localImport}`,
    example: `<SplitText params={{ chars: true, words: true }} onReady={(split) => console.log(split.chars)}>\n  <h1>Animate every character</h1>\n</SplitText>`,
    properties: [
      {
        name: 'children',
        type: 'ReactElement',
        description: 'A single element containing text.',
        required: true,
      },
      {
        name: 'params?',
        type: 'TextSplitterParams',
        description: 'Anime.js text splitter configuration.',
      },
      {
        name: 'onReady?',
        type: '(split) => void',
        description: 'Runs when split chars, words, or lines are available.',
      },
    ],
  },
  {
    id: 'split-text-entry',
    name: 'SplitTextEntry',
    signature: '<SplitTextEntry splitRef={...} splitMode="chars" />',
    description:
      'Registers one declarative text-animation entry with a parent AnimeTimeline after the splitter is ready.',
    usage: `import { SplitTextEntry } ${localImport}`,
    example: `<SplitTextEntry\n  splitRef={titleRef}\n  splitMode="chars"\n  opacity={[0, 1]}\n  translateY={[20, 0]}\n  stagger={30}\n/>`,
    properties: [
      {
        name: 'splitRef',
        type: 'RefObject<SplitTextRef>',
        description: 'Ref for the SplitText target.',
        required: true,
      },
      {
        name: 'splitMode',
        type: 'chars | words | lines',
        description: 'Which split elements the timeline targets.',
        required: true,
      },
      {
        name: 'stagger?',
        type: 'number',
        description: 'Delay in milliseconds between split elements.',
      },
      {
        name: 'position?',
        type: 'number | string',
        description: 'Timeline position when stagger is not used.',
      },
      { name: 'enabled?', type: 'boolean', description: 'Prevents entry registration when false.' },
    ],
  },
];
