/**
 * GridFlipModal — a faithful port of the official anime.js "Modal dialog
 * animation" demo to React, using the enhanced AnimeLayout component with
 * its `root` prop.
 *
 * KEY PATTERN (matches official demo):
 * - The `<dialog>` is the **layout root** (via `<AnimeLayout root={dialogRef}>`)
 * - Grid items live outside the dialog but inside the AnimeLayout wrapper
 * - On click, a **clone** of the grid item is appended into the dialog
 * - anime.js correlates old → new position via matching `data-layout-id`
 *   attributes and FLIP-animates the transition
 * - The original grid item is hidden with an `is-open` class
 * - On close, `dialog.close()` + removing `is-open` is called inside
 *   `layout.update()` so anime.js captures the reverse FLIP
 */
import { memo, useCallback, useRef } from 'react';
import { AnimeLayout } from '@/lib/react-animejs';
import type { AnimeLayoutRef } from '@/lib/react-animejs';

/** Six portrait sources (stable seeds so each tile is a distinct image). */
const img = (seed: string, w = 600, h = 750) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const TILES = [
  { src: img('flip-grid-14'), label: 'Item A', duration: 500 },
  { src: img('flip-grid-1'), label: 'Item B', duration: 700 },
  { src: img('flip-grid-12'), label: 'Item C', duration: 900 },
  { src: img('flip-grid-2'), label: 'Item D', duration: 600 },
  { src: img('flip-grid-4'), label: 'Item E', duration: 800 },
  { src: img('flip-grid-8'), label: 'Item F', duration: 1000 },
];

export const GridFlipModal = memo(function GridFlipModal({
  className = '',
}: {
  className?: string;
}) {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const closeModal = useCallback(() => {
    const dialog = dialogRef.current;
    const layout = layoutRef.current;
    if (!dialog || !layout) return;

    layout.update(() => {
      dialog.close();
      const openItem = buttonsRef.current.find((btn) => btn.classList.contains('is-open'));
      if (openItem) {
        openItem.classList.remove('is-open');
        openItem.focus();
      }
    });
  }, []);

  const openModal = useCallback((button: HTMLButtonElement) => {
    const dialog = dialogRef.current;
    const layout = layoutRef.current;
    if (!dialog || !layout) return;

    // Clone the clicked grid item (exactly like the official demo).
    // anime.js correlates the original (outside dialog) with the clone
    // (inside dialog) via matching data-layout-id attributes.
    const clone = button.cloneNode(true) as HTMLElement;
    dialog.innerHTML = ''; // Remove old clones
    dialog.appendChild(clone);

    const duration = Number(button.dataset.duration) || 700;

    layout.update(
      () => {
        dialog.showModal();
        button.classList.add('is-open');
      },
      {
        duration,
      }
    );
  }, []);

  const registerButton = useCallback((el: HTMLButtonElement | null, idx: number) => {
    if (el) {
      buttonsRef.current[idx] = el;
    }
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg ${className}`}
    >
      <div className="p-6">
        <p className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-accent">
          Grid Flip · Modal
        </p>
        <h3 className="landing-font-display mt-1 text-base font-bold text-landing-fg">
          Click a tile · it flips into the modal
        </h3>
      </div>

      {/*
        Minimal CSS that Tailwind can't handle:
        - `::backdrop` pseudo-element
        - `color-mix()` for animated --overlay-alpha
        - `[open]` attribute selectors on the dialog
        - `.is-open` class for hiding the original grid item
      */}
      <style>{`
        .grid-flip-dialog {
          --overlay-alpha: 100%;
          background-color: color-mix(in srgb, #000, transparent var(--overlay-alpha));
        }
        .grid-flip-dialog[open] {
          --overlay-alpha: 35%;
        }
        .grid-flip-dialog::backdrop {
          background: transparent;
        }
        .grid-flip-dialog .grid-flip-item {
          visibility: hidden;
        }
        .grid-flip-dialog[open] .grid-flip-item {
          visibility: visible;
        }
        .grid-flip-item.is-open {
          visibility: hidden;
        }
        .grid-flip-item img {
          transition: none !important;
        }
      `}</style>

      {/*
        AnimeLayout with root={dialogRef}:
        - The dialog is the anime.js layout root
        - Grid items are children of the wrapper but outside the dialog
        - anime.js tracks elements via childrenSelector + data-layout-id
      */}
      <AnimeLayout
        ref={layoutRef}
        as="div"
        root={dialogRef}
        childrenSelector=".grid-flip-item"
        properties={['--overlay-alpha']}
      >
        {/* Grid of clickable tiles */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-6 pb-10">
          {TILES.map((tile, i) => (
            <button
              key={i}
              ref={(el) => registerButton(el, i)}
              data-layout-id={`flip-${i}`}
              data-duration={tile.duration}
              className="grid-flip-item group relative block h-40 w-40 cursor-pointer overflow-hidden rounded-xl border border-landing-border bg-landing-surface"
              onClick={(e) => openModal(e.currentTarget)}
            >
              <img
                src={tile.src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
              <span className="landing-font-mono absolute bottom-1.5 left-2 text-[9px] tracking-[0.2em] uppercase text-white/80 drop-shadow">
                {tile.label}
              </span>
            </button>
          ))}
        </div>

        {/* Dialog — the layout root. Clones are appended here imperatively.
            Tailwind handles all sizing/positioning; only backdrop/overlay-alpha
            need the <style> block above. */}
        <dialog
          ref={dialogRef}
          className="grid-flip-dialog fixed inset-0 z-1000 m-0 flex h-dvh max-h-full w-screen max-w-full items-center justify-center overflow-hidden border-none bg-transparent p-0 pointer-events-none open:pointer-events-auto [&_.grid-flip-item]:h-[85vh] [&_.grid-flip-item]:w-auto [&_.grid-flip-item]:aspect-[4/5] [&_.grid-flip-item]:rounded-2xl [&_.grid-flip-item]:overflow-hidden [&_.grid-flip-item]:border [&_.grid-flip-item]:border-white/15 [&_.grid-flip-item]:shadow-2xl [&_.grid-flip-item]:cursor-pointer"
          onClick={closeModal}
          onCancel={(e) => {
            e.preventDefault();
            closeModal();
          }}
        />
      </AnimeLayout>
    </div>
  );
});

export default GridFlipModal;
