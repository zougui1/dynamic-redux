// @ts-nocheck
import { createSpecificActionDecorator } from './createSpecificActionDecorator';

describe('createSpecificActionDecorator()', () => {

  it('should execute without crashing without parameter', () => {
    createSpecificActionDecorator();
  });

  it('should execute without crashing with a string parameter', () => {
    createSpecificActionDecorator('set');
  });

  it('should execute without crashing with an array of string parameter', () => {
    createSpecificActionDecorator(['set']);
  });

  it('should return a function that returns a function without parameter', () => {
    const decorator = createSpecificActionDecorator();

    expect(typeof decorator).toBe('function');
    expect(typeof decorator()).toBe('function');
  });

  it('should return a function that returns a function with a string parameter', () => {
    const decorator = createSpecificActionDecorator('set');

    expect(typeof decorator).toBe('function');
    expect(typeof decorator()).toBe('function');
  });

  it('should return a function that returns a function with an array of string parameter', () => {
    const decorator = createSpecificActionDecorator(['set']);

    expect(typeof decorator).toBe('function');
    expect(typeof decorator()).toBe('function');
  });
});
