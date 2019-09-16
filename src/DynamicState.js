import _ from 'lodash';
import { Actions } from './Actions';
import { chainer } from './middlewareChainer';

const stateRef = '__STATE__';

export class DynamicState {

  /**
   * @property {String} name
   * @private
   */
  name = '';

  /**
   * @property {Object} initialState
   * @private
   */
  initialState = {};

  /**
   * @property {Object} actions
   * @public
   */
  actions = {};

  /**
   * @property {Object} actionsOrigin
   * @public
   */
  actionsOrigin = {};

  /**
   * @property {Array} reducerConditions
   * @private
   */
  reducerConditions = [];

  /**
   * @property {Function} reducer
   * @function
   * @public
   */
  reducer = () => { };

  /**
   * @property {String} resetType
   * @private
   */
  resetType = '';

  /**
   * @property {Object} middlewares
   * @private
   */
  middlewares = {};

  /**
   * @property {Object} store
   * @private
   */
  store = {};

  /**
   * @param {String} name
   * @param {Object} initialState
   */
  constructor(name, initialState) {
    if (!_.isString(name)) {
      throw new Error(`The name must be a string. Got "${name}"`);
    }

    if (!_.isObject(initialState)) {
      throw new Error(`The initial state must be an object. Got "${initialState}"`);
    }

    this.name = name;
    this.resetType = 'RESET_' + name.toUpperCase() + '_STATE';
    this.initialState = initialState;
    this.reducer = (state = initialState, action) => this.dynamicReducer(state, action);
  }

  /**
   * @param {Object} state
   * @param {Object} action
   * @returns {Object}
   * @private
   */
  dynamicReducer = (state, action) => {
    if (action.type === this.resetType) {
      return this.initialState;
    }

    const newState = _.cloneDeep(state);

    this.reducerConditions.forEach(({ type, prop }) => {
      if (type !== action.type) {
        return;
      }

      this.dispatcher(newState, action, prop);

    });

    return newState;
  }

  dispatcher = (state, action, prop) => {
    switch (action.kind) {
      case 'set':
        state[prop] = action.payload;
        break;
      case 'push':
      case 'pop':
      case 'shift':
      case 'unshift':
        Actions.array(state, action, prop);
        break;
      case 'concat':
        state[prop] = Actions.arrayWithArray(state, action, prop);
        break;
      case 'filter':
      case 'map':
      case 'reduce':
        state[prop] = Actions.arrayWithFunction(state, action, prop);
        break;
      case 'merge':
        state[prop] = Actions.objectWithObject(state, action, prop);
        break;
      case 'inc':
      case 'dec':
        state[prop] = Actions.numberWithNumber(state, action, prop);
        break;
      case 'reset':
        state[prop] = this.initialState[prop];
        break;

      default:
        break;
    }
  }

  /**
   * @param {Object} action
   * @param {String} action.name
   * @param {String} action.kind
   * @private
   */
  createAction = action => {
    const actions = {};

    action.kinds.forEach(kind => {
      if (!_.isString(kind)) {
        throw new Error(`The kind of action must be a string. Got "${kind}"`);
      }
      actions[kind] = this.actionCreator({ name: action.name, kind: kind, prop: action.prop });
    });

    this.actions[action.name] = actions;
  }

  /**
   * @param {Object} action
   * @param {String} action.name
   * @param {String} action.kind
   * @returns {Function}
   * @private
   */
  actionCreator = action => {
    let finalName;

    if (action.name === stateRef) {
      finalName = this.name.toUpperCase() + '_STATE';
    } else {
      finalName = _.snakeCase(action.name).toUpperCase();
    }

    const type = action.kind.toUpperCase() + '_' + finalName;
    const camelType = _.camelCase(type);

    this.reducerConditions.push({ type, prop: action.prop });

    return (value, dispatch) => {
      // get all the middlewares for the current action
      const middlewares = this.getActionMiddlewares(camelType);

      const actionObject = { type, payload: value, kind: action.kind };
      // create a function that will dispatch the data of the action
      const dispatcher = () => dispatch(actionObject);

      if (middlewares) {
        // create a chain of middlewares and call them
        chainer(middlewares, this.store, dispatcher, actionObject)();
      } else {
        dispatcher();
      }
    }
  }

  /**
   * @param {Object} _actions
   * @public
   */
  createActions(_actions) {
    this.actionsOrigin = _actions;

    _.forIn(_actions, (action, actionName) => {
      const isStateRef = actionName === stateRef;

      const prop = isStateRef ? actionName : _.camelCase(actionName);

      if (!isStateRef && !_.hasIn(this.initialState, prop)) {
        throw new Error(`"${prop}" doesn't exists in the state of "${this.name}"`);
      }

      if (_.isString(action)) {
        action = [action];
      } else if (!Array.isArray(action)) {
        throw new Error(`The kind of action must be a string or an array. Got "${action}"`);
      }

      this.createAction({ name: actionName, kinds: action, prop: prop });
    });
  }

  /**
   *
   * @param {Object[]} middlewares
   * @param {String} middlewares[].actionName
   * @param {String} middlewares[].actionKind
   * @param {Function} middlewares[].callbackAction
   */
  createMiddlewares(middlewares) {
    middlewares.forEach(middleware => {
      const { actionName, actionKind } = middleware;

      let action = this.actionsOrigin[actionName];

      if (!action) {
        throw new Error(`There is no action "${actionName}"`);
      }

      if (_.isString(action)) {
        action = [action];
      }

      if (!action.includes(actionKind)) {
        throw new Error(`Action "${actionName}" doesn't use the kind "${actionKind}"`);
      }

      this.addMiddleware(middleware);
    });
  }

  /**
   *
   * @param {Object} middleware
   * @param {String} middleware.actionName
   * @param {String} middleware.actionKind
   * @param {Function} middleware.callbackAction
   */
  addMiddleware = middleware => {
    const action = _.camelCase(middleware.actionKind + '_' + middleware.actionName);

    if (!this.middlewares[action]) {
      this.middlewares[action] = [middleware];
    } else {
      this.middlewares[action].push(middleware);
    }
  }

  /**
   * @param {String} action
   * @returns {Object}
   */
  getActionMiddlewares = action => {
    return this.middlewares[action];
  }

}
