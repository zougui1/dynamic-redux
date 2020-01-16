const reArrayIndex = /\[([0-9])\]$/;

/**
 * get an array indexing value
 * @param {String} str
 * @returns {String[]}
 */
export function getArrayIndexing(str: string): string[] {
  // do a replace and split to return both the indexing value and the rest of the string
  return str.replace(reArrayIndex, '__$1').split('__');
}
