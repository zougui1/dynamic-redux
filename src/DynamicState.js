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
   * model of the state, containing the type of the properties in the state
   * @property {Object} stateModel
   * @private
   */
  stateModel = {};

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
   * @property {Object} store
   * @private
   */
  selectors = {};

  /**
   * @property {Object} options
   * @private
   */
  options = {};

  /**
   * @param {String} name
   * @param {Object} initialState
   * @param {Object} options
   */
  constructor(name, initialState, options = {}) {
    if (!_.isString(name)) {
      throw new Error(`The name must be a string. Got "${name}"`);
    }

    if (!_.isObject(initialState)) {
      throw new Error(`The initial state must be an object. Got "${initialState}"`);
    }

    this.name = name;
    this.options = options;
    this.resetType = 'RESET_' + name.toUpperCase() + '_STATE';
    this.initialState = initialState;
    this.reducer = (state = initialState, action) => this.dynamicReducer(state, action);
    this.generateStateModel();
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

  /**
   * generate a model of the state to know the type of its properties
   */
  generateStateModel = () => {
    _.forIn(this.initialState, (property, name) => {
      let type = typeof property;

      if (Array.isArray(property)) {
        type = 'array';
      }

      this.stateModel[name] = type;
    });
  }

  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @private
   */
  dispatcher = (state, action, prop) => {
    switch (action.kind) {
      case 'set':
        this.setter(state, prop, action.payload);
        break;
      case 'push':
      case 'pop':
      case 'shift':
      case 'unshift':
        Actions.array(state, action, prop);
        break;
      case 'concat':
        this.setter(state, prop, Actions.arrayWithArray(state, action, prop));
        break;
      case 'filter':
      case 'map':
        this.setter(state, prop, Actions.arrayWithFunction(state, action, prop));
        break;
      case 'merge':
        this.setter(state, prop, Actions.objectWithObject(state, action, prop));
        break;
      case 'inc':
      case 'dec':
        this.setter(state, prop, Actions.numberWithNumber(state, action, prop));
        break;
      case 'reset':
        state[prop] = this.initialState[prop];
        break;

      default:
        break;
    }
  }

  /**
   * set the value in the property of the state with or without strict typing depending on the options
   * @param {Object} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  setter = (state, prop, value) => {
    if (this.options.strictTyping) {
      this.typedSetter(state, prop, value);
    } else {
      this.basicSetter(state, prop, value);
    }
  }

  /**
   * set the value in the property of the state without a strict typing
   * @param {Object} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  basicSetter = (state, prop, value) => {
    state[prop] = value;
  }

  /**
   * set the value in the property of the state with a strict typing
   * @param {Object} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  typedSetter = (state, prop, value) => {
    const expectedType = this.stateModel[prop];
    const expectArray = expectedType === 'array';
    const isValArray = Array.isArray(value);

    // check if the value is an array if it expects it to be
    const isArray = expectArray && isValArray;
    // if an array is expected give the result of `isArray` otherwise
    // give the result of the test between the type of the value and the type expected
    const isCorrectType = isArray || this.getType(value) === expectedType;

    // set the property if the type is correct otherwise throw an error
    if (isCorrectType) {
      this.basicSetter(state, prop, value);
    } else {
      let errorValue = value;

      // if the value is an array set the error value a tag saying explicitely it's an array
      // otherwise it will make no distinction and say it's an object
      if (isValArray) {
        errorValue = '[array Array]';
      }

      throw new Error(`"${prop}" must be of type "${expectedType}". Got "${errorValue}"`);
    }
  }

  /**
   * get the type of a value, works the same as `typeof` except that it will
   * return `'array'` if the value is an array
   * @param {*} value
   * @returns {String}
   * @private
   */
  getType = value => {
    if (Array.isArray(value)) {
      return 'array';
    }
    return typeof value;
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
      const middlewares = this.middlewares[camelType];

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
   * @returns {this}
   * @public
   */
  createActions(_actions) {
    this.actionsOrigin = _actions;

    _.forIn(_actions, (action, actionName) => {
      const isStateRef = actionName === stateRef;

      const prop = isStateRef ? actionName : _.camelCase(actionName);

      if (!isStateRef && !this.isInState(prop)) {
        throw new Error(`"${prop}" doesn't exists in the state of "${this.name}"`);
      }

      if (_.isString(action)) {
        action = [action];
      } else if (!Array.isArray(action)) {
        throw new Error(`The kind of action must be a string or an array. Got "${action}"`);
      }

      this.createAction({ name: actionName, kinds: action, prop: prop });
    });

    return this;
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
   * associate a middleware to an action
   * @param {Object} middleware
   * @param {String} middleware.actionName
   * @param {String} middleware.actionKind
   * @param {Function} middleware.callbackAction
   * @public
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
   * create selectors
   * @param {Object} selectors
   * @public
   */
  createSelectors = selectors => {
    if (!_.isObject(selectors)) {
      throw new Error(`Selectors must be in an object. Got "${selectors}"`);
    }

    _.forIn(selectors, (selector, name) => {
      if (!_.isFunction(selector)) {
        throw new Error(`Selectors must be a function. Got "${selector}" with name "${name}"`);
      }

      this.selectors[name] = selector;
    });
  }

  /**
   * return whether or not a prop is in the state
   * @param {String} prop
   * @returns {Boolean}
   */
  isInState = prop => _.hasIn(this.initialState, prop);

  /**
   * return whether or not a prop is a selector
   * @param {String} prop
   * @returns {Boolean}
   */
  isSelector = prop => _.hasIn(this.selectors, prop);
}
