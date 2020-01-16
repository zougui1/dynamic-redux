import { Middleware } from 'redux';

import { allActions } from 'src/common';

export class MiddlewareCreator<T = any> {

  /**
   * @type {String}
   * @public
   */
  actionName: keyof T;

  /**
   * @type {String}
   * @public
   */
  actionKind: keyof typeof allActions | '*';

  /**
   * @type {Middleware}
   * @public
   */
  handler: Middleware;

  /**
   *
   * @param {String} action
   * @param {String} kind
   * @public
   */
  constructor(action: keyof T, kind: keyof typeof allActions) {
    this.actionName = action;
    this.actionKind = kind;
  }

  /**
   * @param {Middleware} callback must be a function that returns a function which itself return a function
   * @returns {this}
   * @public
   */
  handle(callback: Middleware) {
    this.handler = callback;
    return this;
  }
}
