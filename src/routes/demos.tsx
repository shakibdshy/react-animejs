import { createFileRoute } from "@tanstack/react-router";
import { ComponentGalleryPage } from '@/component-gallery';

export const Route = createFileRoute("/demos")({
  component: ComponentGalleryPage,
});
