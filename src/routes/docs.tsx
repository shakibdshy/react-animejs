import { createFileRoute } from '@tanstack/react-router'
import { DocsPage } from '@/docs'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})
