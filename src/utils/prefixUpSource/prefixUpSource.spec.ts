// @ts-nocheck
import { prefixUpSource } from './prefixUpSource';

const prefix = 'my-prefix:';
const str = 'value';
const prefixedStr = 'my-prefix:Value';

describe('prefixUpSource()', () => {

  it('should execute without crashing', () => {
    prefixUpSource(prefix, str);
  });

  it('should add a prefix to the string', () => {
    const prefixed = prefixUpSource(prefix, str);

    expect(prefixed).toBe(prefixedStr);
  });
});
