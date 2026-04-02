import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  Webhook,
  X,
  Zap,
  PenTool,
  Timer,
  GitBranch,
  Play,
  MessageSquare,
  Wrench,
  Move,
  MousePointerClick,
  Layout,
  Box,
  Type,
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
] as const

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="h-10"
            />
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <div className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Demo Sections
          </div>

          {demoLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-1"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-1',
              }}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}

          <div className="mt-4 border-t border-gray-700 pt-4">
            <Link
              to="/mcp"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
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
