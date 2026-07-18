/**
 * CodeModal — a smoothly-animated modal that shows a code snippet with copy.
 *
 * Open/close is animated with react-animejs `AnimePresence` + `AnimePresenceChild`:
 * the backdrop fades and the panel scales/translates in, and both reverse on
 * close. The body uses the shared `CodeBlock` (prism syntax highlighting), and a
 * copy button writes the exact source to the clipboard.
 *
 * Escape closes; clicking outside the panel (the backdrop) closes.
 */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
import { CodeBlock } from '@/demos/components/code-block';

export interface CodeModalProps {
  open: boolean;
  title: string;
  code: string;
  /** Language hint for syntax highlighting. */
  language?: string;
  onClose: () => void;
}

export const CodeModal = memo(function CodeModal({
  open,
  title,
  code,
  language = 'tsx',
  onClose,
}: CodeModalProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copyResetTimerRef = useRef<number | null>(null);

  // Keep keyboard focus inside the modal, restore it on close, and prevent the
  // document behind the dialog from scrolling.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  // Reset copied state whenever the snippet changes / modal reopens.
  useEffect(() => {
    setCopied(false);
  }, [title, open]);

  useEffect(
    () => () => {
      if (copyResetTimerRef.current !== null) window.clearTimeout(copyResetTimerRef.current);
    },
    [],
  );

  const showCopied = useCallback(() => {
    if (copyResetTimerRef.current !== null) window.clearTimeout(copyResetTimerRef.current);
    setCopied(true);
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyResetTimerRef.current = null;
    }, 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      showCopied();
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showCopied();
      } catch {
        /* clipboard unavailable */
      }
      document.body.removeChild(ta);
    }
  }, [code, showCopied]);

  // Clicking the dim area (outside the panel) closes. Clicks inside the panel
  // stop propagation so they don't bubble up to close.
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close when the click target is the overlay itself, not a child.
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  // The backdrop and panel are DIRECT children of AnimePresence (no fragment),
  // so each is keyed and tracked → enter/exit animations actually fire.
  return (
    <AnimePresence>
      {open && [
        <AnimePresenceChild
          key="code-modal-backdrop"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={220}
          ease="outQuad"
        >
          <div className="fixed inset-0 z-1000 bg-black/60 backdrop-blur-sm" aria-hidden />
        </AnimePresenceChild>,
        <AnimePresenceChild
          key="code-modal-panel"
          enter={{ opacity: [0, 1], scale: [0.94, 1], translateY: [18, 0] }}
          exit={{ opacity: [1, 0], scale: [1, 0.96], translateY: [0, 8] }}
          duration={300}
          ease="outExpo"
        >
          <div
            ref={dialogRef}
            className="fixed inset-0 z-1001 flex items-center justify-center overscroll-contain p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} source code`}
            onClick={handleBackdropClick}
          >
            <div className="cm-panel relative flex max-h-[82vh] w-[min(900px,92vw)] flex-col overflow-hidden rounded-2xl border border-landing-border bg-landing-surface shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 border-b border-landing-border bg-landing-bg/60 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                  </span>
                  <span className="truncate landing-font-mono text-xs text-landing-fg">
                    {title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-surface px-3 py-1.5 landing-font-mono text-[11px] font-semibold uppercase tracking-widest text-landing-muted transition-all hover:border-landing-accent hover:text-landing-accent"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-landing-border bg-landing-surface text-landing-muted transition-all hover:border-red-500 hover:text-red-400"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Code body — dark surface with a matching dark scrollbar. */}
              <div className="cm-scroll bg-[#0b0b10] px-2 py-3 text-[12.5px] leading-[1.55]">
                <CodeBlock code={code} language={language} />
              </div>
              <span className="sr-only" aria-live="polite">
                {copied ? 'Code copied to clipboard.' : ''}
              </span>
            </div>
          </div>
        </AnimePresenceChild>,
      ]}
    </AnimePresence>
  );
});

export default CodeModal;
