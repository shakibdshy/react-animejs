import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { ScrollScene } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';

/**
 * ScrollScene — the declarative face of the scroll hook. The scene owns the
 * observer lifecycle and hands back three channels:
 *
 *   - refs (`targetRef`, `containerRef`) to wire into your own markup,
 *   - coarse state (`isInView`, `isPinned`, …) safe to render from React,
 *   - `onFrame` for anything per-frame.
 *
 * Here a scrubbed stage stands in for a whole tween list: one `applyFrame`
 * writes transforms straight to the DOM, so scrolling costs zero re-renders.
 */
export function ScrollSceneDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  return (
    <ScrollScene<HTMLDivElement, HTMLDivElement>
      enter={{ target: 'top', container: 'top' }}
      leave={{ target: 'bottom', container: 'bottom' }}
      scrub={0.25}
      onFrame={(progress) => {
        const stage = stageRef.current;
        if (stage) {
          stage.style.transform = `rotateX(${(1 - progress) * 60}deg) scale(${0.65 + progress * 0.35})`;
        }
        if (barRef.current) {
          barRef.current.style.width = `${Math.round(progress * 100)}%`;
        }
        if (pctRef.current) {
          pctRef.current.textContent = `${String(Math.round(progress * 100)).padStart(3, '0')}%`;
        }
      }}
    >
      {({ targetRef, containerRef, controls, isInView, isReady }) => (
        <DemoCard
          title="scrollscene declarative scene"
          description="One scene owns the observer: refs in, coarse state for the badge, and an onFrame callback that writes transforms directly — no React state per scroll tick."
          actions={
            <button
              onClick={() => controls.refresh()}
              className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
              title="Refresh observer"
            >
              <RefreshCw size={16} />
            </button>
          }
          code={`<ScrollScene
  enter={{ target: 'top', container: 'top' }}
  leave={{ target: 'bottom', container: 'bottom' }}
  scrub={0.25}
  onFrame={(progress) => applyFrame(progress)}
>
  {({ targetRef, containerRef, controls, isInView }) => (
    <div ref={containerRef} style={{ height: 300, overflowY: 'auto' }}>
      {/* Tall track = the observed target. */}
      <div ref={targetRef} style={{ height: 420 }}>
        {/* Sticky stage holds still while the track scrolls past. */}
        <div style={{ position: 'sticky', top: 0, height: 300 }}>
          <div ref={stageRef} />
        </div>
      </div>
    </div>
  )}
</ScrollScene>`}
        >
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-demo-text-muted">
                Scroll inside the box
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-cyan-400">
                {isReady ? (isInView ? 'in view' : 'waiting') : 'init…'}
              </span>
            </div>

            <div
              ref={containerRef}
              className="relative h-75 w-full overflow-y-auto overscroll-contain rounded-xl border border-dashed border-white/10 bg-black/20"
            >
              <div className="h-8" />
              {/* Tall track: the observed target. */}
              <div ref={targetRef} className="relative h-105">
                {/* Sticky stage: pinned in place while the track travels. */}
                <div className="sticky top-0 flex h-75 items-center justify-center overflow-hidden">
                  <div className="w-full max-w-64" style={{ perspective: '800px' }}>
                    <div
                      ref={stageRef}
                      className="flex flex-col items-center gap-1 rounded-2xl p-6 will-change-transform"
                      style={{
                        transform: 'rotateX(60deg) scale(0.65)',
                        background: 'linear-gradient(135deg, #22c55e, #15803d)',
                      }}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                        stage
                      </span>
                      <span className="text-lg font-black text-white">ScrollScene</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-8" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  ref={barRef}
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: '0%' }}
                />
              </div>
              <span ref={pctRef} className="text-[10px] tabular-nums text-demo-text-muted">
                000%
              </span>
            </div>
          </div>
        </DemoCard>
      )}
    </ScrollScene>
  );
}
