// @ts-nocheck
import { random } from './random';

const min = 0;
const max = 5;

describe('random()', () => {

  it('should execute without crashing', () => {
    random(min, max);
  });

  it(`should return a number between ${min} and ${max}`, () => {
    const num = random(min, max);

    expect(typeof num).toBe('number');

    for (let i = 0; i < 1000; i++) {
      expect(num >= min).toBe(true);
      expect(num <= max).toBe(true);
    }
  });
});
