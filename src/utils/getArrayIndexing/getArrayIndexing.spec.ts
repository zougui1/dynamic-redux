// @ts-nocheck
import { getArrayIndexing } from './getArrayIndexing';

const path = 'some.nested.stuff.array[5]';
const pathWith2DigitsIndex = 'some.nested.stuff.array[50]';

describe('getArrayIndexing()', () => {

  it('should execute without crashing', () => {
    getArrayIndexing(path);
  });

  it('should return an array with a length of 2', () => {
    const arrayIndexing = getArrayIndexing(path);

    expect(arrayIndexing.length).toBe(2);
  });

  it('should return the path from the beginning to the array indexing (excluded) at the first index', () => {
    const arrayIndexing = getArrayIndexing(path);

    expect(arrayIndexing[0]).toBe('some.nested.stuff.array');
  });

  it('should return the number of the array indexing at the second index', () => {
    const arrayIndexing = getArrayIndexing(path);

    expect(arrayIndexing[1]).toBe('5');
  });

  it('should return the path from the beginning to the array indexing (excluded) at the first index with an index of 2 digits', () => {
    const arrayIndexing = getArrayIndexing(pathWith2DigitsIndex);

    expect(arrayIndexing[0]).toBe('some.nested.stuff.array');
  });

  it('should return the number of the array indexing at the second index with an index of 2 digits', () => {
    const arrayIndexing = getArrayIndexing(pathWith2DigitsIndex);

    expect(arrayIndexing[1]).toBe('50');
  });
});
