## Implementation Plan

### 1. New Demo Component: TimerCallbacksDemo

* Create a new component [TimerCallbacksDemo.tsx](file:///Users/shakib/Documents/Programming/Experiments/react-animejs/src/lib/react-animejs/demo/components/TimerCallbacksDemo.tsx) that logs lifecycle events.

* Implement `onBegin`, `onUpdate`, `onLoop`, `onPause`, and `onComplete` callbacks.

* Demonstrate the `.then()` Promise resolving after multiple loops (`loop: 2`).

* Read This link for better context:

* <https://animejs.com/documentation/timer/timer-callbacks>

* <https://animejs.com/documentation/timer/timer-callbacks/onbegin>

* <https://animejs.com/documentation/timer/timer-callbacks/oncomplete>

* <https://animejs.com/documentation/timer/timer-callbacks/onupdate>

* <https://animejs.com/documentation/timer/timer-callbacks/onloop>

* <https://animejs.com/documentation/timer/timer-callbacks/onpause>

* <https://animejs.com/documentation/timer/timer-callbacks/then>

### 2. Update Main Demo Page

* Import and add `TimerCallbacksDemo` to the grid layout in [ReactAnimejsDemo.tsx](file:///Users/shakib/Documents/Programming/Experiments/react-animejs/src/lib/react-animejs/demo/ReactAnimejsDemo.tsx).

### 3. Refine Documentation

* Update TSDoc comments in [timer.ts](file:///Users/shakib/Documents/Programming/Experiments/react-animejs/src/lib/react-animejs/types/timer.ts) for `UseAnimeTimerOptions` to align with the provided descriptions.

* Ensure the `onUpdate` documentation specifically mentions the `frameRate` dependency.

### 4. Code Verification

* Review the callback wrapping logic in [use-anime-timer.ts](file:///Users/shakib/Documents/Programming/Experiments/react-animejs/src/lib/react-animejs/hooks/use-anime-timer.ts) to ensure the `timer` instance is passed correctly to user-provided callbacks.

