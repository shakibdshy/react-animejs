import { useCallback, useRef, useState } from "react";
import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

interface LogEntry {
  id: number;
  type: string;
  time: string;
  color: string;
}

export function TimerCallbacksDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isUpdateActive, setIsUpdateActive] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const addLog = useCallback((type: string, color: string) => {
    const entry = {
      id: nextId.current++,
      type,
      time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
      color
    };
    setLogs(prev => [entry, ...prev].slice(0, 10));
  }, []);

  const { controls, isRunning, timer } = useAnimeTimer({
    duration: 2000,
    loop: 2,
    autoplay: false,
    onBegin: () => addLog("onBegin", "text-blue-400"),
    onUpdate: () => {
      // We don't log onUpdate to avoid flooding, but show a visual pulse
      setIsUpdateActive(true);
      setTimeout(() => setIsUpdateActive(false), 50);
    },
    onLoop: () => addLog("onLoop", "text-yellow-400"),
    onPause: () => addLog("onPause", "text-orange-400"),
    onComplete: () => addLog("onComplete", "text-green-400"),
  });

  // Demonstrate .then() Promise
  const handlePlayWithPromise = useCallback(() => {
    setLogs([]);
    controls.restart();
    
    timer?.then(() => {
      addLog("Promise Resolved (.then)", "text-purple-400");
    });
  }, [controls, timer, addLog]);

  return (
    <DemoSection title="Timer Lifecycle Callbacks">
      <div className="flex flex-col gap-6 w-full">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-[#0a0a10] border border-[#2a2a3a] rounded-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-[#888]">
              onUpdate pulse
            </span>
            <div 
              className={`w-4 h-4 rounded-full transition-all duration-75 ${
                isUpdateActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-125" : "bg-green-900/30"
              }`}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0a0a10] border border-[#2a2a3a] rounded-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-[#888]">
              Status
            </span>
            <span className={`text-xs font-mono font-bold ${isRunning ? "text-indigo-400" : "text-[#555]"}`}>
              {isRunning ? "RUNNING" : "IDLE"}
            </span>
          </div>
        </div>

        {/* Event Log */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold ml-1">
            Callback Event Log (Latest 10)
          </span>
          <div className="h-48 bg-[#050508] border border-[#2a2a3a] rounded-xl p-4 overflow-y-auto font-mono text-[11px] flex flex-col gap-1 shadow-inner">
            {logs.length === 0 ? (
              <div className="text-[#333] italic text-center mt-16">Waiting for events...</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex justify-between border-b border-[#1a1a25] pb-1 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className={`${log.color} font-bold`}>{log.type}</span>
                  <span className="text-[#444]">{log.time}</span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-30 transition-all"
            onClick={handlePlayWithPromise}
            disabled={isRunning}
          >
            Play (with Promise)
          </button>
          <button
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1e1e2a] border border-[#2a2a3a] hover:bg-[#2a2a3a] text-[#aaa] hover:text-white rounded-lg active:scale-95 transition-all"
            onClick={controls.pause}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1e1e2a] border border-[#2a2a3a] hover:bg-[#2a2a3a] text-[#aaa] hover:text-white rounded-lg active:scale-95 transition-all"
            onClick={() => { setLogs([]); controls.restart(); }}
          >
            Restart
          </button>
        </div>
      </div>
    </DemoSection>
  );
}
