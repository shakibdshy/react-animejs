import { memo, useEffect, useRef, useState } from 'react';
import { AnimePresence, AnimePresenceChild } from '@shakibdshy/react-animejs';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

interface ToastItem {
  id: number;
  message: string;
}

const TOAST_MESSAGES = ['Saved successfully', 'Settings updated', 'Welcome back ✦', 'Item copied'];

export const ToastPreview = memo(function ToastPreview(_props: PreviewProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timeoutIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;
    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.clear();
    };
  }, []);

  const pushToast = () => {
    const id = ++idRef.current;
    setToasts((current) => [
      ...current,
      { id, message: TOAST_MESSAGES[id % TOAST_MESSAGES.length] },
    ]);

    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
    timeoutIdsRef.current.add(timeoutId);
  };

  const dismiss = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <PreviewCard
      title="Toast"
      description="Click to push a notification"
      controls={
        <DemoButton onClick={pushToast} variant="accent" small>
          Push toast
        </DemoButton>
      }
    >
      <div className="relative w-full min-h-40 flex items-center justify-center">
        {toasts.length === 0 && (
          <span className="landing-font-mono text-[11px] text-landing-muted/60">
            No notifications
          </span>
        )}
        <div className="absolute bottom-0 right-0 flex flex-col gap-2 items-end w-44">
          <AnimePresence mode="popLayout">
            {toasts.map((toast) => (
              <AnimePresenceChild
                key={toast.id}
                enter={{ opacity: [0, 1], translateX: [40, 0], scale: [0.9, 1] }}
                exit={{ opacity: [1, 0], translateX: [0, 40], scale: [1, 0.9] }}
                duration={300}
                ease="outExpo"
              >
                <div className="w-full flex items-center justify-between gap-2 rounded-lg border border-landing-border bg-landing-surface px-3 py-2 shadow-lg">
                  <span className="text-xs text-landing-fg">{toast.message}</span>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="text-landing-muted hover:text-landing-accent text-xs"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </AnimePresenceChild>
            ))}
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});
