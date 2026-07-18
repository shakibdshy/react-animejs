/**
 * OrchestratedEaseReverse — A demo demonstrating custom exit animations.
 *
 * Toggling `easeReverse` ON lets each element retract/fade with smooth,
 * non-bouncy curves (outQuad/outCubic) instead of reversing the bouncy entry
 * curves (outBack). The exit speed is controlled via `setPlaybackRate`, which
 * scales the whole timeline proportionally — the same technique as GSAP's
 * `timeScale`, so no per-tween `duration / exitSpeed` math is needed.
 *
 * Built with the library's declarative <AnimeTimeline> component (entries prop
 * + onReady) rather than calling useAnimeTimeline by hand. Two coordinated
 * timelines are required because anime.js has no per-tween `easeReverse`
 * (GSAP does): the open timeline is the single source of truth for entry, and
 * the close timeline gives the exit its own easing curves.
 */
import {
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimeProvider,
  AnimeTimeline,
  type AnimeTimelineRef,
  stagger,
  type TimelineEntry,
} from '@/lib/react-animejs';

interface NavLink {
  label: string;
  num: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Work', num: '01' },
  { label: 'About', num: '02' },
  { label: 'Studio', num: '03' },
  { label: 'Journal', num: '04' },
  { label: 'Contact', num: '05' },
];

export const OrchestratedEaseReverse = memo(function OrchestratedEaseReverse({
  className = '',
}: {
  className?: string;
}) {
  return (
    <AnimeProvider>
      <OrchestratedEaseReverseInner className={className} />
    </AnimeProvider>
  );
});

