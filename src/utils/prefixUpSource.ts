import * as _ from 'lodash';

import { prefixer } from './prefixer';

/**
 * add a `prefix` to a `string` and upper the first character of the `string`
 * @param {String} prefix
 * @param {String} str
 * @returns {String}
 */
export function prefixUpSource(prefix: string, str: string): string {
  return prefixer(prefix, _.upperFirst(str));
}
