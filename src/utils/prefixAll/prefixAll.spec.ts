// @ts-nocheck
import { prefixAll } from './prefixAll';

const prefix = 'my-prefix:';
const strings = ['a string', 'something', 'else'];
const prefixedStrings = ['my-prefix:A string', 'my-prefix:Something', 'my-prefix:Else'];

describe('prefixAll()', () => {

  it('should execute without crashing', () => {
    prefixAll(prefix, strings);
  });

  it('should add a prefix to all the strings in the array', () => {
    const prefixed = prefixAll(prefix, strings);

    expect(prefixed.join(';')).toBe(prefixedStrings.join(';'));
  });

  it('should return an array with the same length as the one passed into the parameters', () => {
    const prefixed = prefixAll(prefix, strings);

    expect(prefixed.length).toBe(strings.length);
  });
});
