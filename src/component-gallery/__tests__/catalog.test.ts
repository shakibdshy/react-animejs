import { describe, expect, it } from 'vitest';
import { demoDetails, demoSections } from '../data';
import { galleryPreviewRegistry } from '../components/gallery-preview';
import { previewRegistry } from '../components/detail-previews/registry';
import { demoDocsLinks } from '../data/docs-links';
import { componentReferences, hookReferences } from '@/docs/reference-data';

const validDocsAnchors = new Set(
  [...hookReferences, ...componentReferences].map((entry) => entry.id),
);

describe('component gallery catalog', () => {
  it('connects every catalog item to its details and both preview surfaces', () => {
    for (const demo of demoSections) {
      expect(demoDetails[demo.componentId]).toBeDefined();
      expect(galleryPreviewRegistry[demo.componentId]).toBeDefined();
      expect(previewRegistry[demo.componentId]).toBeDefined();
    }
  });

  it('every demo has a docs-links entry whose anchor exists in the docs reference', () => {
    for (const demo of demoSections) {
      const link = demoDocsLinks[demo.componentId];
      expect(link, `docs link for ${demo.componentId}`).toBeDefined();
      expect(
        validDocsAnchors.has(link.anchor),
        `anchor "${link.anchor}" for ${demo.componentId}`,
      ).toBe(true);
      for (const extra of link.extras ?? []) {
        expect(
          validDocsAnchors.has(extra),
          `extra anchor "${extra}" for ${demo.componentId}`,
        ).toBe(true);
      }
    }
  });

  it('every docsAnchor on a section matches the docs-links map anchor', () => {
    for (const demo of demoSections) {
      if (demo.docsAnchor) {
        expect(demo.docsAnchor).toBe(demoDocsLinks[demo.componentId].anchor);
      }
    }
  });

  it('optional fields are well-formed when present', () => {
    for (const demo of demoSections) {
      if (demo.difficulty) {
        expect(['beginner', 'intermediate', 'advanced']).toContain(demo.difficulty);
      }
      if (demo.tags) {
        expect(demo.tags.length).toBeGreaterThan(0);
        expect(new Set(demo.tags).size).toBe(demo.tags.length); // no duplicates
      }
    }
  });
});
