import { ObjectLiteral } from 'src/common';

/**
 * note: this function mutates `target`
 * @param {Object} target
 * @param {Object} sources
 * @returns {Object}
 */
export function merge(target: ObjectLiteral, ...sources: ObjectLiteral[]): object {
  for (const source of sources) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}
