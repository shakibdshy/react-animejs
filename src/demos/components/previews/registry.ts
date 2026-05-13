import { mapGroup } from './utils';
import type { PreviewProps } from './types';
import { BasicAnimationPreview } from './basic-animation';
import { TimersPreview } from './timers';
import { TimelinesPreview } from './timelines';
import { LayoutPreview } from './layout';
import { ScopePreview } from './scope';
import { EasingsPreview } from './easings';
import { AnimatablePreview } from './animatable';
import { AnimePresencePreview } from './anime-presence';
import { SplitTextPreview } from './split-text';
import { ScrambleTextPreview } from './scramble-text';
import { SvgMorphPreview, SvgDrawPreview, SvgMotionPathPreview } from './svg-previews';
import { DraggablePreview, OnScrollPreview, ReorderListPreview, ScrollLinkedAnimationsPreview } from './interaction-previews';
import { UtilitiesPreview, ToggleSwitchPreview, CounterCountdownPreview, SpinningCubePreview, ClipPathRevealPreview, AnimatedSliderPreview } from './wrapper-previews';

export const previewRegistry: Record<string, React.FC<PreviewProps>> = {
  ...mapGroup(['basic-animation'], BasicAnimationPreview),
  ...mapGroup(['svg-morph'], SvgMorphPreview),
  ...mapGroup(['svg-draw'], SvgDrawPreview),
  ...mapGroup(['svg-motion-path'], SvgMotionPathPreview),
  ...mapGroup(['timer'], TimersPreview),
  ...mapGroup(['timeline'], TimelinesPreview),
  ...mapGroup(['draggable'], DraggablePreview),
  ...mapGroup(['on-scroll'], OnScrollPreview),
  ...mapGroup(['layout'], LayoutPreview),
  ...mapGroup(['scope'], ScopePreview),
  ...mapGroup(['split-text'], SplitTextPreview),
  ...mapGroup(['easings'], EasingsPreview),
  ...mapGroup(['utilities'], UtilitiesPreview),
  ...mapGroup(['animate-presence'], AnimePresencePreview),
  ...mapGroup(['toggle-switch'], ToggleSwitchPreview),
  ...mapGroup(['counter-countdown'], CounterCountdownPreview),
  ...mapGroup(['spinning-cube'], SpinningCubePreview),
  ...mapGroup(['clippath-reveal'], ClipPathRevealPreview),
  ...mapGroup(['animated-slider'], AnimatedSliderPreview),
  ...mapGroup(['reorder-list'], ReorderListPreview),
  ...mapGroup(['scroll-linked-animations'], ScrollLinkedAnimationsPreview),
  ...mapGroup(['scramble-text'], ScrambleTextPreview),
  ...mapGroup(['animatable'], AnimatablePreview),
};

export function getDemoPreview(componentId: string): React.FC<PreviewProps> | undefined {
  return previewRegistry[componentId];
}
