import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Animate,
  AnimeProvider,
  fadeIn,
  fadeInUp,
} from "@/lib/react-animejs/index";

const demoSections = [
  {
    title: "Core Features",
    path: "/demo/core-features",
    description:
      "CSS selectors, JS objects, array targets, v4 features, call functions",
  },
  {
    title: "SVG Utilities",
    path: "/demo/svg",
    description: "Advanced SVG animation utilities and helpers",
  },
  {
    title: "Timers",
    path: "/demo/timers",
    description:
      "Standalone timers, alternating, reversed, delay, callbacks, methods",
  },
  {
    title: "Timelines",
    path: "/demo/timelines",
    description:
      "Timeline animations, features, syncing, WAAPI integration",
  },
  {
    title: "Playback Settings",
    path: "/demo/playback-settings",
    description:
      "Defaults, delay, loop, alternate, reversed, autoplay, frame rate",
  },
  {
    title: "Callbacks",
    path: "/demo/callbacks",
    description:
      "onBegin, onComplete, onUpdate, onRender, onLoop, onPause, then",
  },
  {
    title: "Methods",
    path: "/demo/methods",
    description:
      "Playback, add, set, sync, labels, remove, refresh, stretch, revert",
  },
  {
    title: "Draggable",
    path: "/demo/draggable",
    description:
      "Drag interactions, spring physics, snapping, constraints, controls",
  },
  {
    title: "On Scroll",
    path: "/demo/onscroll",
    description: "Scroll-triggered playback, scrub, directional callbacks",
  },
  {
    title: "Layout",
    path: "/demo/layout",
    description:
      "Layout animations, enter/exit, stagger, methods, AnimeLayout component",
  },
  {
    title: "Scope",
    path: "/demo/scope",
    description:
      "Scoping, constructor, root, defaults, media queries, methods, revert",
  },
  {
    title: "Split Text",
    path: "/demo/split-text",
    description:
      "Text splitting, templates, CJK support, effects, advanced patterns",
  },
  {
    title: "Easings",
    path: "/demo/easings",
    description:
      "cubicBezier, linear, steps, irregular, spring physics",
  },
  {
    title: "Utilities",
    path: "/demo/utilities",
    description:
      "Math, random, string, DOM and value utility functions",
  },
  {
    title: "Animate Presence",
    path: "/demo/animate-presence",
    description:
      "Enter/exit animations with sync, wait, and popLayout modes",
  },
  {
    title: "Toggle Switch",
    path: "/demo/toggle-switch",
    description:
      "Animated toggle switch with smooth transitions",
  },
  {
    title: "Counter & Countdown",
    path: "/demo/counter-countdown",
    description:
      "Animated counters and countdown timers with formatting",
  },
  {
    title: "Spinning 3D Cube",
    path: "/demo/spinning-cube",
    description:
      "CSS 3D cube with anime.js rotation, axis control, and speed variants",
  },
  {
    title: "ClipPath Reveal",
    path: "/demo/clippath-reveal",
    description:
      "Custom clipPath animations — circle, diamond, star, horizontal & vertical wipes",
  },
] as const;

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
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

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoSections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="block bg-[#1a1a24] rounded-2xl p-6 border border-[#2a2a3a] hover:border-[#ffd11a]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffd11a]/10 group"
            >
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ffd11a] transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        <footer className="text-center p-12 text-[#888]">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
