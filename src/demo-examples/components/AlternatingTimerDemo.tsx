import { useAnimeTimer } from "@shakibdshy/react-animejs";

export function AlternatingTimerDemo() {
  const { countRef, iterationTimeRef, isMounted } = useAnimeTimer({
    duration: 1000,
    loop: true,
    alternate: true,
    autoplay: true,
    frameRate: 10,
    trackLoopCount: true,
    trackIterationTime: true,
    autoUpdateRefs: true,
  });

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center gap-8 p-8 bg-demo-bg border border-demo-border rounded-xl">
        <div className="text-[#666]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-demo-bg border border-demo-border rounded-xl">
      <div className="flex gap-12 w-full justify-center">
        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-lg">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold">
            loops count
          </span>
          <span
            ref={countRef}
            className="text-6xl font-bold text-indigo-400"
          >
            0
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-lg">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold">
            iteration time
          </span>
          <span
            ref={iterationTimeRef}
            className="text-6xl font-bold text-green-500"
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
