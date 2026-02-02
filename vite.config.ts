import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig(() => {
  const isTest = process.env.VITEST === 'true' || process.env.VITEST === '1'

  return {
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      server: {
        deps: {
          inline: ['react', 'react-dom'],
        },
      },
    },
    plugins: [
      ...(isTest
        ? [
            viteTsConfigPaths({
              projects: ['./tsconfig.json'],
            }),
            viteReact({
              babel: {
                plugins: [],
              },
            }),
          ]
        : [
            devtools(),
            nitro(),
            viteTsConfigPaths({
              projects: ['./tsconfig.json'],
            }),
            tailwindcss(),
            tanstackStart(),
            viteReact({
              babel: {
                plugins: ['babel-plugin-react-compiler'],
              },
            }),
          ]),
    ],
  }
})
