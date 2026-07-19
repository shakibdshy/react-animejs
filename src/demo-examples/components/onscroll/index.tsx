import { DemoSection } from '../DemoSection';
import { ScrollPlaybackDemo } from './ScrollPlaybackDemo';
import { ScrollScrubDemo } from './ScrollScrubDemo';
import { ScrollCallbacksDemo } from './ScrollCallbacksDemo';
import { ScrollSmoothSyncDemo } from './ScrollSmoothSyncDemo';
import { ScrollHorizontalAxisDemo } from './ScrollHorizontalAxisDemo';

export const OnScrollGroup = () => {
  return (
    <DemoSection title="Events: onScroll" frameChildren={false}>
      <ScrollPlaybackDemo />
      <ScrollScrubDemo />
      <ScrollCallbacksDemo />
      <ScrollSmoothSyncDemo />
      <ScrollHorizontalAxisDemo />
    </DemoSection>
  );
};

export default OnScrollGroup;
