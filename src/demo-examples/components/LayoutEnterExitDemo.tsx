import React, { useCallback, useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';
import { DemoBtn } from '@/landing/components/base/demo-btn';
import { Trash2 } from 'lucide-react';
import { flushSync } from 'react-dom';

export const LayoutEnterExitDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [counter, setCounter] = useState(5);

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

  return (
    <DemoCard
      title="<Enter / Exit>"
      description="Animated insertion and removal of elements."
      code={`<AnimeLayout
  enterFrom={{ opacity: 0, scale: 0.5 }}
  leaveTo={{ opacity: 0, scale: 0.5 }}
>
  {items.map((id) => <AnimeLayoutItem key={id} layoutId={id} />)}
</AnimeLayout>`}
      footer={
        <>
          <span className="text-xs text-landing-muted landing-font-mono">
            Items: <span className="text-landing-fg">{items.length}</span>
          </span>
          <span className="text-[10px] text-landing-muted landing-font-mono ml-4">
            Click any item to remove it.
          </span>
        </>
      }
    >
      <AnimeLayout
        ref={layoutRef}
        duration={500}
        ease="outExpo"
        enterFrom={{ opacity: 0, translateY: 50, scale: 0.8 }}
        leaveTo={{ opacity: 0, translateY: -50, scale: 0.8 }}
        className="w-full flex flex-wrap gap-4 items-center justify-center min-h-[100px]"
      >
        {items.map((id) => (
          <AnimeLayoutItem
            key={id}
            layoutId={`item-${id}`}
            as={DemoBox}
            className="w-12 h-12 flex items-center justify-center cursor-pointer group hover:bg-landing-accent hover:text-landing-bg transition-colors"
            onClick={() => removeItem(id)}
          >
            <span className="group-hover:hidden font-bold">{id}</span>
            <Trash2 size={16} className="hidden group-hover:block" />
          </AnimeLayoutItem>
        ))}
        {items.length === 0 && (
          <div className="w-full h-24 flex items-center justify-center border-2 border-dashed border-landing-border/40 rounded-2xl text-landing-muted text-sm font-mono uppercase tracking-widest text-center bg-landing-surface/30">
            No items left
          </div>
        )}
      </AnimeLayout>
      <div className="mt-6 flex justify-center w-full">
        <DemoBtn onClick={addItem}>Add Item</DemoBtn>
      </div>
    </DemoCard>
  );
};
export default LayoutEnterExitDemo;
