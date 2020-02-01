// @ts-nocheck
import { merge } from './merge';

const object1 = {
  a: 'a',
  b: 'b',
  c: 'c',
};

const object2 = {
  c: 'not c',
  d: 'd',
  e: 'e',
};

const object3 = {
  f: 'f',
};

describe('merge()', () => {

  it('should execute without crashing', () => {
    merge(object1, object2);
  });

  it('should return an object containing the same the values as both objects, the second object overriding the first\'s values if necessary', () => {
    const merged = merge(object1, object2);

    expect(merged.a).toBe(object1.a);
    expect(merged.b).toBe(object1.b);
    expect(merged.c).toBe(object2.c);
    expect(merged.d).toBe(object2.d);
    expect(merged.e).toBe(object2.e);
  });

  it('should return an object containing the same the values as many objects as given, the lastest object overriding the previouses\' values if necessary', () => {
    const merged = merge(object1, object2, object3, {});

    expect(merged.a).toBe(object1.a);
    expect(merged.b).toBe(object1.b);
    expect(merged.c).toBe(object2.c);
    expect(merged.d).toBe(object2.d);
    expect(merged.e).toBe(object2.e);
    expect(merged.f).toBe(object3.f);
  });
});
