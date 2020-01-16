/**
 * get a random int
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function random(min: number, max: number): number {
  return Math.round(Math.random() * (max - min + 1)) + min;
}
