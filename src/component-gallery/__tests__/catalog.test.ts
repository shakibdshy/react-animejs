import { describe, expect, it } from 'vitest';
import { demoDetails, demoSections } from '../data';
import { galleryPreviewRegistry } from '../components/gallery-preview';
import { previewRegistry } from '../components/detail-previews/registry';

describe('component gallery catalog', () => {
  it('connects every catalog item to its details and both preview surfaces', () => {
    for (const demo of demoSections) {
      expect(demoDetails[demo.componentId]).toBeDefined();
      expect(galleryPreviewRegistry[demo.componentId]).toBeDefined();
      expect(previewRegistry[demo.componentId]).toBeDefined();
    }
  });
});
