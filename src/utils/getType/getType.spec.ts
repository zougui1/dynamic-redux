// @ts-nocheck
import { getType } from './getType';

describe('getType()', () => {

  it('should execute without crashing', () => {
    getType();
  });

  it('should return the same type as "typeof" for all element except the arrays', () => {
    expect(getType(null)).toBe(typeof null);
    expect(getType('str')).toBe(typeof 'str');
    expect(getType(true)).toBe(typeof true);
    expect(getType({})).toBe(typeof {});
    expect(getType(42)).toBe(typeof 42);
    expect(getType(/()/)).toBe(typeof /()/);
    expect(getType([])).not.toBe(typeof []);
  });

  it('should return a specific type for the arrays', () => {
    expect(getType([])).toBe('array');
  });
});
