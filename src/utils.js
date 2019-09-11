/**
 * remove all useless spaces within an array of strings
 * @param {String[]} array
 * @returns {String[]}
 */
const removeSpaces = array => {
  return array.map(str => str.trim()).filter(str => str);
}

exports.removeSpaces = removeSpaces;
