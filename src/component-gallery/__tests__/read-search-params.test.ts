import { describe, expect, it } from 'vitest';
import { readSearchParams } from '../hooks';

describe('readSearchParams', () => {
  it('returns safe defaults for an empty object', () => {
    expect(readSearchParams({})).toEqual({
      q: '',
      cat: 'all',
      sort: 'alpha',
      tag: undefined,
    });
  });

  it('passes through valid category, sort, q, and tag', () => {
    expect(readSearchParams({ q: 'timer', cat: 'core', sort: 'recent', tag: 'loop' })).toEqual({
      q: 'timer',
      cat: 'core',
      sort: 'recent',
      tag: 'loop',
    });
  });

  it('rejects an unknown category and falls back to "all"', () => {
    expect(readSearchParams({ cat: 'bogus' }).cat).toBe('all');
    expect(readSearchParams({ cat: 'svg' }).cat).toBe('svg');
  });

  it('rejects an unknown sort and falls back to "alpha"', () => {
    expect(readSearchParams({ sort: 'nonsense' }).sort).toBe('alpha');
    expect(readSearchParams({ sort: 'category' }).sort).toBe('category');
  });

  it('treats an empty/whitespace tag as undefined', () => {
    expect(readSearchParams({ tag: '' }).tag).toBeUndefined();
    expect(readSearchParams({ tag: 'svg' }).tag).toBe('svg');
  });

  it('coerces a non-string q to an empty string', () => {
    expect(readSearchParams({ q: 123 }).q).toBe('');
    expect(readSearchParams({ q: null }).q).toBe('');
  });

  it('ignores non-string cat/sort values', () => {
    expect(readSearchParams({ cat: 42 }).cat).toBe('all');
    expect(readSearchParams({ sort: false }).sort).toBe('alpha');
  });
});
