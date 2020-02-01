// @ts-nocheck
import { prefixer } from './prefixer';

const prefix = 'my-prefix:';
const str = 'value';
const prefixedStr = 'my-prefix:value';

describe('prefixer()', () => {

  it('should execute without crashing', () => {
    prefixer(prefix, str);
  });

  it('should add a prefix to the string', () => {
    const prefixed = prefixer(prefix, str);

    expect(prefixed).toBe(prefixedStr);
  });
});
