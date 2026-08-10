import { createFileRoute } from '@tanstack/react-router';
import { StackedCardsDemo } from '@/demo-examples/components/pin';

export const Route = createFileRoute('/demo/scroll-pin')({
  component: ScrollPinPage,
});

function ScrollPinPage() {
  return <StackedCardsDemo />;
}
