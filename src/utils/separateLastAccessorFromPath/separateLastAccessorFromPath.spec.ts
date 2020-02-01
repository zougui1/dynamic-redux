// @ts-nocheck
import { separateLastAccessorFromPath } from './separateLastAccessorFromPath';

const path = 'some.nested.stuff';
const pathWithIndexing = 'some.array[15].with.object';
const pathLastIndexing = 'some.nested.array[10]';

describe('separateLastAccessorFromPath()', () => {

  it('should execute without crashing', () => {
    separateLastAccessorFromPath(path);
    separateLastAccessorFromPath(pathWithIndexing);
    separateLastAccessorFromPath(pathLastIndexing);
  });

  it('should return an object with "stuff" as lastPath and "some.nested" as path', () => {
    const paths = separateLastAccessorFromPath(path);

    expect(typeof paths).toBe('object');
    expect(paths.path).toBe('some.nested');
    expect(paths.lastPath).toBe('stuff');
  });

  it('should return an object with "object" as lastPath and "some.array[15].with" as path', () => {
    const paths = separateLastAccessorFromPath(pathWithIndexing);

    expect(typeof paths).toBe('object');
    expect(paths.path).toBe('some.array[15].with');
    expect(paths.lastPath).toBe('object');
  });

  it('should return an object with the number 10 as lastPath and "some.nested.array" as path', () => {
    const paths = separateLastAccessorFromPath(pathLastIndexing);

    expect(typeof paths).toBe('object');
    expect(paths.path).toBe('some.nested.array');
    expect(paths.lastPath).toBe(10);
  });
});
