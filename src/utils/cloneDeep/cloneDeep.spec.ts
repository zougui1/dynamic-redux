// @ts-nocheck
import { cloneDeep } from './cloneDeep';

const toClone = {
  myString: 'my value',
  myObject: {
    myNumber: 5,
  },
  myArray: [true, 'false'],
};

describe('cloneDeep()', () => {

  it('should execute without crashing', () => {
    cloneDeep(toClone);
  });

  it('should return a value that fails the strict equality comparison', () => {
    const cloned = cloneDeep(toClone);

    expect(cloned === toClone).toBe(false);
  });

  it('should return an object whose reference values fails the strict equality comparison', () => {
    const cloned = cloneDeep(toClone);

    expect(cloned.myArray === toClone.myArray).toBe(false);
    expect(cloned.myObject === toClone.myObject).toBe(false);
  });

  it('should return the exact same value', () => {
    const cloned = cloneDeep(toClone);

    expect(typeof cloned).toBe('object');
    expect(Array.isArray(cloned)).toBe(false);
    expect(cloned.myString).toBe(toClone.myString);
    expect(Object.keys(cloned).length).toBe(Object.keys(toClone).length);
    expect(cloned.myObject.myNumber).toBe(toClone.myObject.myNumber);
    expect(cloned.myArray.length).toBe(toClone.myArray.length);
    expect(cloned.myArray[0]).toBe(toClone.myArray[0]);
    expect(cloned.myArray[1]).toBe(toClone.myArray[1]);
  });
});
