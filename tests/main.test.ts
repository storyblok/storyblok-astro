import { expect, it } from 'vitest';
import { toCamelCase } from '../src/utils/toCamelCase';

it('converts featured-articles to featuredArticles', () => {
  expect(toCamelCase('featured-articles')).toBe('featuredArticles');
});
