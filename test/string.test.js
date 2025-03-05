// test/string.test.js

import { string } from '../src';
// or can be done as
// import * as string from '../src/string'

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(string.capitalize('hello')).toBe('Hello');
      expect(string.capitalize('world')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(string.capitalize('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(string.capitalize(123)).toBe('');
      expect(string.capitalize(null)).toBe('');
      expect(string.capitalize(undefined)).toBe('');
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(string.reverse('hello')).toBe('olleh');
      expect(string.reverse('world')).toBe('dlrow');
    });

    it('should handle empty strings', () => {
      expect(string.reverse('')).toBe('');
    });

    it('should handle non-string inputs', () => {
      expect(string.reverse(123)).toBe('');
      expect(string.reverse(null)).toBe('');
      expect(string.reverse(undefined)).toBe('');
    });
  });

  // Add more tests for other string functions...
});