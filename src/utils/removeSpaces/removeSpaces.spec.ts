// @ts-nocheck
import { removeSpaces } from './removeSpaces';

const stringsWithSpaces = ['   ', 'string', '', '  ', '    something', '  test     '];
const stringsWithoutSpace = ['string', 'something', 'test'];

describe('removeSpaces()', () => {

  it('should execute without crashing', () => {
    removeSpaces(stringsWithSpaces);
  });

  it('should remove all useless whitespace from the array and trim its values', () => {
    const trimed = removeSpaces(stringsWithSpaces);

    expect(trimed.join(';')).toBe(stringsWithoutSpace.join(';'));
  });

  it('should have a length of 3', () => {
    const trimed = removeSpaces(stringsWithSpaces);

    expect(trimed.length).toBe(stringsWithoutSpace.length);
  });
});
