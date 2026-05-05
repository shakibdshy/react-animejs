import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import {
  Anime,
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
    title: "SVG Path Drawing",
    path: "/demo/svg-path-draw",
    description:
      "Animated SVG path drawing — waves, hearts, lightning, landscapes, and more",
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
    title: "AnimePresence",
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
  {
    title: "Animated Slider",
    path: "/demo/animated-slider",
    description:
      "Smooth slide transitions with left/right navigation and multiple effects",
  },
  {
    title: "Reorder Animation",
    path: "/demo/reorder-list",
    description:
      "Animated reorder with FLIP layout, add/remove, and grid layout changes",
  },
  {
    title: "SVG Path Drawing",
    path: "/demo/svg-path-draw",
    description:
      "SVG path drawing effects — wave, heart, star, globe, landscape, and more",
  },
  {
    title: "Scroll-Linked Animations",
    path: "/demo/scroll-linked-animations",
    description:
      "Parallax, fade-in, horizontal scrub, scale/rotate, color shift, and progress indicators",
  },
  {
    title: "Scramble Text",
    path: "/demo/scramble-text",
    description:
      "Text scramble/reveal effect with custom chars, reveal rate, cursor, and looping",
  },
] as const;

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <AnimeProvider>
      <div className="min-h-screen bg-demo-bg text-demo-text p-8 font-sans">
        <header className="text-center mb-12 p-8">
          <Anime {...fadeInUp} autoplay>
            <h1 className="text-5xl font-extrabold mb-4 inline-flex items-center gap-4 justify-center">
              <Play className="w-8 h-8 text-demo-accent" />
              <span className="bg-linear-to-r from-demo-accent to-amber-500 bg-clip-text text-transparent">
                React Anime.js
              </span>
            </h1>
          </Anime>
          <Anime {...fadeIn} delay={200} autoplay>
            <p className="text-xl text-demo-text-secondary font-medium tracking-tight">
              A comprehensive React wrapper for Anime.js v4
            </p>
          </Anime>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoSections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="block bg-demo-card rounded-2xl p-6 border border-demo-border hover:border-demo-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-demo-accent/10 group cursor-pointer"
            >
              <h3 className="text-lg font-bold text-demo-text mb-2 group-hover:text-demo-accent transition-colors duration-200">
                {section.title}
              </h3>
              <p className="text-sm text-demo-text-secondary leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        <footer className="text-center p-12 text-demo-text-secondary">
          <p className="inline-flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-demo-accent" /> using React + Anime.js v4
          </p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
