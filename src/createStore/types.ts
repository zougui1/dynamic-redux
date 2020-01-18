import { Middleware } from 'redux';

import { Selector, ObjectOf } from 'src/common';

export class StoreOptions {
  /**
   * @type {Object.<String, Function>}
   */
  selectors: ObjectOf<Selector<any>>;
  middlewares?: Array<Middleware<any, any, any>>;
  forceDevTools?: boolean;
  disableDevTools?: boolean;
}
