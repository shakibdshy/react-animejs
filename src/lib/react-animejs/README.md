# React Anime.js

A comprehensive React wrapper for [Anime.js v4](https://animejs.com), providing React-friendly hooks and components for creating beautiful animations.

## ✨ Features

- 🎣 **Hooks-first API** - `useAnime`, `useAnimeTimer`, `useAnimeTimeline`, `useAnimeDraggable`
- 🔄 **Automatic cleanup** - Animations are properly cleaned up when components unmount
- 📦 **TypeScript first** - Full type safety with comprehensive types
- 🎯 **Scoped animations** - `AnimeProvider` for isolated animation contexts
- 🎨 **Ready-to-use presets** - fadeIn, scaleIn, bounce, shake, and more
- 🎭 **Declarative components** - `<Animate>` and `<AnimatePresence>`
- 🎮 **Shared controllers** - Control multiple animations with `useAnimeControls`

## 📦 Installation

```bash
npm install animejs
```

The React wrapper is included in your project at `@/lib/react-animejs`.

## 🚀 Quick Start

### Basic Animation

```tsx
import { useAnime } from '@/lib/react-animejs';

function AnimatedBox() {
  const { ref, controls, state } = useAnime({
    translateX: 250,
    rotate: '1turn',
    duration: 1000,
  });

  return (
    <div>
      <div ref={ref} className="box" />
      <button onClick={controls.play}>Play</button>
      <p>Progress: {Math.round(state.progress * 100)}%</p>
    </div>
  );
}
```

### Using Presets

```tsx
import { useAnime, fadeInUp } from '@/lib/react-animejs';

function Hero() {
  const { ref } = useAnime({
    ...fadeInUp,
    autoplay: true,
  });

  return <h1 ref={ref}>Welcome!</h1>;
}
```

### Declarative Component

```tsx
import { Animate, popIn } from '@/lib/react-animejs';

function Card() {
  return (
    <Animate {...popIn} autoplay>
      <div className="card">Hello!</div>
    </Animate>
  );
}
```

## 📚 API Reference

### Hooks

#### `useAnime(options)`

Main hook for creating animations.

```tsx
const { ref, controls, state, animation, isPlaying, isReady } = useAnime({
  // Animation properties
  translateX: [0, 250],
  rotate: '1turn',
  scale: [1, 1.5, 1],
  opacity: [0, 1],
  
  // Playback settings
  duration: 1000,
  delay: 0,
  loop: false,
  alternate: true,
  ease: 'outQuad',
  autoplay: false,
  
  // Callbacks
  onBegin: (anim) => console.log('Started'),
  onComplete: (anim) => console.log('Finished'),
  onUpdate: (anim) => console.log(anim.progress),
});
```

**Returns:**
- `ref` - Ref to attach to the target element
- `controls` - Playback methods (play, pause, restart, etc.)
- `state` - Reactive animation state
- `animation` - Raw anime.js instance
- `isPlaying` - Boolean indicating play state
- `isReady` - Boolean indicating if animation is initialized

---

#### `useAnimeTimer(options)`

Create a synchronized timer for coordinated effects.

```tsx
const { controls, state, isRunning, timer } = useAnimeTimer({
  duration: 1000,
  loop: true,
  onLoop: () => console.log('Loop!'),
  onUpdate: (t) => console.log(t.currentTime),
});
```

---

#### `useAnimeTimeline(options, entries)`

Create sequenced animations with precise timing.

```tsx
const box1Ref = useRef(null);
const box2Ref = useRef(null);

const { controls, state, add } = useAnimeTimeline(
  { duration: 2000 },
  [
    { targets: box1Ref, translateX: 250, offset: 0 },
    { targets: box2Ref, scale: 2, offset: '+=500' },
    { targets: box1Ref, rotate: 360, offset: '-=200' },
  ]
);
```

**Offset syntax:**
- `0` - Absolute time in ms
- `'+=500'` - 500ms after previous animation ends
- `'-=200'` - 200ms before previous animation ends

---

#### `useAnimeDraggable(options)`

Make elements draggable with physics-based animations.

```tsx
const { ref, isDragging, position, setPosition, reset } = useAnimeDraggable({
  container: [0, 0, 500, 500], // [minX, minY, maxX, maxY]
  axis: 'x', // or 'y' or undefined for both
  snap: { x: 50, y: 50 }, // Snap to grid
  releaseEase: 'spring(1, 80, 10)',
  onDrag: (d) => console.log(d.x, d.y),
});
```

---

#### `useAnimeControls()`

Create a shared controller for multiple animations.

```tsx
const controller = useAnimeControls();

const { ref: ref1 } = useAnime({ translateX: 100, controller });
const { ref: ref2 } = useAnime({ translateY: 100, controller });

// Control all animations together
controller.play();
controller.pause();
controller.restart();
```

---

### Components

#### `<AnimeProvider>`

Scopes animations for automatic cleanup and selector isolation.

```tsx
<AnimeProvider>
  <YourComponents />
</AnimeProvider>
```

---

#### `<Animate>`

Declarative animation wrapper.

```tsx
<Animate
  translateY={[-50, 0]}
  opacity={[0, 1]}
  duration={800}
  autoplay
  onControlsReady={(controls) => console.log(controls)}
>
  <div>Animated content</div>
</Animate>
```

---

#### `<AnimatePresence>`

Handle enter/exit animations for mounting/unmounting components.

```tsx
<AnimatePresence>
  {isVisible && (
    <AnimatePresenceChild
      key="modal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      duration={300}
    >
      <div className="modal">Modal content</div>
    </AnimatePresenceChild>
  )}
</AnimatePresence>
```

---

### Presets

Ready-to-use animation configurations:

```tsx
import {
  fadeIn, fadeOut, fadeInUp, fadeInDown, fadeInLeft, fadeInRight,
  scaleIn, scaleOut, popIn,
  slideInTop, slideInBottom, slideInLeft, slideInRight,
  pulse, bounce, shake, wiggle, heartbeat,
  flipInX, flipInY, rotateIn, spin,
} from '@/lib/react-animejs';

// Use with spread
const { ref } = useAnime({ ...fadeInUp, autoplay: true });
```

---

### Stagger Helpers

Utilities for staggered animations:

```tsx
import {
  simpleStagger,
  staggerFromCenter,
  staggerFromLast,
  gridStagger,
  rippleStagger,
  easedStagger,
  randomStagger,
} from '@/lib/react-animejs';

// Apply to delay
const { ref } = useAnime({
  targets: '.item',
  translateY: [50, 0],
  delay: simpleStagger(100), // 100ms between each
});

// Grid stagger for grid layouts
delay: gridStagger(50, 4, 3) // 50ms, 4 columns, 3 rows
```

---

## 🎯 Easing Functions

Anime.js v4 provides powerful easing:

```tsx
// Built-in easings
ease: 'linear'
ease: 'outQuad'
ease: 'inOutExpo'
ease: 'outElastic(1, 0.5)'
ease: 'outBounce'

// Spring physics
ease: 'spring(mass, stiffness, damping)'
ease: 'spring(1, 80, 10)'

// Power functions
ease: 'out(3)'
ease: 'inOut(2)'

// Custom cubic bezier
ease: 'cubicBezier(0.4, 0, 0.2, 1)'

// Steps
ease: 'steps(5)'
```

---

## 💡 Tips & Best Practices

### 1. Use `autoplay: false` by default

Unlike vanilla anime.js, hooks default to `autoplay: false` for better control:

```tsx
const { ref, controls } = useAnime({
  translateX: 100,
  // autoplay: false is the default
});

// Manually trigger when ready
useEffect(() => {
  controls.play();
}, []);
```

### 2. Leverage dependency arrays

Re-run animations when values change:

```tsx
const { ref } = useAnime({
  translateX: position,
  deps: [position], // Re-creates animation when position changes
});
```

### 3. Use AnimeProvider for scoping

Wrap related animations for automatic cleanup:

```tsx
function Modal() {
  return (
    <AnimeProvider>
      <ModalContent />
    </AnimeProvider>
  );
}
```

### 4. Avoid updating state in onUpdate

`onUpdate` fires every frame - avoid React state updates:

```tsx
// ❌ Bad - causes re-renders every frame
onUpdate: (anim) => setProgress(anim.progress)

// ✅ Good - use CSS variables or refs
onUpdate: (anim) => {
  ref.current?.style.setProperty('--progress', anim.progress);
}
```

---

## 📄 License

MIT License - Use freely in your projects!

---

## 🔗 Resources

- [Anime.js v4 Documentation](https://animejs.com)
- [Anime.js GitHub](https://github.com/juliangarnier/anime)
