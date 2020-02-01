import { prefixUpSource } from '../prefixUpSource';

/**
 * add a `prefix` to all the `strings` and upper the first character of the `strings`
 * @param {String} prefix
 * @param {String[]} strings
 * @returns {String[]}
 */
export function prefixAll(prefix: string, strings: string[]): string[] {
  return strings.map(str => prefixUpSource(prefix, str));
}
