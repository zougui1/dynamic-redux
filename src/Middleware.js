export class Middleware {

  /**
   * @property {String} actionName
   * @public
   */
  actionName;

  /**
   * @property {String} actionKind
   * @public
   */
  actionKind;

  /**
   *
   * @property {Object} store
   * @public
   */
  store = {};

  /**
   *
   * @property {Function} callback
   * @public
   */
  callbackAction = {};

  /**
   *
   * @param {String} action
   * @param {String} kind
   * @public
   */
  constructor(action, kind) {
    this.actionName = action;
    this.actionKind = kind;
  }

  /**
   *
   * @param {Function} callback must be a function that returns a function which itself return a function
   * @returns {Object}
   * @public
   */
  callback(callback) {
    this.callbackAction = callback;
    return this;
  }

}
