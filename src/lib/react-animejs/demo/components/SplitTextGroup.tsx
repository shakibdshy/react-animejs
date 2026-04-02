import React from 'react';
import { DemoSection } from './DemoSection';
import {
  SplitTextAdvancedDemo,
  SplitTextAdvancedPropsDemo,
  SplitTextBasicDemo,
  SplitTextCjkDemo,
  SplitTextEffectsDemo,
  SplitTextTemplatesDemo,
} from './text';

export const SplitTextGroup: React.FC = () => {
  return (
    <DemoSection title="Split Text">
      <SplitTextBasicDemo />
      <SplitTextTemplatesDemo />
      <SplitTextCjkDemo />
      <SplitTextEffectsDemo />
      <SplitTextAdvancedDemo />
      <SplitTextAdvancedPropsDemo />
    </DemoSection>
  );
};

export default SplitTextGroup;
