import React, { useState, useCallback } from "react";
import { DemoCard } from "./DemoCard";
import {
  random,
  createSeededRandom,
  randomPick,
  shuffle,
} from "@/lib/react-animejs/utils/anime-utils";

/**
 * Demo for random utility functions: random, createSeededRandom, randomPick, shuffle
 */
export const RandomUtilitiesDemo: React.FC = () => {
  const [randomValues, setRandomValues] = useState<number[]>([]);
  const [seededValues, setSeededValues] = useState<number[]>([]);
  const [pickedValue, setPickedValue] = useState<string>("");
  const [shuffledArray, setShuffledArray] = useState<string[]>([]);

  const colors = ["#ffd11a", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];
  const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig"];

  const handleGenerateRandom = useCallback(() => {
    const values = Array.from({ length: 6 }, () => random(0, 100));
    setRandomValues(values);
  }, []);

  const handleGenerateSeeded = useCallback(() => {
    const seededRandom = createSeededRandom(42);
    const values = Array.from({ length: 6 }, () => seededRandom() * 100);
    setSeededValues(values);
  }, []);

  const handleRandomPick = useCallback(() => {
    const picked = randomPick(fruits);
    setPickedValue(picked);
  }, []);

  const handleShuffle = useCallback(() => {
    const shuffled = shuffle([...fruits]);
    setShuffledArray(shuffled);
  }, []);

  return (
    <DemoCard
      title="Random Utilities"
      description="random, createSeededRandom, randomPick, shuffle"
      code={`random(0, 100) = [${randomValues.join(", ")}]`}
    >
      <div className="w-full space-y-6">
        {/* Random Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">random(min, max)</span>
            <button
              onClick={handleGenerateRandom}
              className="text-xs bg-demo-accent text-black px-3 py-1 rounded-full font-medium hover:bg-demo-accent/80 transition-colors"
            >
              Generate
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {randomValues.map((val, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-black transition-all duration-300"
                style={{ backgroundColor: colors[i % colors.length] }}
              >
                {val.toFixed(0)}
              </div>
            ))}
          </div>
        </div>

        {/* Seeded Random Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">createSeededRandom(42)</span>
            <button
              onClick={handleGenerateSeeded}
              className="text-xs bg-[#4ecdc4] text-black px-3 py-1 rounded-full font-medium hover:bg-[#4ecdc4]/80 transition-colors"
            >
              Generate
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {seededValues.map((val, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-black transition-all duration-300"
                style={{ backgroundColor: colors[i % colors.length] }}
              >
                {val.toFixed(0)}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-demo-text-muted mt-2">
            Always produces the same sequence with seed 42
          </p>
        </div>

        {/* Random Pick Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">randomPick(array)</span>
            <button
              onClick={handleRandomPick}
              className="text-xs bg-[#ff6b6b] text-white px-3 py-1 rounded-full font-medium hover:bg-[#ff6b6b]/80 transition-colors"
            >
              Pick
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {fruits.map((fruit, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  pickedValue === fruit
                    ? "bg-demo-accent text-black scale-110"
                    : "bg-demo-border text-demo-text-secondary"
                }`}
              >
                {fruit}
              </div>
            ))}
          </div>
        </div>

        {/* Shuffle Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">shuffle(array)</span>
            <button
              onClick={handleShuffle}
              className="text-xs bg-[#96ceb4] text-black px-3 py-1 rounded-full font-medium hover:bg-[#96ceb4]/80 transition-colors"
            >
              Shuffle
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(shuffledArray.length > 0 ? shuffledArray : fruits).map(
              (fruit, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-demo-border text-demo-text-secondary transition-all duration-300"
                >
                  {fruit}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
