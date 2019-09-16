import _ from 'lodash';

/**
 *
 * @param {Function[]} middlewares
 * @param {*} first
 * @param {Function} final
 * @param {*} last
 * @returns {Function}
 */
export const chainer = (middlewares, first, final, last) => () => {
  // if `middlewares` have no entries then there is no more middleware, so we can call
  // the final function
  if (!middlewares.length) {
    return final();
  }

  const middleware = middlewares[0].callbackAction;

  // repeat the same operation with the next middleware
  const chain = chainer(_.tail(middlewares), first, final, last);

  middleware(first)(chain)(last);
}
