# React Anime.js Wrapper Library - Implementation Plan

## 🎯 Vision

Create a comprehensive, type-safe React wrapper library for Anime.js 4.x that provides:
- **Declarative API** - React-idiomatic hooks and components
- **Full Feature Parity** - All Anime.js features accessible through React patterns
- **Performance Optimized** - Proper cleanup, memoization, and scoping
- **Developer Experience** - Excellent TypeScript support, intuitive API design

---

## 📚 API Surface Analysis (Anime.js 4.x)

Based on the documentation, here's the complete API surface we need to wrap:

### Core Functions
| Function                           | Description                                     |
| ---------------------------------- | ----------------------------------------------- |
| `animate(targets, params)`         | Main animation function → Returns `JSAnimation` |
| `createTimer(params)`              | Timer/interval replacement → Returns `Timer`    |
| `createTimeline(params)`           | Timeline for sequencing → Returns `Timeline`    |
| `createScope({ root })`            | Scoping for React integration                   |
| `createDraggable(targets, params)` | Draggable elements                              |
| `waapi.animate()`                  | Lightweight WAAPI version                       |

### Playback Settings (Shared by Timer, Animation, Timeline)
| Setting        | Type                | Default | Description                 |
| -------------- | ------------------- | ------- | --------------------------- |
| `delay`        | `number`            | `0`     | Delay before start          |
| `duration`     | `number`            | `1000`  | Duration in ms              |
| `loop`         | `boolean \| number` | `false` | Loop count or infinite      |
| `loopDelay`    | `number`            | `0`     | Delay between loops         |
| `alternate`    | `boolean`           | `false` | Alternate direction on loop |
| `reversed`     | `boolean`           | `false` | Play in reverse             |
| `autoplay`     | `boolean`           | `true`  | Auto-start on creation      |
| `frameRate`    | `number`            | `null`  | Target frame rate           |
| `playbackRate` | `number`            | `1`     | Speed multiplier            |

### Callbacks
| Callback     | Description                               |
| ------------ | ----------------------------------------- |
| `onBegin`    | Fires when animation begins (after delay) |
| `onComplete` | Fires when animation completes            |
| `onUpdate`   | Fires on every frame                      |
| `onLoop`     | Fires at the end of each loop             |
| `onPause`    | Fires when paused                         |
| `then()`     | Promise-based completion                  |

### Methods (Timer & Animation)
| Method              | Description                             |
| ------------------- | --------------------------------------- |
| `play()`            | Start/resume playback                   |
| `pause()`           | Pause playback                          |
| `resume()`          | Resume from pause                       |
| `restart()`         | Restart from beginning                  |
| `reverse()`         | Reverse direction                       |
| `alternate()`       | Toggle direction                        |
| `complete()`        | Jump to end                             |
| `reset()`           | Reset to initial state                  |
| `cancel()`          | Cancel and reset                        |
| `revert()`          | Cancel and cleanup (critical for React) |
| `seek(time)`        | Seek to specific time                   |
| `stretch(duration)` | Change duration dynamically             |

### Properties (Read-only)
| Property      | Type      | Description        |
| ------------- | --------- | ------------------ |
| `id`          | `string`  | Unique identifier  |
| `progress`    | `number`  | Progress 0-1       |
| `currentTime` | `number`  | Current time in ms |
| `duration`    | `number`  | Total duration     |
| `paused`      | `boolean` | Is paused          |
| `began`       | `boolean` | Has begun          |
| `completed`   | `boolean` | Is completed       |
| `reversed`    | `boolean` | Is reversed        |

---

## 🏗️ Architecture Design

### Directory Structure

```
src/
├── lib/
│   └── react-animejs/
│       ├── index.ts                    # Main entry point (re-exports)
│       │
│       ├── types/
│       │   ├── index.ts                # Type re-exports
│       │   ├── common.ts               # Shared types (PlaybackSettings, Callbacks)
│       │   ├── animation.ts            # Animation-specific types
│       │   ├── timer.ts                # Timer-specific types
│       │   ├── timeline.ts             # Timeline-specific types
│       │   └── draggable.ts            # Draggable types
│       │
│       ├── core/
│       │   ├── scope-context.tsx       # React Context for scope management
│       │   ├── use-scope.ts            # Internal scope hook
│       │   └── constants.ts            # Default values, config
│       │
│       ├── hooks/
│       │   ├── use-anime.ts            # Main animation hook
│       │   ├── use-anime-timeline.ts   # Timeline hook
│       │   ├── use-anime-timer.ts      # Timer hook
│       │   ├── use-anime-draggable.ts  # Draggable hook
│       │   ├── use-anime-controls.ts   # Playback controls hook
│       │   └── use-animation-state.ts  # State subscription hook
│       │
│       ├── components/
│       │   ├── AnimeProvider.tsx       # Scope provider component
│       │   ├── Animate.tsx             # Declarative animation component
│       │   └── AnimatePresence.tsx     # Enter/exit animations
│       │
│       └── utils/
│           ├── helpers.ts              # Utility functions
│           └── stagger-helpers.ts      # Stagger pattern helpers
```

