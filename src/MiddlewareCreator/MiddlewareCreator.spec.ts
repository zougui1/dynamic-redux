// @ts-nocheck
import { MiddlewareCreator } from './MiddlewareCreator';

describe('MiddlewareCreator()', () => {

  it('should construct without crashing', () => {
    const middleware = new MiddlewareCreator('test', 'set').handle(() => () => () => null);
  });

  it('should save the action name into a property', () => {
    const middleware = new MiddlewareCreator('test', 'set').handle(() => () => () => null);

    expect(middleware.actionName).toBe('test');
  });

  it('should save the action kind into a property', () => {
    const middleware = new MiddlewareCreator('test', 'set').handle(() => () => () => null);

    expect(middleware.actionKind).toBe('set');
  });

  it('should accept star ("*") as a valid action kind', () => {
    const middleware = new MiddlewareCreator('test', '*').handle(() => () => () => null);

    expect(middleware.actionKind).toBe('*');
  });

  it('should save the middleware handler into a property', () => {
    const middleware = new MiddlewareCreator('test', 'set').handle(() => () => () => null);

    expect(typeof middleware.handler).toBe('function');
  });

  it('should throw an error due to the action kind being invalid', () => {
    const invalidActionKind = () => {
      new MiddlewareCreator('test', 'invalidAction').handle(() => () => () => null);
    };

    expect(invalidActionKind).toThrowError('invalidAction');
  });

  it('should throw an error due to the middleware handler not being a function', () => {
    const invalidMiddlewareHandler = () => {
      new MiddlewareCreator('test', 'set').handle('not a function');
    };

    expect(invalidMiddlewareHandler).toThrowError('must be a function');
  });
});
