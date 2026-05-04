import React, { useState, useRef, useCallback } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "@/lib/react-animejs/components/AnimeLayout";
import { AnimatedReorderList } from "@/components/AnimatedReorderList";
import {
  AnimatePresence,
  AnimatePresenceChild,
} from "@/lib/react-animejs/components/AnimatePresence";

// =============================================================================
// Helpers
// =============================================================================

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

// =============================================================================
// Shared data
// =============================================================================

interface ListItem {
  id: string;
  label: string;
  color: string;
  icon: string;
}

const COLOR_ITEMS: ListItem[] = [
  { id: "red", label: "Red", color: "#ff4d6a", icon: "R" },
  { id: "blue", label: "Blue", color: "#63b3ed", icon: "B" },
  { id: "green", label: "Green", color: "#68d391", icon: "G" },
  { id: "yellow", label: "Yellow", color: "#ffd11a", icon: "Y" },
  { id: "purple", label: "Purple", color: "#b794f4", icon: "P" },
  { id: "orange", label: "Orange", color: "#f6ad55", icon: "O" },
];

const TASK_ITEMS: ListItem[] = [
  { id: "design", label: "Finalize design system", color: "#ffd11a", icon: "1" },
  { id: "api", label: "Build REST API endpoints", color: "#63b3ed", icon: "2" },
  { id: "auth", label: "Implement OAuth flow", color: "#68d391", icon: "3" },
  { id: "tests", label: "Write integration tests", color: "#ff4d6a", icon: "4" },
  { id: "deploy", label: "Set up CI/CD pipeline", color: "#b794f4", icon: "5" },
];

// =============================================================================
// Basic Reorder — uses AnimatedReorderList
// =============================================================================