---

## 🎣 Hook API Design

### 1. `useAnime` - Main Animation Hook

The primary hook for creating animations. This is the most important hook.

```tsx
import { useAnime } from '@/lib/react-animejs';

function MyComponent() {
  const { ref, controls, state } = useAnime({
    // Target options (alternative to ref)
    selector: '.box', // Optional: CSS selector within scope
    
    // Animation properties (what to animate)
    translateX: 250,
    rotate: '1turn',
    scale: 1.5,
    
    // Playback settings
    duration: 1000,
    delay: 200,
    loop: true,
    alternate: true,
    autoplay: false, // Default to false for React (user controls)
    
    // Callbacks
    onBegin: (anim) => console.log('Started'),
    onComplete: (anim) => console.log('Done'),
    onUpdate: (anim) => console.log(anim.progress),
  });

  return (
    <div ref={ref} className="box">
      <button onClick={controls.play}>Play</button>
      <button onClick={controls.pause}>Pause</button>
      <p>Progress: {state.progress}</p>
    </div>
  );
}
```

**Returns:**
```ts
interface UseAnimeReturn<T extends HTMLElement = HTMLElement> {
  // Ref to attach to target element
  ref: RefObject<T>;
  
  // Playback controls
  controls: {
    play: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    reverse: () => void;
    complete: () => void;
    reset: () => void;
    cancel: () => void;
    seek: (time: number | string) => void;
    setPlaybackRate: (rate: number) => void;
  };
  
  // Reactive state (automatically updated)
  state: {
    progress: number;
    currentTime: number;
    paused: boolean;
    began: boolean;
    completed: boolean;
    reversed: boolean;
  };
  
  // Raw animation instance (escape hatch)
  animation: JSAnimation | null;
}
```

---

### 2. `useAnimeTimeline` - Timeline Hook

For sequencing multiple animations:

```tsx
import { useAnimeTimeline } from '@/lib/react-animejs';

function Sequence() {
  const boxRef = useRef(null);
  const circleRef = useRef(null);
  
  const { controls, state } = useAnimeTimeline({
    duration: 2000,
    loop: true,
  }, [
    // Timeline entries
    { targets: boxRef, translateX: 250, offset: 0 },
    { targets: circleRef, scale: 2, offset: '+=500' },
    { targets: boxRef, rotate: 360, offset: '-=200' },
  ]);

  return (
    <div>
      <div ref={boxRef} className="box" />
      <div ref={circleRef} className="circle" />
      <button onClick={controls.play}>Play Sequence</button>
    </div>
  );
}
```

---

### 3. `useAnimeTimer` - Timer Hook

React-friendly replacement for `setTimeout`/`setInterval`:

```tsx
import { useAnimeTimer } from '@/lib/react-animejs';

function CountdownTimer() {
  const [count, setCount] = useState(0);
  
  const { controls, state } = useAnimeTimer({
    duration: 1000,
    loop: 10, // Run 10 times
    onLoop: (timer) => setCount(c => c + 1),
    onComplete: () => alert('Timer complete!'),
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>Time: {state.currentTime}ms</p>
      <button onClick={controls.pause}>Pause</button>
    </div>
  );
}
```

---

### 4. `useAnimeDraggable` - Draggable Hook

```tsx
import { useAnimeDraggable } from '@/lib/react-animejs';

function DraggableCard() {
  const { ref, isDragging, position } = useAnimeDraggable({
    container: [0, 0, 0, 0], // Bounds
    releaseEase: 'spring(0.7)',
    onDrag: (draggable) => console.log(draggable.x, draggable.y),
    onRelease: () => console.log('Released'),
  });

  return (
    <div 
      ref={ref} 
      className={`card ${isDragging ? 'dragging' : ''}`}
    >
      Drag me!
    </div>
  );
}
```

---

### 5. `useAnimeControls` - Shared Controls Hook

For external control of multiple animations:

```tsx
import { useAnimeControls, useAnime } from '@/lib/react-animejs';

function ControlledAnimations() {
  const controls = useAnimeControls();
  
  const { ref: ref1 } = useAnime({ 
    translateX: 100, 
    controller: controls 
  });
  
  const { ref: ref2 } = useAnime({ 
    translateY: 100, 
    controller: controls 
  });

  return (
    <div>
      <div ref={ref1} />
      <div ref={ref2} />
      {/* Single button controls both animations */}
      <button onClick={() => controls.play()}>Play All</button>
    </div>
  );
}
```

---

## 🧱 Component API Design

### 1. `AnimeProvider` - Scope Provider

Provides scoped animation context:

```tsx
import { AnimeProvider } from '@/lib/react-animejs';

function App() {
  return (
    <AnimeProvider>
      {/* All animations inside are automatically scoped */}
      <MyAnimatedComponents />
    </AnimeProvider>
  );
}
```

