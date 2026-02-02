import { Animate, AnimeProvider, fadeIn, fadeInUp } from "../index";
import { AlternatingTimerDemo } from "./components/AlternatingTimerDemo";
import { ReversedTimerDemo } from "./components/ReversedTimerDemo";
import { PlaybackRateDemo } from "./components/PlaybackRateDemo";
import { TimerCallbacksDemo } from "./components/TimerCallbacksDemo";
import { TimerMethodsDemo } from "./components/TimerMethodsDemo";
import { TimerPropertiesDemo } from "./components/TimerPropertiesDemo";
import { V4FeaturesDemo } from "./components/V4FeaturesDemo";
import { CssSelectorDemo } from "./components/CssSelectorDemo";
import { JsObjectDemo } from "./components/JsObjectDemo";
import { ArrayOfTargetsDemo } from "./components/ArrayOfTargetsDemo";
import { TimelineFeaturesDemo } from "./components/TimelineFeaturesDemo";
import { TimelineTimersDemo } from "./components/TimelineTimersDemo";
import { TimelineAnimationsDemo } from "./components/TimelineAnimationsDemo";
import { CallFunctionsDemo } from "./components/CallFunctionsDemo";
import { HighFidelityTimePosition } from "./components/HighFidelityTimePosition";
import { PlaybackSettingsGroup } from "./components/PlaybackSettingsGroup";
import { SyncWAAPIAnimationsDemo } from "./components/SyncWAAPIAnimationsDemo";
import { SyncTimelinesDemo } from "./components/SyncTimelinesDemo";
import { CallbacksGroup } from "./components/CallbacksGroup";
import { AnimatableDemo } from "./components/AnimatableDemo";
import { AnimatableMethodsDemo } from "./components/methods/AnimatableMethodsDemo";
import MethodsGroup from "./components/MethodsGroup";
import { DraggableDemo } from "./components/DraggableDemo";
import { LayoutDemo } from "./components/LayoutDemo";
import { LayoutSettingsDemo } from "./components/LayoutSettingsDemo";
import { LayoutEnterExitDemo } from "./components/LayoutEnterExitDemo";
import { LayoutStaggerDemo } from "./components/LayoutStaggerDemo";
import { LayoutMethodsDemo } from "./components/LayoutMethodsDemo";
import { AnimeLayoutComponentDemo } from "./components/AnimeLayoutComponentDemo";

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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-8 max-w-375 mx-auto">
          {/* <ConfigurableTimerDemo /> */}
          <AlternatingTimerDemo />
          <ReversedTimerDemo />
          <PlaybackRateDemo />
          <TimerCallbacksDemo />
          <TimerMethodsDemo />
          <TimerPropertiesDemo />
          <V4FeaturesDemo />
          <CssSelectorDemo />
          <JsObjectDemo />
          <ArrayOfTargetsDemo />
          <TimelineFeaturesDemo />
          <TimelineTimersDemo />
          <TimelineAnimationsDemo />
          <CallFunctionsDemo />
          <HighFidelityTimePosition />
          <SyncWAAPIAnimationsDemo />
          <SyncTimelinesDemo />
          <LayoutDemo />
          <LayoutSettingsDemo />
          <LayoutEnterExitDemo />
          <LayoutStaggerDemo />
          <LayoutMethodsDemo />
          <AnimeLayoutComponentDemo />
        </div>

        <div>
          <PlaybackSettingsGroup />
          <CallbacksGroup />
          <MethodsGroup />
          <AnimatableDemo />
          <AnimatableMethodsDemo />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-8 max-w-375 mx-auto">
          <DraggableDemo />
        </div>

        <footer className="text-center p-12 text-[#888]">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
