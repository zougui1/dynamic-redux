import * as _ from 'lodash';

import { MiddlewareCreator } from '../MiddlewareCreator';
import { ActionObject } from '../common';

/**
 *
 * @param {MiddlewareCreator[]} middlewares
 * @param {*} store
 * @param {Function} dispatcher
 * @param {ActionObject} action
 * @returns {Function}
 */
export const chainer = (middlewares: MiddlewareCreator[], store, dispatcher: () => void, action: ActionObject) => () => {
  // if `middlewares` have no entries then there is no more middleware, so we can call
  // the final function
  if (!middlewares.length) {
    return dispatcher();
  }

  const middleware = middlewares[0].handler;

  // repeat the same operation with the next middleware
  const chain = chainer(_.tail(middlewares), store, dispatcher, action);

  console.log(middleware)
  // @ts-ignore
  middleware(store)(chain)(action);
};
