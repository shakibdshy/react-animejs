import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import {
  AnimatePresence,
  AnimatePresenceChild,
} from "@/lib/react-animejs/components/AnimatePresence";

// =============================================================================
// SVG Icons
// =============================================================================

function SyncIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function WaitIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

function PopLayoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
      <path d="m21 3-9 9" />
      <path d="M15 3h6v6" />
    </svg>
  );
}

// =============================================================================
// Per-mode animation configs — each mode has its own character
// =============================================================================

const MODE_CONFIGS: Record<string, {
  enter: Record<string, unknown>;
  exit: Record<string, unknown>;
  duration: number;
  ease: string;
  description: string;
}> = {
  sync: {
    // Crossfade — pure opacity blend, both elements visible simultaneously
    enter: { opacity: [0, 1] },
    exit: { opacity: [1, 0] },
    duration: 400,
    ease: "inOutQuad",
    description: "Crossfade — elements blend together",
  },
  wait: {
    // Sequential fade with slide — exit finishes, then enter slides in
    enter: { opacity: [0, 1], translateY: [20, 0] },
    exit: { opacity: [1, 0], translateY: [0, -20] },
    duration: 300,
    ease: "outQuad",
    description: "Fade out, then fade in",
  },
  popLayout: {
    // Pop effect — scale + opacity, exiting element floats in place
    enter: { opacity: [0, 1], scale: [0.6, 1] },
    exit: { opacity: [1, 0], scale: [1, 0.8] },
    duration: 350,
    ease: "outBack",
    description: "Pop in-place, exit floats out",
  },
};

// =============================================================================
// ModeExample — one column per mode
// =============================================================================

function ModeExample({
  mode,
  icon,
  state,
}: {
  mode: "sync" | "wait" | "popLayout";
  icon: React.ReactNode;
  state: boolean;
}) {
  const filled = state;
  const config = MODE_CONFIGS[mode];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Container sized to hold the circle */}
      <div className="w-20 h-20 relative flex items-center justify-center">
        <AnimatePresence mode={mode}>
          <AnimatePresenceChild
            key={String(state)}
            enter={config.enter}
            exit={config.exit}
            duration={config.duration}
            ease={config.ease}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: filled ? "#f5f5f5" : "transparent",
                color: filled ? "#0f1115" : "#f5f5f5",
                border: filled ? "2px solid #1d2628" : "2px solid #f5f5f5",
              }}
            >
              {icon}
            </div>
          </AnimatePresenceChild>
        </AnimatePresence>
      </div>

      <code className="text-sm font-bold text-[#ffd11a]">{mode}</code>
      <span className="text-[10px] font-mono text-slate-500 text-center leading-relaxed">
        {config.description}
      </span>
    </div>
  );
}

// =============================================================================
// Main Modes Demo — three modes side by side, single toggle
// =============================================================================