const OrchestratedEaseReverseInner = memo(function OrchestratedEaseReverseInner({
  className = '',
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [easeReverse, setEaseReverse] = useState(true);
  const [exitSpeed, setExitSpeed] = useState(1);
  const [expandedWidth, setExpandedWidth] = useState(400);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Hold the two timeline APIs handed back by <AnimeTimeline onReady>. Using
  // refs avoids re-renders when the APIs mount and lets toggleMenu read the
  // latest values without being a dependency of the callback.
  const openApiRef = useRef<AnimeTimelineRef | null>(null);
  const closeApiRef = useRef<AnimeTimelineRef | null>(null);

  // Read the latest `isOpen` inside async `onComplete` callbacks without
  // rebinding them (which would rebuild the timeline).
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Handle responsive width of the expanded island
  useEffect(() => {
    const handleResize = () => {
      setExpandedWidth(Math.min(window.innerWidth * 0.9, 400));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panelRef = useRef<HTMLDivElement>(null);

  // 1. Entry timeline — bouncy, plays forward. Single source of truth for open.
  //    When reversed (easeReverse OFF), anime.js replays these same curves
  //    backward — the "bouncy retract" path.
  const openEntries: TimelineEntry[] = [
    {
      targets: '.er-island',
      width: expandedWidth,
      duration: 800,
      ease: 'outBack',
      position: 0,
    },
    {
      targets: '.er-logo',
      opacity: 1,
      rotate: 180,
      duration: 500,
      ease: 'outBack',
      position: 120,
    },
    {
      targets: '.er-menu-btn',
      opacity: 0,
      duration: 150,
      ease: 'inQuad',
      position: 0,
    },
    {
      targets: '.er-backdrop',
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
      position: 0,
    },
    {
      targets: '.er-menu-panel',
      opacity: 1,
      scale: 1,
      translateY: 0,
      translateX: '-50%',
      duration: 800,
      ease: 'outBack',
      position: 100,
    },
    {
      targets: '.er-menu-link',
      opacity: 1,
      translateY: 0,
      duration: 320,
      ease: 'outQuad',
      delay: stagger(50) as any,
      position: 220,
    },
  ];

  // 2. Exit timeline — smooth curves, plays forward = animating to closed.
  //    Active only when easeReverse is ON. Base durations only — speed is
  //    controlled live via setPlaybackRate (scales duration + position
  //    proportionally, preserving the orchestration).
  const closeEntries: TimelineEntry[] = [
    {
      targets: '.er-island',
      width: 52,
      duration: 800,
      ease: 'outQuad',
      position: 0,
    },
    {
      targets: '.er-logo',
      opacity: 0,
      rotate: 0,
      duration: 500,
      ease: 'outQuart',
      position: 0,
    },
    {
      targets: '.er-menu-btn',
      opacity: 1,
      duration: 150,
      ease: 'outQuad',
      position: 650,
    },
    {
      targets: '.er-backdrop',
      opacity: 0,
      duration: 300,
      ease: 'outQuad',
      position: 500,
    },
    {
      targets: '.er-menu-panel',
      opacity: 0,
      scale: 0.6,
      translateY: -15,
      translateX: '-50%',
      duration: 800,
      ease: 'outCubic',
      position: 0,
    },
    {
      targets: '.er-menu-link',
      opacity: 0,
      translateY: 6,
      duration: 320,
      ease: 'outQuad',
      position: 0,
    },
  ];

  const toggleMenu = useCallback(() => {
    const openApi = openApiRef.current;
    const closeApi = closeApiRef.current;
    if (!openApi || !closeApi) return;

    setIsOpen((prev) => {
      const next = !prev;

      if (next) {
        // OPENING — entry timeline, normal speed, forward from start.
        setIsOverlayVisible(true);
        closeApi.controls.pause();
        openApi.controls.setPlaybackRate(1);
        openApi.controls.restart();
      } else {
        // CLOSING — stop any in-progress entry, then choose the exit path.
        openApi.controls.pause();
        if (easeReverse) {
          // Smooth retract: play the dedicated exit timeline at exit speed.
          closeApi.controls.setPlaybackRate(exitSpeed);
          closeApi.controls.restart();
        } else {
          // Bouncy retract: reverse the entry timeline at exit speed.
          // reverse() already handles the direction flip internally.
          openApi.controls.setPlaybackRate(exitSpeed);
          openApi.controls.reverse();
        }
      }
      return next;
    });
  }, [easeReverse, exitSpeed]);

  // Handle clicking on the backdrop
  const handleBackdropClick = useCallback(() => {
    if (isOpen) toggleMenu();
  }, [isOpen, toggleMenu]);

  // Esc key support
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleMenu]);

  // Accessible focus trap
  const handlePanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || e.key !== 'Tab') return;
    const focusable = Array.from(
      panelRef.current?.querySelectorAll('.menu-link[tabindex="0"]') || []
    ) as HTMLElement[];
    if (focusable.length === 0) return;
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

  return (
    <AnimeProvider>
      {/* Both timelines are frameless (<AnimeTimeline> renders only a context
          provider), so they can wrap a single shared DOM tree. */}
      <AnimeTimeline
        autoplay={false}
        entries={openEntries}
        onReady={(api) => {
          openApiRef.current = api;
        }}
        onComplete={() => {
          // Fires after entry (forward) and after a bouncy-reverse close.
          // Only hide the overlay when the menu is actually closing.
          if (!isOpenRef.current) {
            setIsOverlayVisible(false);
          }
        }}
      >
        <AnimeTimeline
          autoplay={false}
          entries={closeEntries}
          onReady={(api) => {
            closeApiRef.current = api;
          }}
          onComplete={() => {
            setIsOverlayVisible(false);
            document.getElementById('menuToggle')?.focus();
          }}
        >
          <div
            className={`relative flex flex-col items-center justify-center rounded-2xl border border-landing-border/60 bg-[#0e100f] p-8 min-h-120 overflow-hidden ${className}`}
            style={{ color: '#fffce1' }}
          >
            {/* 1. Backdrop Overlay */}
            <div
              className="er-backdrop absolute inset-0 z-40 bg-[#0e100f]/88 backdrop-blur-[3px]"
              onClick={handleBackdropClick}
              style={{ opacity: 0, pointerEvents: isOverlayVisible ? 'auto' : 'none' }}
            />

            {/* 2. Dynamic Island Bar */}
            <div
              className="er-island absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center p-2 bg-[#171918] border border-[#7c7c6f]/40 rounded-full overflow-hidden"
              style={{ width: 52, height: 50, transform: 'translateX(-50%)' }}
            >
              {/* Island Logo */}
              <div
                className={`er-logo absolute inset-0 flex items-center justify-center ${isOpen ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
                role="button"
                tabIndex={isOpen ? 0 : -1}
                aria-label="Close navigation menu"
                onClick={isOpen ? toggleMenu : undefined}
                onKeyDown={(e) => {
                  if (isOpen && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggleMenu();
                  }
                }}
                style={{ opacity: 0, transform: 'rotate(0deg)' }}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8" r="3.5" fill="var(--landing-accent)" />
                    <circle cx="16" cy="8" r="3.5" fill="var(--landing-accent)" />
                    <circle cx="8" cy="16" r="3.5" fill="var(--landing-accent)" />
                    <circle cx="16" cy="16" r="3.5" fill="var(--landing-accent)" />
                  </svg>
                </div>
              </div>

              {/* Menu Button */}
              <button
                id="menuToggle"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-controls="menu-overlay"
                aria-label="Open navigation menu"
                tabIndex={isOpen ? -1 : 0}
                className={`er-menu-btn absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 ${isOpen ? 'pointer-events-none' : ''}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    className="er-bar-top"
                    x1="2"
                    y1="5"
                    x2="14"
                    y2="5"
                    stroke="#BBBAA6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ transformOrigin: '8px 5px' }}
                  />
                  <line
                    className="er-bar-mid"
                    x1="2"
                    y1="8"
                    x2="14"
                    y2="8"
                    stroke="#BBBAA6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ transformOrigin: '8px 8px' }}
                  />
                  <line
                    className="er-bar-bot"
                    x1="2"
                    y1="11"
                    x2="14"
                    y2="11"
                    stroke="#BBBAA6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ transformOrigin: '8px 11px' }}
                  />
                </svg>
              </button>
            </div>

            {/* 3. Dropdown Menu Panel */}
            <div
              id="menu-overlay"
              ref={panelRef}
              onKeyDown={handlePanelKeyDown}
              className="er-menu-panel absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#171918] border border-[#7c7c6f]/40 rounded-2xl p-1.5 w-[90%] max-w-100"
              style={{
                visibility: isOverlayVisible ? 'visible' : 'hidden',
                opacity: 0,
                transform: 'translateX(-50%) scale(0.6) translateY(-15px)',
                transformOrigin: 'top center',
              }}
            >
              <nav className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href="#"
                    tabIndex={isOpen ? 0 : -1}
                    className="menu-link er-menu-link flex items-center justify-between px-4 py-3 rounded-lg text-decoration-none text-[#bbbaa6] hover:text-landing-accent font-sans text-sm border-t border-[#42433d]/40 first:border-t-0 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#171918]"
                    style={{ opacity: 0, transform: 'translateY(6px)' }}
                  >
                    <span>{link.label}</span>
                    <span className="text-[10px] text-[#42433d] hover:text-[#7c7c6f] font-mono">
                      {link.num}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* 4. Description and Settings Panel */}
            <div className="absolute bottom-6 left-0 right-0 z-50 flex flex-col items-center gap-4 px-6 text-center select-none pointer-events-none">
              <div className="flex flex-wrap items-center justify-center gap-6 pointer-events-auto">
                <label className="flex items-center gap-2 text-xs text-[#7c7c6f] font-mono cursor-pointer hover:text-[#fffce1] transition-colors">
                  <input
                    type="checkbox"
                    checked={easeReverse}
                    onChange={(e) => {
                      setEaseReverse(e.target.checked);
                      if (isOpen) toggleMenu();
                    }}
                    className="w-3.5 h-3.5 accent-landing-accent rounded cursor-pointer"
                  />
                  <span>easeReverse</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#7c7c6f] font-mono cursor-pointer hover:text-[#fffce1] transition-colors">
                  <span>exit speed</span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={exitSpeed}
                    onChange={(e) => setExitSpeed(parseFloat(e.target.value))}
                    className="w-16 h-4 accent-landing-accent cursor-pointer"
                  />
                  <span className="text-[10px] text-landing-accent font-bold min-w-5">
                    {exitSpeed}x
                  </span>
                </label>
              </div>
            </div>
          </div>
        </AnimeTimeline>
      </AnimeTimeline>
    </AnimeProvider>
  );
});
