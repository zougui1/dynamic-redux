import _ from 'lodash';
import Actions from './Actions';

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
    this.resetType = 'RESET_' + name.toUpperCase() + '_REDUCER';
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
    const type = action.kind === 'reset'
      ? this.resetType
      : action.kind.toUpperCase() + '_' + _.snakeCase(action.name).toUpperCase();

    this.reducerConditions.push({ type, prop: action.prop });

    return value => ({ type, payload: value, kind: action.kind });
  }

  /**
   * @param {Object} _actions
   * @public
   */
  createReducer (_actions) {

    _.forIn(_actions, (action, actionName) => {
      const prop = _.camelCase(actionName);

      if (prop !== 'resetReducer' && !_.hasIn(this.initialState, prop)) {
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

}
