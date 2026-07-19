import React, { useCallback, useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { DemoCard } from "@/landing/components/base/demo-card";
import { DemoBox } from "@/landing/components/base/demo-box";
import { DemoBtn } from "@/landing/components/base/demo-btn";
import { Trash2 } from 'lucide-react';
import { flushSync } from 'react-dom';

export const AnimeLayoutComponentDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);
  const [cols, setCols] = useState(4);

  const addItem = useCallback(() => {
    const newId = counter;
    setCounter((c) => c + 1);
    layoutRef.current?.update(() => {
      flushSync(() => {
        setItems((prev) => [...prev, newId]);
      });
    });
  }, [counter]);

  const removeItem = useCallback((id: number) => {
    layoutRef.current?.update(() => {
      flushSync(() => {
        setItems((prev) => prev.filter((item) => item !== id));
      });
    });
  }, []);

  const changeColumns = useCallback((newCols: number) => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${newCols}, 1fr)`;
      },
      { duration: 600, ease: 'outExpo' }
    );
    setCols(newCols);
  }, []);

  return (
    <DemoCard
      title="<Declarative>"
      description="Component-based layout with automatic DOM reconciliation mode."
      footer={
        <>
          <label className="text-xs text-landing-muted landing-font-mono">Columns</label>
          <select
            value={cols}
            onChange={(e) => changeColumns(Number(e.target.value))}
            className="bg-landing-bg text-landing-fg border border-landing-border rounded px-2 py-1 text-xs landing-font-mono"
          >
            <option value="2">2 Columns</option>
            <option value="3">3 Columns</option>
            <option value="4">4 Columns</option>
          </select>

          <button
            onClick={() => layoutRef.current?.refresh()}
            className="ml-auto text-[11px] font-mono text-landing-muted hover:text-landing-fg cursor-pointer uppercase tracking-widest border border-landing-border px-3 py-1.5 rounded-lg hover:bg-landing-surface"
          >
            Force Refresh
          </button>
        </>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        duration={500}
        ease="outExpo"
        enterFrom={{ opacity: 0, translateY: 20, scale: 0.8 }}
        leaveTo={{ opacity: 0, translateY: -20, scale: 0.8 }}
        className="w-full grid gap-3 min-h-[140px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.map((id) => (
          <AnimeLayoutItem
            key={id}
            layoutId={`auto-item-${id}`}
            as={DemoBox}
            className="w-full flex items-center justify-center cursor-pointer group hover:bg-landing-accent hover:text-landing-bg transition-colors font-bold"
            onClick={() => removeItem(id)}
          >
            <span className="group-hover:hidden">{id}</span>
            <Trash2 size={16} className="hidden group-hover:block" />
          </AnimeLayoutItem>
        ))}
        {items.length === 0 && (
          <div className="col-span-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-landing-border/40 rounded-2xl text-landing-muted text-[11px] font-mono uppercase tracking-widest text-center bg-landing-surface/30">
            Empty
            <br />
            Click + to begin
          </div>
        )}
      </AnimeLayout>
      <div className="mt-6 flex justify-center w-full">
        <DemoBtn onClick={addItem}>Add Item</DemoBtn>
      </div>
    </DemoCard>
  );
};
export default AnimeLayoutComponentDemo;
