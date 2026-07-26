import { useEffect } from 'react';

interface UseModalA11yOptions {
  /** Whether the modal is currently open. The effect is active only when true. */
  open: boolean;
  /** Called when the user presses Escape. */
  onClose: () => void;
  /** Ref to the modal panel; Tab cycling is constrained to focusable elements inside it. */
  panelRef: React.RefObject<HTMLElement | null>;
  /** Element to focus when the modal opens. Defaults to the first focusable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Encapsulates the keyboard + focus behavior a modal needs:
 * - locks body scroll while open
 * - restores focus to the previously-focused element on close
 * - moves focus into the panel on open (initialFocusRef, else first focusable)
 * - traps Tab within the panel (cycles first/last)
 * - closes on Escape
 *
 * Extracted from CodeModal so the command palette can reuse identical a11y.
 */
export function useModalA11y({
  open,
  onClose,
  panelRef,
  initialFocusRef,
}: UseModalA11yOptions): void {
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      initialFocusRef?.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
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
  }, [open, onClose, panelRef, initialFocusRef]);
}
