# React AnimeJS — Docs & Demos

The documentation site and component gallery for **[`@shakibdshy/react-animejs`](https://www.npmjs.com/package/@shakibdshy/react-animejs)** — a comprehensive React wrapper for [Anime.js v4](https://animejs.com).

🌐 **Live site:** [react-animejs.vercel.app](https://react-animejs.vercel.app/)

This repo contains the marketing landing page, interactive component gallery, API reference docs, and the "blocks" showcase — all powered by the published `@shakibdshy/react-animejs` package. **The library itself lives in a separate package** (see [Relationship to the package](#relationship-to-the-package) below).

## ✨ What's in this repo

| Folder | Purpose |
| ------ | ------- |
| `src/landing` | Marketing landing page (hero, features, code showcase, CTA) |
| `src/component-gallery` | Interactive gallery of every hook & component, with live previews and code |
| `src/blocks` | Self-contained "blocks" — larger animation patterns (scroll reveals, grids, cursors, morphs) |
| `src/demo-examples` | Individual example components backing the gallery detail pages |
| `src/docs` | API reference data + docs page (hooks, components, presets, stagger helpers) |
| `src/routes` | TanStack file-based routes (`/`, `/demos`, `/demos/:slug`, `/blocks`, `/docs`) |
| `src/theme` | Light/dark theme system |

## 🚀 Getting started

### Prerequisites

- Node.js `>=18`
- pnpm `>=10` (`npm i -g pnpm`)

### Install & run

```bash
pnpm install
pnpm dev
```

The dev server starts on **http://localhost:3002**.

### Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start the Vite dev server (port 3002) |
| `pnpm build` | Production build (outputs to `.output/` via Nitro) |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run the Vitest test suite |
| `pnpm typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |

## 🛠 Tech stack

- **[TanStack Start](https://tanstack.com/start)** + **[TanStack Router](https://tanstack.com/router)** — full-stack React framework with file-based routing and SSR
- **[Vite](https://vitejs.dev)** — bundler/dev server
- **[Tailwind CSS v4](https://tailwindcss.com)** — styling
- **[Vitest](https://vitest.dev)** + **[@testing-library/react](https://testing-library.com)** — testing
- **[React Compiler](https://react.dev/learn/react-compiler)** — automatic memoization
- **[@shakibdshy/react-animejs](https://www.npmjs.com/package/@shakibdshy/react-animejs)** — the animation library this site documents

## Relationship to the package

This repo is the **docs & demos site**. The animation library itself is a separate npm package, **[`@shakibdshy/react-animejs`](https://www.npmjs.com/package/@shakibdshy/react-animejs)**, which is published to the npm registry only (its source is not in this repo).

| | This repo | The package |
| --- | --- | --- |
| **What** | Docs site & component gallery (deployed to Vercel) | The reusable animation library |
| **npm** | _(not published — `private: true`)_ | `@shakibdshy/react-animejs` |
| **Source on GitHub** | ✅ This repo | ❌ npm-only |
| **Relationship** | Consumes the package | Independent |

The demo installs the package from the npm registry like any other consumer:

```json
"dependencies": {
  "@shakibdshy/react-animejs": "^1.0.0"
}
```

> **Note on the `repository` field:** the package's npm `repository` link points to this repo (`github.com/shakibdshy/react-animejs`) as the project's public home, even though the library source itself lives only on npm. This is intentional — this repo is where issues, the live demo, and project context live.

## 📁 Project structure

```
src/
├── landing/              # Marketing page sections
├── component-gallery/    # Interactive gallery (the /demos routes)
├── blocks/               # Larger showcase blocks (the /blocks route)
├── demo-examples/        # Example components for gallery detail pages
├── docs/                 # API reference (the /docs route)
├── routes/               # TanStack file-based routes
├── theme/                # Theme provider + system
├── lib/                  # Demo utilities (cn() class-merge helper)
└── styles.css            # Global styles
```

## 🚢 Deployment

The site auto-deploys to **[Vercel](https://react-animejs.vercel.app/)** on push to `main`. Vercel runs `pnpm build` (Vite + Nitro) and serves the `.output/` directory.

## License

MIT © [Shakib](https://github.com/shakibdshy)
