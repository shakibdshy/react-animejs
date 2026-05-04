import React, { useCallback, useRef, useState } from 'react';
import { AnimeLayout, AnimeLayoutItem, type AnimeLayoutRef } from '@/lib/react-animejs/components/AnimeLayout';
import { DemoCard } from './DemoCard';
import { ChevronFirst, ChevronLast, Plus, Trash2 } from 'lucide-react';

export const LayoutEnterExitDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);

  const addItem = useCallback(() => {
    const newId = counter;
    setCounter((c) => c + 1);
    layoutRef.current?.update(() => {
      setItems((prev) => [...prev, newId]);
    });
  }, [counter]);

  const removeItem = useCallback((id: number) => {
    layoutRef.current?.update(() => {
      setItems((prev) => prev.filter((item) => item !== id));
    });
  }, []);

  const playDemo = () => {
    addItem();
    setTimeout(() => {
      addItem();
      setTimeout(() => {
        if (items.length > 0) removeItem(items[0]);
      }, 600);
    }, 600);
  };

  const removeFirst = useCallback(() => {
    if (items.length > 0) {
      removeItem(items[0]);
    }
  }, [items, removeItem]);

  const removeLast = useCallback(() => {
    if (items.length > 0) {
      removeItem(items[items.length - 1]);
    }
  }, [items, removeItem]);

  return (
    <DemoCard
      title="enter / exit"
      description="Animated insertion and removal of elements. Using <AnimeLayout> component."
      actions={
        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={addItem}
            className="p-1.5 bg-[#ffd11a] text-[#12121a] rounded-lg transition-all hover:scale-105 active:scale-95"
            title="Add Item"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={removeFirst}
            disabled={items.length === 0}
            className="p-1.5 text-slate-500 hover:text-orange-500 rounded-lg transition-all disabled:opacity-20"
            title="Remove First"
          >
            <ChevronFirst size={12} />
          </button>
          <button
            onClick={removeLast}
            disabled={items.length === 0}
            className="p-1.5 text-slate-500 hover:text-orange-500 rounded-lg transition-all disabled:opacity-20"
            title="Remove Last"
          >
            <ChevronLast size={12} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => {
          layoutRef.current?.update(() => {
            setItems([1, 2, 3, 4]);
            setCounter(5);
          });
        },
      }}
      state={layoutRef.current?.state}
      isPlaying={layoutRef.current?.isAnimating}
      code={`<AnimeLayout enterFrom={{...}} leaveTo={{...}} />`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        <AnimeLayout
          ref={layoutRef}
          duration={500}
          ease="outExpo"
          enterFrom={{
            opacity: 0,
            transform: 'translateY(50px) scale(0.8)',
          }}
          leaveTo={{
            opacity: 0,
            transform: 'translateY(-50px) scale(0.8)',
          }}
          className="w-full flex flex-wrap gap-4 min-h-40 items-start content-start"
        >
          {items.map((id) => (
            <AnimeLayoutItem
              key={id}
              layoutId={`item-${id}`}
              className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#ffd11a]/10 border border-[#ffd11a]/20 text-[#ffd11a] font-bold text-lg shadow-sm cursor-pointer group hover:bg-[#ffd11a] hover:text-[#12121a] transition-all"
              onClick={() => removeItem(id)}
            >
              <span className="group-hover:hidden">{id}</span>
              <Trash2 size={24} className="hidden group-hover:block" />
            </AnimeLayoutItem>
          ))}
          {items.length === 0 && (
            <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600 text-sm font-mono uppercase tracking-widest text-center">
              No items - Click + to add
            </div>
          )}
        </AnimeLayout>

        {/* Live Status */}
        <div className="flex gap-4">
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
              Entering
            </span>
            <span className="text-green-500 font-mono font-bold">
              {layoutRef.current?.entering.length || 0}
            </span>
          </div>
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
              Leaving
            </span>
            <span className="text-red-500 font-mono font-bold">
              {layoutRef.current?.leaving.length || 0}
            </span>
          </div>
          <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Total</span>
            <span className="text-[#ffd11a] font-mono font-bold">{items.length}</span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
};

export default LayoutEnterExitDemo;
