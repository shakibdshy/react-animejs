import cursorTrailSource from '@/demo-examples/components/CursorTrailImagesDemo.tsx?raw';
import addToCardSource from './components/AddToCard.tsx?raw';
import pointerGridSource from './components/PointerCollisionGrid.tsx?raw';
import tiltCardSource from './components/TiltCard.tsx?raw';
import imageRevealSource from './components/ImageRevealSlider.tsx?raw';
import cursorTrackingSource from './components/CursorTrackingPreview.tsx?raw';
import dockSource from './components/MacOSDock.tsx?raw';
import easeReverseSource from './components/OrchestratedEaseReverse.tsx?raw';
import scrubbedBentoSource from './components/ScrubbedBentoGallery.tsx?raw';
import scrollBatchSource from './components/ScrollBatchGallery.tsx?raw';
import canvasParticlesSource from './components/CanvasParticles.tsx?raw';
import curveSwipeSource from './components/CurveSwipe.tsx?raw';
import dynamicShapeOverlaysSource from './components/DynamicShapeOverlays.tsx?raw';
import horizontalSplitTextSource from './components/HorizontalSplitText.tsx?raw';
import gridFlipModalSource from './components/GridFlipModal.tsx?raw';
import animateCssGridFlipSource from './components/AnimateCssGridFlip.tsx?raw';
import scrollImageSequenceSource from './components/ScrollImageSequence.tsx?raw';
import scrollImageComparisonSource from './components/ScrollImageComparison.tsx?raw';
import animatedContinuousSectionsSource from './components/AnimatedContinuousSections.tsx?raw';
import layeredPinningLoopSource from './components/LayeredPinningLoop.tsx?raw';
import scrollShaderSource from './components/ScrollShader.tsx?raw';

export type BlockCodeTarget = {
  title: string;
  code: string;
};

/** Exact source displayed by each block's code modal. */
export const SOURCE_BY_KEY: Record<string, BlockCodeTarget> = {
  'cursor-trail': { title: 'CursorTrailImagesDemo.tsx', code: cursorTrailSource },
  'grid-flip-modal': { title: 'GridFlipModal.tsx', code: gridFlipModalSource },
  'animate-css-grid-flip': { title: 'AnimateCssGridFlip.tsx', code: animateCssGridFlipSource },
  'add-to-card': { title: 'AddToCard.tsx', code: addToCardSource },
  'pointer-grid': { title: 'PointerCollisionGrid.tsx', code: pointerGridSource },
  'tilt-card': { title: 'TiltCard.tsx', code: tiltCardSource },
  'image-reveal': { title: 'ImageRevealSlider.tsx', code: imageRevealSource },
  'cursor-tracking': { title: 'CursorTrackingPreview.tsx', code: cursorTrackingSource },
  'macos-dock': { title: 'MacOSDock.tsx', code: dockSource },
  'orchestrated-easereverse': { title: 'OrchestratedEaseReverse.tsx', code: easeReverseSource },
  'scrubbed-bento': { title: 'ScrubbedBentoGallery.tsx', code: scrubbedBentoSource },
  'scroll-batch': { title: 'ScrollBatchGallery.tsx', code: scrollBatchSource },
  'canvas-particles': { title: 'CanvasParticles.tsx', code: canvasParticlesSource },
  'curve-swipe': { title: 'CurveSwipe.tsx', code: curveSwipeSource },
  'dynamic-shape-overlays': { title: 'DynamicShapeOverlays.tsx', code: dynamicShapeOverlaysSource },
  'horizontal-split-text': { title: 'HorizontalSplitText.tsx', code: horizontalSplitTextSource },
  'scroll-image-sequence': { title: 'ScrollImageSequence.tsx', code: scrollImageSequenceSource },
  'scroll-image-comparison': {
    title: 'ScrollImageComparison.tsx',
    code: scrollImageComparisonSource,
  },
  'animated-continuous-sections': {
    title: 'AnimatedContinuousSections.tsx',
    code: animatedContinuousSectionsSource,
  },
  'layered-pinning-loop': { title: 'LayeredPinningLoop.tsx', code: layeredPinningLoopSource },
  'scroll-shader': { title: 'ScrollShader.tsx', code: scrollShaderSource },
};
