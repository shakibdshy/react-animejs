import { Animate, AnimeProvider, fadeIn, fadeInUp } from "../index";
import { CoreFeaturesGroup } from "./components/CoreFeaturesGroup";
import { TimelinesGroup } from "./components/TimelinesGroup";
import { TimersGroup } from "./components/TimersGroup";
import { PlaybackSettingsGroup } from "./components/PlaybackSettingsGroup";
import { CallbacksGroup } from "./components/CallbacksGroup";
import MethodsGroup from "./components/MethodsGroup";
import { LayoutGroup } from "./components/LayoutGroup";
import { DraggableDemo } from "./components/DraggableDemo";
import ScopeGroup from "./components/ScopeGroup";

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
            <h1 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🎬 React Anime.js
            </h1>
          </Animate>
          <Animate {...fadeIn} delay={200} autoplay>
            <p className="text-xl text-[#888] font-medium tracking-tight">
              A comprehensive React wrapper for Anime.js v4
            </p>
          </Animate>
        </header>

        <CoreFeaturesGroup />
        
        <TimersGroup />
        <TimelinesGroup />
        <PlaybackSettingsGroup />
        <CallbacksGroup />
        <MethodsGroup />
        <DraggableDemo />
        <LayoutGroup />
        <ScopeGroup />

        <footer className="text-center p-12 text-[#888]">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
