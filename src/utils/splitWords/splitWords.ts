import { removeSpaces } from '..';

/**
 * split the words of a string
 * @param {String} words
 * @returns {String[]}
 */
export function splitWords(words: string): string[] {
  return removeSpaces(words.split(' '));
}