function BasicReorderDemo() {
  const [items, setItems] = useState(COLOR_ITEMS);

  return (
    <DemoCard
      title="Basic Reorder"
      description="Shuffle, reverse, or reset with smooth FLIP animations"
      state={{ progress: 0 }}
      code={`<AnimatedReorderList items={items} getKey={(i) => i.id}>
  {(item) => <div>{item.label}</div>}
</AnimatedReorderList>`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setItems((prev) => shuffleArray(prev))}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={() => setItems((prev) => [...prev].reverse())}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-[#e0e0e0] rounded-lg hover:bg-[#3a3a4a] transition-colors"
          >
            Reverse
          </button>
          <button
            onClick={() => setItems(COLOR_ITEMS)}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-slate-400 rounded-lg hover:bg-[#3a3a4a] hover:text-[#e0e0e0] transition-colors"
          >
            Reset
          </button>
        </div>

        <AnimeLayout
          mode="auto"
          duration={500}
          ease="outExpo"
          enterFrom={{ opacity: 0, transform: "scale(0.9)" }}
          leaveTo={{ opacity: 0, transform: "scale(0.9)" }}
          className="w-full grid grid-cols-2 gap-3"
        >
          {items.map((item) => (
            <AnimeLayoutItem
              key={item.id}
              layoutId={item.id}
            >
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#2a2a3a] bg-[#12121a]">
                <div
                  className="w-10 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 text-sm font-bold text-[#e0e0e0]">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 font-mono">{item.id}</span>
              </div>
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Move Up / Down — uses AnimatedReorderList
// =============================================================================

function MoveUpDownDemo() {
  const [items, setItems] = useState(TASK_ITEMS);

  return (
    <DemoCard
      title="Move Up / Down"
      description="Reorder with up/down buttons on each item"
      state={{ progress: 0 }}
      code={`<AnimatedReorderList items={items} getKey={...}>
  {(item, index) => (
    <Item onMoveUp={() => move(index, index - 1)} />
  )}
</AnimatedReorderList>`}
    >
      <AnimatedReorderList
        items={items}
        getKey={(item) => item.id}
        duration={500}
        className="w-full"
      >
        {(item, index) => (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#2a2a3a] bg-[#12121a] hover:border-white/10 transition-colors group">
            <div className="flex flex-col gap-0.5 cursor-grab active:cursor-grabbing">
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-slate-600">
                <circle cx="3" cy="3" r="1.5" fill="currentColor" />
                <circle cx="9" cy="3" r="1.5" fill="currentColor" />
                <circle cx="3" cy="9" r="1.5" fill="currentColor" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-sm font-bold text-[#e0e0e0]">
              {item.label}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setItems((prev) => moveItem(prev, index, index - 1))}
                disabled={index === 0}
                className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                onClick={() => setItems((prev) => moveItem(prev, index, index + 1))}
                disabled={index === items.length - 1}
                className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </AnimatedReorderList>
    </DemoCard>
  );
}

// =============================================================================
// Add & Remove — uses AnimatePresence (lower-level)
// =============================================================================

function AddRemoveDemo() {
  const [items, setItems] = useState(COLOR_ITEMS);
  const nextId = useRef(6);
  const [text, setText] = useState("");

  const addItem = useCallback(() => {
    if (!text.trim()) return;
    const id = `item-${nextId.current++}`;
    const colors = ["#ff4d6a", "#63b3ed", "#68d391", "#ffd11a", "#b794f4", "#f6ad55"];
    const item: ListItem = {
      id,
      label: text.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: id[0].toUpperCase(),
    };
    setItems((prev) => [...prev, item]);
    setText("");
  }, [text]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <DemoCard
      title="Add & Remove"
      description="Add and remove items with enter/exit animations"
      state={{ progress: items.length / 10 }}
      code={`<AnimatePresence mode="sync">
  {items.map(item => (
    <AnimatePresenceChild
      key={item.id}
      enter={{ opacity: [0, 1], translateY: [20, 0] }}
      exit={{ opacity: [1, 0], translateY: [0, -20] }}>
      <Item />
    </AnimatePresenceChild>
  ))}
</AnimatePresence>`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Item label..."
            className="flex-1 px-3 py-1.5 text-sm bg-[#0a0a12] border border-[#2a2a3a] rounded-lg text-[#e0e0e0] placeholder:text-slate-600"
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
            }}
          />
          <button
            onClick={addItem}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col" style={{ gap: 8 }}>
          <AnimatePresence>
            {items.map((item) => (
              <AnimatePresenceChild
                key={item.id}
                enter={{ opacity: [0, 1], translateY: [20, 0] }}
                exit={{ opacity: [1, 0], translateY: [0, -20] }}
                duration={300}
                ease="outCubic"
              >
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#2a2a3a] bg-[#12121a]">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 text-sm font-medium text-[#e0e0e0]">
                    {item.label}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-slate-500 hover:text-[#ff4d6a] hover:bg-white/10 transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </AnimatePresenceChild>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Grid Reorder — uses AnimeLayout directly in a grid
// =============================================================================

function GridReorderDemo() {
  const [items, setItems] = useState(COLOR_ITEMS);
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [cols, setCols] = useState(3);

  const changeColumns = useCallback(
    (n: number) => {
      layoutRef.current?.update(
        (layout) => {
          const root = layout.root as HTMLElement;
          root.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        },
        { duration: 600, ease: "outExpo" },
      );
      setCols(n);
    },
    [cols],
  );

  return (
    <DemoCard
      title="Grid Reorder"
      description="Animate items within a CSS Grid layout"
      state={{ progress: 0 }}
      code={`<AnimeLayout mode="auto" className="grid gap-3"
  style={{ gridTemplateColumns: \`repeat(${cols}, 1fr)\` }}>
  {items.map(item => (
    <AnimeLayoutItem key={item.id} layoutId={item.id}>
      ...
    </AnimeLayoutItem>
  ))}
</AnimeLayout>`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setItems((prev) => shuffleArray(prev))}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors"
            >
              Shuffle
            </button>
            <button
              onClick={() => setItems((prev) => [...prev].reverse())}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-[#e0e0e0] rounded-lg hover:bg-[#3a3a4a] transition-colors"
            >
              Reverse
            </button>
          </div>
          <div className="flex gap-1 bg-[#0a0a12] rounded-lg p-0.5 border border-[#2a2a3a]/50">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => changeColumns(n)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                    cols === n
                      ? "bg-[#ffd11a] text-black"
                      : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {n}c
              </button>
            ))}
          </div>
        </div>

        <AnimeLayout
          ref={layoutRef}
          mode="auto"
          duration={600}
          ease="outExpo"
          enterFrom={{ opacity: 0, transform: "scale(0.8)" }}
          leaveTo={{ opacity: 0, transform: "scale(0.8)" }}
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item) => (
              <AnimeLayoutItem key={item.id} layoutId={item.id}>
                <div
                  className="flex items-center justify-center gap-2 px-3 py-4 rounded-xl border border-[#2a2a3a] bg-[#12121a] hover:border-white/10 transition-colors cursor-pointer"
                  style={{ minHeight: 60 }}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-bold text-[#e0e0e0]">
                    {item.label}
                  </span>
                </div>
              </AnimeLayoutItem>
          ))}
        </AnimeLayout>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Sequence — uses AnimatedReorderList
// =============================================================================

function SequenceReorderDemo() {
  const [items, setItems] = useState(COLOR_ITEMS);
  const [running, setRunning] = useState(false);

  const runSequence = useCallback(() => {
    setRunning(true);
    setItems((prev) => shuffleArray(prev));
    setTimeout(() => setItems((prev) => [...prev].reverse()), 800);
    setTimeout(() => {
      setItems(COLOR_ITEMS);
      setRunning(false);
    }, 1600);
  }, [running]);

  return (
    <DemoCard
      title="Animated Sequence"
      description="Pre-defined animation sequence using setTimeout to trigger layout changes"
      state={{ progress: running ? 1 : 0 }}
      code={`// A sequence of state changes triggers
// a series of layout animations
// 1. Shuffle items
// 2. Wait 800ms
// 3. Reverse items
// 4. Wait 800ms
// 5. Reset to original`}
    >
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={runSequence}
          disabled={running}
          className="self-center px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? "Running..." : "Play Sequence"}
        </button>

        <AnimatedReorderList
          items={items}
          getKey={(item) => item.id}
          duration={500}
          className="w-full"
        >
          {(item) => (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#2a2a3a] bg-[#12121a]">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: item.color + "20", color: "#12121a" }}
              >
                {item.icon}
              </div>
              <span className="flex-1 text-sm font-bold text-[#e0e0e0]">
                {item.label}
              </span>
            </div>
          )}
        </AnimatedReorderList>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Export
// =============================================================================

export const ReorderListDemoGroup: React.FC = () => {
  return (
    <DemoSection title="Reorder Animation">
      <BasicReorderDemo />
      <MoveUpDownDemo />
      <AddRemoveDemo />
      <GridReorderDemo />
      <SequenceReorderDemo />
    </DemoSection>
  );
};
