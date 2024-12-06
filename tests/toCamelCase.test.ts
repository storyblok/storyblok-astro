import { describe, expect, it } from 'vitest';
import { toCamelCase } from '../src/utils/toCamelCase';

describe('toCamelCase', () => {
  it('converts foo-bar to fooBar', () => {
    expect(toCamelCase('foo-bar')).toBe('fooBar');
  });

  it('converts foo_bar to fooBar', () => {
    expect(toCamelCase('foo_bar')).toBe('fooBar');
  });

  it('converts Foo-Bar to fooBar', () => {
    expect(toCamelCase('Foo-Bar')).toBe('fooBar');
  });

  it('converts --foo.bar to fooBar', () => {
    expect(toCamelCase('--foo.bar')).toBe('fooBar');
  });

  it('converts foo bar to fooBar', () => {
    expect(toCamelCase('foo bar')).toBe('fooBar');
  });

  it('handles empty strings gracefully', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('does not alter already camelCased strings', () => {
    expect(toCamelCase('alreadyCamelCased')).toBe('alreadyCamelCased');
  });
});
