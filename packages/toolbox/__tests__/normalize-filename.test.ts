import { normalizeFilename } from '../src';

describe('normalizeFilename', () => {
  it('should normalize with capitalized', () => {
    expect(normalizeFilename('MyComponent')).toBe('my-component');
  });

  it('should normalize with snake', () => {
    expect(normalizeFilename('myComponent')).toBe('my-component');
  });

  it('should replace _ with -', () => {
    expect(normalizeFilename('my_component')).toBe('my-component');
  });

  it('should use - for -', () => {
    expect(normalizeFilename('my-component')).toBe('my-component');
  });
});
