import { createFileRoute } from '@tanstack/react-router';
import { BlocksPage } from '@/blocks';

export const Route = createFileRoute('/blocks')({
  component: BlocksPage,
});
