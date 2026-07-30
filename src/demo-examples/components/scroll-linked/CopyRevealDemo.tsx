import { useAnimeOnScroll } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';
import { Panel, ScrollHint } from './shared';

export function CopyRevealDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'center center',
    leave: 'center bottom',
  });

  const progress = Math.max(0, Math.min(1, state.progress));

  return (
    <DemoCard
      title="copy aperture"
      description="A headline reveal that opens like a shutter, widens tracking, and sharpens contrast as the observer enters the active zone."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "center center", leave: "center bottom" })`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-150 flex-col items-center justify-center px-6 py-10">
            <div
              ref={ref}
              className="w-full max-w-md text-center"
              style={{
                opacity: 0.22 + progress * 0.78,
                filter: `blur(${(1 - progress) * 8}px)`,
                transition: 'opacity 75ms linear, filter 75ms linear',
              }}
            >
              <div
                className="inline-block"
                style={{
                  clipPath: `inset(0 ${(1 - progress) * 50}% 0 ${(1 - progress) * 50}%)`,
                }}
              >
                <div
                  className="text-3xl font-black uppercase text-demo-accent"
                  style={{ letterSpacing: `${0.1 + progress * 0.22}em` }}
                >
                  Scroll Linked
                </div>
              </div>
              <div className="mt-4 text-sm text-demo-text-secondary">
                Motion, contrast, and typography all respond to the same scroll observer.
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
