/**
 * remove all useless spaces within an array of strings
 * @param {String[]} array
 * @returns {String[]}
 */
export const removeSpaces = array => {
  return array.map(str => str.trim()).filter(str => str);
}
