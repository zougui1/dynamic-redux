/**
 * remove all useless spaces within an array of strings
 * @param {string[]} dirtyArray
 * @returns {String[]}
 */
export function removeSpaces(dirtyArray: string[]): string[] {
  const array: string[] = [];

  for (let item of dirtyArray) {
    item = item.trim();

    if (item) {
      array.push(item);
    }
  }

  return array;
}
