import { Middleware } from 'redux';

import { AllActions, actionList } from '../common';

export class MiddlewareCreator<T = any> {

  /**
   * @type {String}
   * @private
   */
  public actionName: keyof T;

  /**
   * @type {String}
   * @private
   */
  public actionKind: AllActions | '*';

  /**
   * @type {Middleware}
   * @private
   */
  public handler: Middleware;

  /**
   *
   * @param {String} action
   * @param {String} kind
   * @public
   */
  constructor(action: keyof T, kind: AllActions | '*') {

    // @ts-ignore
    if (kind !== '*' && !actionList.includes(kind)) {
      throw new Error(`the kind of action is invalid. Got "${kind}"`);
    }

    this.actionName = action;
    this.actionKind = kind;
  }

  /**
   * @param {Middleware} callback must be a function that returns a function which itself return a function
   * @returns {this}
   * @public
   */
  handle = (handler: Middleware) => {
    if (typeof handler !== 'function') {
      throw new Error(`The middleware handler must be a function. Got "${handler}"`);
    }

    this.handler = handler;
    return this;
  }
}
