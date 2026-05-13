import { memo, useCallback, useState } from 'react';
import { useAnime } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

export const AnimePresencePreview = memo(function AnimePresencePreview(_props: PreviewProps) {
  const [show, setShow] = useState(true);
  const { controls: showControls } = useAnime({
    selector: '.presence-item',
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.9, 1],
    duration: 400,
    ease: 'outBack',
    autoplay: false,
  });
  const { controls: hideControls } = useAnime({
    selector: '.presence-item',
    opacity: [1, 0],
    translateY: [0, -10],
    scale: [1, 0.9],
    duration: 250,
    ease: 'inQuad',
    autoplay: false,
  });

  const handleToggle = useCallback(() => {
    if (show) {
      hideControls.restart();
      setTimeout(() => setShow(false), 250);
    } else {
      setShow(true);
      setTimeout(() => showControls.restart(), 30);
    }
  }, [show, showControls, hideControls]);

  return (
    <PreviewCard
      title="Presence"
      description="AnimatePresence"
      controls={
        <DemoButton onClick={handleToggle} variant="accent" small>
          {show ? 'Hide' : 'Show'}
        </DemoButton>
      }
    >
      <div className="w-20 h-16 flex items-center justify-center">
        {show && (
          <div
            className="presence-item w-16 h-12 rounded-lg flex items-center justify-center text-[11px] font-mono"
            style={{
              backgroundColor: 'var(--color-landing-accent, #e2e0d9)',
              color: 'var(--color-landing-bg, #0a0a0a)',
            }}
          >
            Card
          </div>
        )}
      </div>
    </PreviewCard>
  );
});
