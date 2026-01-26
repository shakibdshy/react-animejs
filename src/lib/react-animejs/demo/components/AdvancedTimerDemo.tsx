import { useAnimeTimer } from "../../index";
import { DemoSection } from "./DemoSection";

/**
 * Advanced Timer demonstration with LCD display
 * Based on Anime.js createTimer example
 */
export function AdvancedTimerDemo() {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 1000,
    loop: true,
    frameRate: 30, // Custom frame rate as requested
    autoplay: true,
  });

  return (
    <DemoSection title="Advanced Timer (Full Features)">
      <div className="timer-row">
        <div className="timer-col">
          <pre className="log-box">
            <span className="log-label">current time</span>
            <span className="lcd-value">{Math.round(state.currentTime)}</span>
          </pre>
        </div>
        <div className="timer-col">
          <pre className="log-box">
            <span className="log-label">callback fired</span>
            <span className="lcd-value">{state.currentIteration}</span>
          </pre>
        </div>
      </div>

      <div className="demo-controls" style={{ marginTop: "1rem" }}>
        <button onClick={controls.play} disabled={isRunning}>
          ▶️ Play
        </button>
        <button onClick={controls.pause}>⏸️ Pause</button>
        <button
          onClick={() => {
            controls.restart();
          }}
        >
          🔄 Restart
        </button>
      </div>

      <div className="demo-state">
        Frame Rate: 30fps | Progress: {Math.round(state.progress * 100)}%
      </div>
    </DemoSection>
  );
}
