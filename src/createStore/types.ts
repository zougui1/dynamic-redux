import { Middleware } from 'redux';

import { Selector, ObjectOf } from 'src/common';

export class DefaultOptions {
  /**
   * @type {Object.<String, Function>}
   */
  selectors: ObjectOf<Selector<any>>;
  middlewares?: Array<Middleware<any, any, any>>;
}
