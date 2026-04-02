# Plan: AnimeTimeline + SplitText Integration

## Problem

The `SplitTextBasicDemo` currently:
1. Uses `SplitText` component with `onReady` callback to get split elements
2. Manually imports `createTimeline` and `stagger` from the library
3. Creates a timeline imperatively inside the `onReady` callback

The `AnimeTimeline` component **doesn't work** with `SplitText` because:
- `AnimeTimeline` uses `useAnimeTimeline` hook which runs in a `useEffect` and expects static DOM refs
- `SplitText` creates its split elements (chars, words, lines) asynchronously via `useLayoutEffect`
- By the time `AnimeTimeline` runs, the split elements don't exist yet, so `targets` resolve to nothing

## Solution: `onReady` Callback Pattern

The `AnimeTimeline` component **already has** an `onReady` prop (line 41 of `AnimeTimeline.tsx`). The fix is to use it correctly in combination with `SplitText`'s `onReady`.

### Current working pattern (SplitTextBasicDemo.tsx):
```tsx
import { createTimeline, stagger } from "../../../index";

<SplitText onReady={(split) => {
  const tl = createTimeline({ loop: true, defaults: { ... } });
  tl.add(split.chars, { opacity: [0, 1], translateY: [20, 0] }, stagger(30));
  tl.init();
}}>
  <p>Hello World</p>
</SplitText>
```

### Desired pattern (using only components, no extra imports):
```tsx
import { AnimeTimeline, SplitText } from "../../../components";
import { stagger } from "../../../index";  // stagger is still needed

const [splitRef, setSplitRef] = useState<TextSplitter | null>(null);

<AnimeTimeline
  loop
  defaults={{ ease: "outExpo", duration: 600 }}
  onReady={({ controls }) => {
    if (!splitRef) return;
    controls.add(splitRef.chars, {
      opacity: [0, 1],
      translateY: [20, 0],
    }, stagger(30));
    controls.init();
  }}
>
  {({ controls }) => (
    <SplitText
      onReady={(split) => setSplitRef(split)}
    >
      <p>Hello World</p>
    </SplitText>
  )}
</AnimeTimeline>
```

## Changes Required

### 1. No changes to `AnimeTimeline.tsx` needed
The component already has `onReady` and `onStateChange` callbacks. The timeline is created and ready before children render.

### 2. Update `SplitTextBasicDemo.tsx`
Rewrite the demo to use `AnimeTimeline` component with `onReady` callback pattern instead of importing `createTimeline`.

**Key changes:**
- Remove `createTimeline` import
- Add `AnimeTimeline` component wrapper
- Store split reference in state
- Use `AnimeTimeline`'s `onReady` to add animation entries via `controls.add()`
- Use `controls.init()` to start the timeline

### 3. Tradeoffs
- `stagger` still needs to be imported (it's a utility function, not a component)
- The pattern requires storing the split ref in state to bridge the two async callbacks
- `AnimeTimeline` children can be a render prop function that receives `{ controls, state, ... }`

## Implementation Steps

1. **Update `SplitTextBasicDemo.tsx`**:
   - Replace `createTimeline` import with `AnimeTimeline` component import
   - Add `splitInstance` state to store the `TextSplitter`
   - Wrap content in `<AnimeTimeline>` with `loop`, `defaults`, and `onReady`
   - In `SplitText.onReady`, store the split instance
   - In `AnimeTimeline.onReady`, use `controls.add()` with the split instance and `stagger`
   - Call `controls.init()` to start the timeline
   - Handle cleanup via `AnimeTimeline`'s built-in lifecycle

2. **Verify the pattern works** by checking that:
   - Split elements are available before `controls.add()` is called
   - Timeline loops continuously
   - Mode switching (chars/words/lines) still works with `key` prop

## Note

The fundamental issue is **timing**: `SplitText` creates DOM elements asynchronously, while `AnimeTimeline` expects targets to exist at effect time. The `onReady` pattern solves this by:
1. `AnimeTimeline` creates the timeline first (no targets needed yet)
2. `SplitText` splits the text and stores the instance
3. `AnimeTimeline.onReady` fires and adds the split elements to the already-created timeline
4. `controls.init()` starts the animation

This follows the library's existing patterns (see `TimelineFeaturesDemo.tsx`, `SyncTimelinesDemo.tsx`) and requires no changes to the core components.
