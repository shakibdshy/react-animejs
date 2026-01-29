## Implementation Plan

I'll create a new `ReversedTimerDemo` component that demonstrates the `reversed` timer feature, similar to the vanilla example you provided.

### What the `reversed` option does:
- **`currentTime`**: Always progresses from 0 to duration (never reversed)
- **`iterationCurrentTime`**: Reversed when `reversed: true` (goes from duration to 0)

### Component Features:
1. **Two displays**:
   - Iteration Time (reversed value when `reversed: true`)
   - Current Time (always 0 → duration)

2. **Timer configuration**:
   - Duration: 10,000ms (matches vanilla example)
   - `reversed: true` (key feature to demonstrate)
   - `loop: true` (continuous playback)
   - `autoplay: true` (auto-start)
   - `frameRate: 60` (smooth animation)

3. **Implementation approach**:
   - Use refs for direct DOM manipulation (like vanilla example)
   - Use `onUpdate` callback to update both values
   - Display `iterationCurrentTime` for iteration time
   - Display `currentTime` for current time

4. **Styling**:
   - Match existing demo component styling
   - Use same dark theme with green/indigo colors
   - Use the same container and card layout

### Files to modify:
1. **Create**: `src/lib/react-animejs/demo/components/ReversedTimerDemo.tsx` (new component)
2. **Update**: `src/lib/react-animejs/demo/ReactAnimejsDemo.tsx` (add new demo to grid)