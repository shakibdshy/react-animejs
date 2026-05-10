import { Link } from '@tanstack/react-router'

import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowUpDown,
  Box,
  Eye,
  GitBranch,
  Hash,
  Home,
  Layout,
  Menu,
  MessageSquare,
  Moon,
  MousePointerClick,
  Move,
  PenTool,
  Play,
  Shuffle,
  Sun,
  Timer,
  ToggleLeft,
  Type,
  Webhook,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

const demoLinks = [
  { to: '/demo/core-features', label: 'Core Features', icon: Zap },
  { to: '/demo/svg', label: 'SVG Utilities', icon: PenTool },
  { to: '/demo/timers', label: 'Timers', icon: Timer },
  { to: '/demo/timelines', label: 'Timelines', icon: GitBranch },
  { to: '/demo/playback-settings', label: 'Playback Settings', icon: Play },
  { to: '/demo/callbacks', label: 'Callbacks', icon: MessageSquare },
  { to: '/demo/methods', label: 'Methods', icon: Wrench },
  { to: '/demo/draggable', label: 'Draggable', icon: Move },
  { to: '/demo/onscroll', label: 'On Scroll', icon: MousePointerClick },
  { to: '/demo/layout', label: 'Layout', icon: Layout },
  { to: '/demo/scope', label: 'Scope', icon: Box },
  { to: '/demo/split-text', label: 'Split Text', icon: Type },
  { to: '/demo/scramble-text', label: 'Scramble Text', icon: Shuffle },
  { to: '/demo/animate-presence', label: 'AnimePresence', icon: GitBranch },
  { to: '/demo/animated-slider', label: 'Animated Slider', icon: Play },
  { to: '/demo/clippath-reveal', label: 'ClipPath Reveal', icon: PenTool },
  { to: '/demo/counter-countdown', label: 'Counter', icon: Hash },
  { to: '/demo/easings', label: 'Easings', icon: Activity },
  { to: '/demo/reorder-list', label: 'Reorder List', icon: ArrowUpDown },
  { to: '/demo/scroll-linked-animations', label: 'Scroll Linked', icon: Eye },
  { to: '/demo/spinning-cube', label: 'Spinning Cube', icon: Box },
  { to: '/demo/svg-path-draw', label: 'SVG Path Draw', icon: PenTool },
  { to: '/demo/toggle-switch', label: 'Toggle Switch', icon: ToggleLeft },
  { to: '/demo/utilities', label: 'Utilities', icon: Wrench },
] as const

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('demo-theme')
    const preferDark = stored !== null ? stored === 'dark' : true
    setIsDark(preferDark)
    document.documentElement.classList.toggle('dark', preferDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('demo-theme', next ? 'dark' : 'light')
  }

  return (
    <>
      <header className="p-4 flex items-center bg-demo-surface text-demo-text border-b border-demo-border">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-demo-card-hover rounded-lg transition-colors duration-200 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold flex-1">
          <Link to="/" className="text-demo-accent hover:text-demo-accent/80 transition-colors duration-200">
            React AnimeJS
          </Link>
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-demo-card-hover rounded-lg transition-colors duration-200 cursor-pointer text-demo-text-secondary hover:text-demo-accent"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-demo-bg text-demo-text shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-demo-border ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-demo-border">
          <h2 className="text-xl font-bold text-demo-accent">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-demo-card-hover rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-demo-card-hover transition-colors duration-200 mb-2 cursor-pointer"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-demo-card-hover text-demo-accent transition-colors duration-200 mb-2 cursor-pointer',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/demos"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-demo-card-hover transition-colors duration-200 mb-2 cursor-pointer"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-demo-card-hover text-demo-accent transition-colors duration-200 mb-2 cursor-pointer',
            }}
          >
            <Layout size={20} />
            <span className="font-medium">Components Gallery</span>
          </Link>

          <div className="mt-4 mb-2 px-3 text-xs font-semibold text-demo-text-muted uppercase tracking-wider">
            Demo Sections
          </div>

          {demoLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-demo-card-hover transition-colors duration-200 mb-1 cursor-pointer"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-demo-card-hover text-demo-accent transition-colors duration-200 mb-1 cursor-pointer',
              }}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}

          <div className="mt-4 border-t border-demo-border pt-4">
            <Link
              to="/mcp"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-demo-card-hover transition-colors duration-200 mb-2 cursor-pointer"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-demo-card-hover text-demo-accent transition-colors duration-200 mb-2 cursor-pointer',
              }}
            >
              <Webhook size={20} />
              <span className="font-medium">MCP</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
