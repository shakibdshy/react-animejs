## Implementation Plan

I'll create a new `PlaybackRateDemo` component that demonstrates the `playbackRate` timer feature.

### What the `playbackRate` option does:
- Speed multiplier for timer playback (1.0 = normal speed)
- Values > 1.0 speed up the timer
- Values < 1.0 slow down the timer
- Value of 0 stops the timer
- Can be modified dynamically via `timer.speed` property

### Component Features:
1. **Timer display**:
   - Current time display showing the effect of playback rate
   - Real-time playback rate indicator

2. **Playback rate controls**:
   - Slider control for easy adjustment (0.1x to 3.0x)
   - Quick preset buttons (0.5x, 1x, 2x)
   - Reset button to return to normal speed

3. **Timer configuration**:
   - Duration: 10,000ms (long enough to see speed changes)
   - `loop: true` (continuous playback)
   - `autoplay: true` (auto-start)
   - `frameRate: 60` (smooth animation)

4. **Implementation approach**:
   - Use refs for direct DOM manipulation (smooth animation)
   - Use `controls.setPlaybackRate()` method for dynamic speed changes
   - Show current playback rate value
   - Display how speed affects the timer progression

5. **Styling**:
   - Match existing demo component styling
   - Use slider for playback rate control
   - Add visual feedback for current speed

### Files to modify:
1. **Create**: `src/lib/react-animejs/demo/components/PlaybackRateDemo.tsx` (new component)
2. **Update**: `src/lib/react-animejs/demo/ReactAnimejsDemo.tsx` (add new demo to grid)