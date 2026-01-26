import { Animate, AnimeProvider, fadeIn, fadeInUp } from "../index";
import "./demo.css";

// Import Modular Demo Components
import { AdvancedTimerDemo } from "./components/AdvancedTimerDemo";
import { DraggableDemo } from "./components/DraggableDemo";

/**
 * Main React Anime.js Demo Page
 *
 * Assembles modular demo components into a grid layout.
 * Each component follows the Single Source of Truth principle and is isolated for better maintainability.
 */
export default function ReactAnimejsDemo() {
  return (
    <AnimeProvider>
      <div className="demo-page">
        <header className="demo-header">
          <Animate {...fadeInUp} autoplay>
            <h1>🎬 React Anime.js</h1>
          </Animate>
          <Animate {...fadeIn} delay={200} autoplay>
            <p>A comprehensive React wrapper for Anime.js v4</p>
          </Animate>
        </header>

        <main className="demo-grid">
          <AdvancedTimerDemo />
          <DraggableDemo />
        </main>

        <footer className="demo-footer">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
