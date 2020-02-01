// @ts-nocheck
import { forIn } from './forIn';

const object = {
  myString: 'str',
  myValue: 42,
};

describe('forIn()', () => {

  it('should execute without crashing', () => {
    forIn(object, () => null);
  });

  it('should call the callback twice', () => {
    const mockCallback = jest.fn(() => null);

    forIn(object, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(2);
  });

  it('should call the callback with the correct arguments', () => {
    const mockCallback = jest.fn(() => null);

    forIn(object, mockCallback);

    expect(mockCallback.mock.calls[0][0]).toBe(object.myString);
    expect(mockCallback.mock.calls[0][1]).toBe('myString');
    expect(mockCallback.mock.calls[1][0]).toBe(object.myValue);
    expect(mockCallback.mock.calls[1][1]).toBe('myValue');
  });
});