---

### 2. `<Animate>` - Declarative Component

For simple, declarative animations:

```tsx
import { Animate } from '@/lib/react-animejs';

function Hero() {
  return (
    <Animate
      translateY={[-50, 0]}
      opacity={[0, 1]}
      duration={800}
      easing="outExpo"
    >
      <h1>Hello World</h1>
    </Animate>
  );
}
```

---

### 3. `<AnimatePresence>` - Enter/Exit Animations

For mount/unmount animations:

```tsx
import { AnimatePresence, Animate } from '@/lib/react-animejs';

function Modal({ isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Animate
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          duration={300}
        >
          <div className="modal">Content</div>
        </Animate>
      )}
    </AnimatePresence>
  );
}
```

---

## 📝 Type Definitions

### Shared Types (`types/common.ts`)

```ts
// Playback settings shared by Timer, Animation, Timeline
export interface PlaybackSettings {
  delay?: number;
  duration?: number;
  loop?: boolean | number;
  loopDelay?: number;
  alternate?: boolean;
  reversed?: boolean;
  autoplay?: boolean;
  frameRate?: number;
  playbackRate?: number;
}

// Callbacks shared by all instances
export interface AnimationCallbacks<T = any> {
  onBegin?: (instance: T) => void;
  onComplete?: (instance: T) => void;
  onUpdate?: (instance: T) => void;
  onLoop?: (instance: T) => void;
  onPause?: (instance: T) => void;
}

// Playback controls returned by hooks
export interface PlaybackControls {
  play: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  reverse: () => void;
  alternate: () => void;
  complete: () => void;
  reset: () => void;
  cancel: () => void;
  seek: (time: number | string) => void;
  stretch: (duration: number) => void;
}

// Animation state
export interface AnimationState {
  id: string;
  progress: number;
  currentTime: number;
  duration: number;
  paused: boolean;
  began: boolean;
  completed: boolean;
  reversed: boolean;
}
```

---

## 🔧 Implementation Strategy

### Phase 1: Core Infrastructure
1. **Type definitions** - Complete TypeScript types for all APIs
2. **Scope Context** - `AnimeProvider` and internal scope management
3. **`useAnime` hook** - Main animation hook with full features

### Phase 2: Extended Hooks
4. **`useAnimeTimer`** - Timer functionality
5. **`useAnimeTimeline`** - Timeline sequencing
6. **`useAnimeDraggable`** - Draggable elements
7. **`useAnimeControls`** - Shared controller pattern

### Phase 3: Components
8. **`<Animate>`** - Declarative animation wrapper
9. **`<AnimatePresence>`** - Enter/exit animations

### Phase 4: Utilities & Polish
10. **Stagger helpers** - Convenient stagger patterns
11. **Preset animations** - Common animation presets
12. **Documentation** - Full API documentation

---

## ⚡ Performance Considerations

1. **Scope Cleanup** - Always call `revert()` in useEffect cleanup
2. **Ref Stability** - Use `useRef` for animation instances to prevent recreation
3. **Callback Memoization** - Wrap callbacks in `useCallback` to prevent re-initialization
4. **State Updates** - Use `onUpdate` sparingly as it triggers re-renders
5. **Batch Updates** - Use React 18's automatic batching for state updates

---

## 🚀 Getting Started (Implementation Order)

1. Start with `types/common.ts` - Define all shared types
2. Create `core/scope-context.tsx` - Scope provider and context
3. Implement `hooks/use-anime.ts` - The most important hook
4. Add `hooks/use-anime-timer.ts` - Timer hook
5. Build `components/Animate.tsx` - Declarative component
6. Iterate and add remaining features

---

## 📦 Export Strategy

```ts
// src/lib/react-animejs/index.ts

// Hooks
export { useAnime } from './hooks/use-anime';
export { useAnimeTimer } from './hooks/use-anime-timer';
export { useAnimeTimeline } from './hooks/use-anime-timeline';
export { useAnimeDraggable } from './hooks/use-anime-draggable';
export { useAnimeControls } from './hooks/use-anime-controls';
export { useAnimationState } from './hooks/use-animation-state';

// Components
export { AnimeProvider } from './components/AnimeProvider';
export { Animate } from './components/Animate';
export { AnimatePresence } from './components/AnimatePresence';

// Types
export type { 
  PlaybackSettings,
  AnimationCallbacks,
  PlaybackControls,
  AnimationState,
  UseAnimeOptions,
  UseAnimeReturn,
  // ... etc
} from './types';

// Re-export useful anime.js utilities
export { stagger, spring, easing } from 'animejs';
```

---

## ✅ Success Criteria

- [ ] Full TypeScript type safety
- [ ] Zero memory leaks (proper cleanup)
- [ ] Intuitive, React-idiomatic API
- [ ] All Anime.js features accessible
- [ ] Comprehensive documentation
- [ ] Unit tests for all hooks
- [ ] Examples for common use cases