function AnimatePresenceModesDemo() {
  const [state, setState] = useState(true);

  return (
    <DemoCard
      title="AnimatePresence Modes"
      description="Each mode has a distinct animation style — sync crossfades, wait fades sequentially, popLayout pops in-place"
      state={{ progress: state ? 1 : 0 }}
      code={`// sync — crossfade
enter={{ opacity: [0, 1] }}
exit={{ opacity: [1, 0] }}

// wait — sequential fade
enter={{ opacity: [0, 1], translateY: [20, 0] }}
exit={{ opacity: [1, 0], translateY: [0, -20] }}

// popLayout — pop effect
enter={{ opacity: [0, 1], scale: [0.6, 1] }}
exit={{ opacity: [1, 0], scale: [1, 0.8] }}`}
      className="col-span-full"
    >
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Three modes side by side */}
        <div className="flex gap-16 justify-center items-start w-full">
          <ModeExample mode="sync" icon={<SyncIcon />} state={state} />
          <ModeExample mode="wait" icon={<WaitIcon />} state={state} />
          <ModeExample mode="popLayout" icon={<PopLayoutIcon />} state={state} />
        </div>

        {/* Switch button */}
        <button
          onClick={() => setState((prev) => !prev)}
          className="px-8 py-3 text-sm font-medium rounded-lg cursor-pointer outline-none transition-transform active:scale-95"
          style={{
            backgroundColor: "#f5f5f5",
            color: "#0f1115",
            border: "none",
          }}
        >
          Switch
        </button>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Tab Switcher demo
// =============================================================================

function TabSwitcherDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "Dashboard", content: "Overview of your analytics and key metrics in real-time." },
    { label: "Projects", content: "Manage your active projects, tasks, and team assignments." },
    { label: "Settings", content: "Configure your preferences, notifications, and integrations." },
  ];

  return (
    <DemoCard
      title="Tab Switcher"
      description="Animated tab content with popLayout mode"
      state={{ progress: activeTab / (tabs.length - 1) }}
      code={`<AnimatePresence mode="popLayout">
  <AnimatePresenceChild
    key={tab}
    enter={{ opacity: [0, 1], translateY: [10, 0] }}
    exit={{ opacity: [1, 0], translateY: [0, -10] }}
  />`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-1 bg-[#0a0a12] rounded-xl p-1 border border-[#2a2a3a]/50">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === i
                  ? "bg-[#ffd11a] text-black shadow-[0_0_12px_rgba(255,209,26,0.3)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0a0a12] rounded-xl p-6 border border-[#2a2a3a]/50 min-h-20 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <AnimatePresenceChild
              key={activeTab}
              enter={{ opacity: [0, 1], translateY: [10, 0], scale: [0.95, 1] }}
              exit={{ opacity: [1, 0], translateY: [0, -10], scale: [1, 0.95] }}
              duration={300}
              ease="outQuad"
            >
              <div className="text-center">
                <div className="text-sm font-bold text-[#ffd11a] mb-1">
                  {tabs[activeTab].label}
                </div>
                <p className="text-xs text-slate-400">
                  {tabs[activeTab].content}
                </p>
              </div>
            </AnimatePresenceChild>
          </AnimatePresence>
        </div>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Notification Stack demo
// =============================================================================

function NotificationDemo() {
  const [notifications, setNotifications] = useState<{ id: number; type: string; message: string; icon: string }[]>([]);
  const nextId = React.useRef(0);

  const NOTIFICATION_TYPES = [
    { type: "success", message: "Changes saved successfully", icon: "\u2713" },
    { type: "info", message: "New update available", icon: "\u2139" },
    { type: "warning", message: "Storage running low", icon: "\u26A0" },
    { type: "error", message: "Connection lost", icon: "\u2715" },
  ];

  const TYPE_STYLES: Record<string, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };

  const addNotification = () => {
    const n = NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)];
    const id = nextId.current++;
    setNotifications((prev) => [{ id, type: n.type, message: n.message, icon: n.icon }, ...prev]);
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DemoCard
      title="Notification Stack"
      description="Items enter and leave with sync mode"
      actions={
        <button
          onClick={addNotification}
          className="px-3 py-1 text-xs font-bold rounded-lg bg-[#ffd11a]/20 text-[#ffd11a] hover:bg-[#ffd11a]/30 border border-[#ffd11a]/30 transition-colors"
        >
          + Notify
        </button>
      }
      controls={{ restart: clearAll }}
      state={{ progress: Math.min(notifications.length / 4, 1) }}
      code={`<AnimatePresence mode="sync">
  <AnimatePresenceChild
    enter={{ opacity: [0, 1], translateX: [-60, 0] }}
    exit={{ opacity: [1, 0], translateX: [0, 60] }}
  />`}
    >
      <div className="flex flex-col gap-2 w-full max-w-sm mx-auto min-h-15">
        <AnimatePresence mode="sync">
          {notifications.map(({ id, type, message, icon }) => (
            <AnimatePresenceChild
              key={id}
              enter={{ opacity: [0, 1], translateX: [-60, 0], scale: [0.9, 1] }}
              exit={{ opacity: [1, 0], translateX: [0, 60], scale: [1, 0.9] }}
              duration={300}
              ease="outQuad"
            >
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer ${TYPE_STYLES[type]}`}
                onClick={() => dismissNotification(id)}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-medium flex-1">{message}</span>
                <span className="text-[10px] opacity-50 hover:opacity-100">&times;</span>
              </div>
            </AnimatePresenceChild>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-xs text-slate-600 text-center py-4">
            Click &quot;+ Notify&quot; to add notifications
          </div>
        )}
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Export
// =============================================================================

export const AnimatePresenceGroup: React.FC = () => {
  return (
    <DemoSection title="Animate Presence">
      <AnimatePresenceModesDemo />
      <TabSwitcherDemo />
      <NotificationDemo />
    </DemoSection>
  );
};
