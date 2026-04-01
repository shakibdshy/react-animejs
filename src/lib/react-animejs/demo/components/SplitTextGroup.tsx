import React from 'react';
import { DemoSection } from './DemoSection';
import {
  SplitTextAdvancedDemo,
  SplitTextBasicDemo,
  SplitTextCjkDemo,
  SplitTextEffectsDemo,
  SplitTextTemplatesDemo,
} from './text';

export const SplitTextGroup: React.FC = () => {
  return (
    <DemoSection title="Split Text">
      {/* Overview */}
      <SplitTextBasicDemo />
      <SplitTextTemplatesDemo />
      <SplitTextCjkDemo />
      <SplitTextEffectsDemo />
      <SplitTextAdvancedDemo />
    </DemoSection>
  );
};

export default SplitTextGroup;
