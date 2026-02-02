import { Animate, AnimeProvider, fadeIn, fadeInUp } from "../index";
import { PlaybackSettingsGroup } from "./components/PlaybackSettingsGroup";
import { CallbacksGroup } from "./components/CallbacksGroup";
import MethodsGroup from "./components/MethodsGroup";
import { DraggableDemo } from "./components/DraggableDemo";

import { CoreFeaturesGroup } from "./components/CoreFeaturesGroup";
import { TimersGroup } from "./components/TimersGroup";
import { TimelinesGroup } from "./components/TimelinesGroup";
import { LayoutGroup } from "./components/LayoutGroup";
import { AnimatableGroup } from "./components/AnimatableGroup";

/**
 * Main React Anime.js Demo Page
 *
 * Assembles modular demo components into a grid layout.
 * Each component follows the Single Source of Truth principle and is isolated for better maintainability.
 */
export default function ReactAnimejsDemo() {
  return (
    <AnimeProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] p-8 font-sans">
        <header className="text-center mb-12 p-8">
          <Animate {...fadeInUp} autoplay>
            <h1 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-[#ffd11a] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent uppercase tracking-widest">
              🎬 React Anime.js
            </h1>
          </Animate>
          <Animate {...fadeIn} delay={200} autoplay>
            <p className="text-xl text-[#888] font-medium tracking-tight">
              A comprehensive React wrapper for Anime.js v4
            </p>
          </Animate>
        </header>

        <div className="max-w-7xl mx-auto space-y-24">
          <CoreFeaturesGroup />
          <TimelinesGroup />
          <PlaybackSettingsGroup />
          <CallbacksGroup />
          <MethodsGroup />
          <TimersGroup />
          <AnimatableGroup />
          <LayoutGroup />

          <div className="grid grid-cols-1 gap-8 mt-16">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
              <span className="w-2 h-8 bg-[#ffd11a] rounded-full" />
              Interactions & Draggable
            </h2>
            <DraggableDemo />
          </div>
        </div>

        <footer className="text-center p-24 text-[#888] mt-24 border-t border-white/5">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
