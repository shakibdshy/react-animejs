import { createFileRoute } from "@tanstack/react-router";
import { ScrollLinkedAnimationsGroup } from "@/lib/react-animejs/demo/components/ScrollLinkedAnimationsGroup";

export const Route = createFileRoute("/demo/scroll-linked-animations")({
  component: ScrollLinkedAnimationsPage,
});

function ScrollLinkedAnimationsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.36em] text-[#ffd11a]">
          Demo Route
        </div>
        <h1 className="text-4xl font-black uppercase tracking-[0.14em] text-white">
          Scroll Linked Animations
        </h1>
        <p className="text-sm leading-6 text-slate-400">
          This page focuses on observer-driven UI, where raw scroll progress is
          sampled continuously and turned into live visual state. Unlike the
          event demos, these examples are not mainly about triggering one
          animation instance; they are about composing motion directly from the
          ScrollObserver.
        </p>
      </header>

      <ScrollLinkedAnimationsGroup />
    </div>
  );
}
