import React, { useState, useCallback } from "react";
import { DemoCard } from "./DemoCard";
import {
  roundPad,
  padStart,
  padEnd,
  degToRad,
  radToDeg,
} from "../../utils/anime-utils";

/**
 * Demo for string/number formatting utilities: roundPad, padStart, padEnd, degToRad, radToDeg
 */
export const StringUtilitiesDemo: React.FC = () => {
  const [roundPadValue, setRoundPadValue] = useState(3.14159);
  const [padStartValue, setPadStartValue] = useState(42);
  const [padEndValue, setPadEndValue] = useState(42);
  const [degValue, setDegValue] = useState(180);
  const [radValue, setRadValue] = useState(3.14159);

  const handleRoundPadChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRoundPadValue(parseFloat(e.target.value));
    },
    [],
  );

  const handlePadStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPadStartValue(parseFloat(e.target.value));
    },
    [],
  );

  const handlePadEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPadEndValue(parseFloat(e.target.value));
    },
    [],
  );

  const handleDegChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDegValue(parseFloat(e.target.value));
    },
    [],
  );

  const handleRadChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRadValue(parseFloat(e.target.value));
    },
    [],
  );

  const roundPadResult = roundPad(roundPadValue, 4);
  const padStartResult = padStart(padStartValue, 6, "0");
  const padEndResult = padEnd(padEndValue, 6, "0");
  const degToRadResult = degToRad(degValue);
  const radToDegResult = radToDeg(radValue);

  return (
    <DemoCard
      title="String Utilities"
      description="roundPad, padStart, padEnd, degToRad, radToDeg"
      code={`roundPad(${roundPadValue}, 4) = "${roundPadResult}"`}
    >
      <div className="w-full space-y-6">
        {/* RoundPad Demo */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>roundPad(value, decimals)</span>
            <span className="text-[#ffd11a] font-mono">"{roundPadResult}"</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.0001"
            value={roundPadValue}
            onChange={handleRoundPadChange}
            className="w-full accent-[#ffd11a]"
          />
          <div className="flex gap-2 mt-2">
            {[2, 3, 4, 5].map((decimals) => (
              <span
                key={decimals}
                className="text-[10px] bg-[#2a2a3a] px-2 py-1 rounded text-slate-400"
              >
                {decimals}: "{roundPad(roundPadValue, decimals)}"
              </span>
            ))}
          </div>
        </div>

        {/* PadStart Demo */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>padStart(str, length, pad)</span>
            <span className="text-[#ffd11a] font-mono">"{padStartResult}"</span>
          </div>
          <input
            type="text"
            value={padStartValue}
            onChange={handlePadStartChange}
            className="w-full bg-[#2a2a3a] border border-[#3a3a4a] rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Enter value"
          />
          <div className="text-[10px] text-slate-500 mt-1">
            Pads to 6 characters with "0"
          </div>
        </div>

        {/* PadEnd Demo */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>padEnd(str, length, pad)</span>
            <span className="text-[#ffd11a] font-mono">"{padEndResult}"</span>
          </div>
          <input
            type="text"
            value={padEndValue}
            onChange={handlePadEndChange}
            className="w-full bg-[#2a2a3a] border border-[#3a3a4a] rounded-lg px-3 py-2 text-white text-sm"
            placeholder="Enter value"
          />
          <div className="text-[10px] text-slate-500 mt-1">
            Pads to 6 characters with "0"
          </div>
        </div>

        {/* DegToRad Demo */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>degToRad(degrees)</span>
            <span className="text-[#ffd11a] font-mono">{degToRadResult.toFixed(4)} rad</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={degValue}
            onChange={handleDegChange}
            className="w-full accent-[#ffd11a]"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0°</span>
            <span className="text-[#ffd11a]">{degValue}°</span>
            <span>360°</span>
          </div>
          <div className="mt-3 flex items-center justify-center">
            <div
              className="w-16 h-16 border-2 border-[#ffd11a] rounded-full relative"
              style={{
                transform: `rotate(${degValue}deg)`,
              }}
            >
              <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-[#ffd11a] origin-bottom -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* RadToDeg Demo */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>radToDeg(radians)</span>
            <span className="text-[#ffd11a] font-mono">{radToDegResult.toFixed(2)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.01"
            value={radValue}
            onChange={handleRadChange}
            className="w-full accent-[#ffd11a]"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0 rad</span>
            <span className="text-[#ffd11a]">{radValue.toFixed(2)} rad</span>
            <span>2π rad</span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
