import * as _ from 'lodash';

import {
  ObjectLiteral,
  Partial,
  ActionKinds,
  GlobalScope,
  ActionDispatcher,
  ActionObject,
  ObjectOf,
} from '../common';
import {
  StateModel,
  StateMiddlewares,
  StateSelectors,
  StateOptions,
  Actions as ActionsType,
  ObjectOfActionsDefinition,
} from './types';
import { cloneDeep, getType, forIn } from '../utils';
import { Actions } from './Actions';
import { chainer } from './chainer';
import { MiddlewareCreator } from '../MiddlewareCreator';
import { Query } from '../Query';

const stateRef = '__STATE__';

/**
 * @template T
 * @class
 */
export class StateCreator<T extends object> {

  /**
   * @type {String}
   * @public
   */
  public name: string;

  /**
   * @type {Object}
   * @private
   */
  private initialState: T;

  /**
   * @type {StateModel<T>}
   * @private
   */
  private stateModel: StateModel<T>;

  /**
   * @type {Object.<String, Object.<String, ActionDispatcher>>}
   * @private
   */
  public actions: ActionsType<T>;

  /**
   * @type {StateActions<T>}
   * @private
   */
  private actionsOrigin: ObjectOfActionsDefinition<T>;

  /**
   * @type {Object[]}
   * @private
   */
  private reducerConditions: ObjectLiteral[] = [];

  /**
   * @type {Function}
   * @private
   */
  public reducer: (state: T, action: ActionObject) => {};

  /**
   * @type {String}
   * @private
   */
  private resetType: string;

  /**
   * @type {Partial<StateMiddlewares<T>>}
   * @private
   */
  private middlewares: Partial<StateMiddlewares<T>> = {};

  /**
   * @type {StateSelectors<T>}
   * @private
   */
  public selectors: StateSelectors<T> = {};

  /**
   * @type {Object}
   * @private
   */
  private options: StateOptions;

  /**
   * @param {String} name
   * @param {T} initialState
   * @param {StateOptions} [options]
   */
  constructor(name: string, initialState: T, options: StateOptions = {}) {
    if (typeof name !== 'string') {
      throw new Error(`The name of the state must be a string. Got "${name}"`);
    }

    if (!initialState || typeof initialState !== 'object') {
      throw new Error(`The initial state must be a string. Got "${initialState}"`);
    }

    this.name = name;
    // @ts-ignore
    this.actions = {};
    // @ts-ignore
    this.actionsOrigin = {};
    this.options = options;
    this.resetType = 'RESET_' + name.toUpperCase() + '_STATE';
    this.initialState = initialState;
    this.reducer = (state = initialState, action) => this.dynamicReducer(state, action);

    if (this.options) {
      if (options.strictTyping) {
        this.generateStateModel();
      }
    }
  }

  /**
   * changes the values in the state depending on which property is targeted by `action`
   * @param {T} state
   * @param {Object} action
   * @return {T}
   * @private
   */
  private dynamicReducer(state: T, action: ActionObject) {
    // since the trigger action is only used for stateless middlewares, it will do nothing
    if (action.type === this.resetType || action.type === ActionKinds.TRIGGER) {
      return cloneDeep(this.initialState);
    }

    const newState = cloneDeep(state) as T;
    const conditionsLength = this.reducerConditions.length;

    for (let i = 0; i < conditionsLength; i++) {
      const { type, prop } = this.reducerConditions[i];

      if (type !== action.type) {
        continue;
      }

      this.dispatcher(newState, action, prop);
      break;
    }

    return newState;
  }

  /**
   * dispatches the action depending on the action kind demanded
   * @param {T} state
   * @param {Object} action
   * @param {String} prop
   * @private
   */
  private dispatcher(state: T, action: ActionObject, prop: ActionKinds): void {
    switch (action.kind) {
      // general actions
      case ActionKinds.SET:
        this.setter(state, prop, action.payload);
        break;
      case ActionKinds.RESET:
        state[prop] = this.initialState[prop];
        break;
      case ActionKinds.QUERY:
        this.setter(state, prop, action.payload(new Query(state[prop])).result);
        break;

      // array actions
      case ActionKinds.PUSH:
      case ActionKinds.POP:
      case ActionKinds.SHIFT:
      case ActionKinds.UNSHIFT:
        Actions.array(state, action, prop);
        break;
      case ActionKinds.CONCAT:
        this.setter(state, prop, Actions.arrayWithArray(state, action, prop));
        break;
      case ActionKinds.FILTER:
      case ActionKinds.MAP:
        this.setter(state, prop, Actions.arrayWithFunction(state, action, prop));
        break;

      // object actions
      case ActionKinds.MERGE:
        this.setter(state, prop, Actions.objectWithObject(state, action, prop));
        break;

      // number actions
      case ActionKinds.INC:
      case ActionKinds.DEC:
        this.setter(state, prop, Actions.numberWithNumber(state, action, prop));
        break;

      default:
        throw new Error(`There is no action of the kind "${action.kind}"`);
    }
  }

  /**
   * generate a model of the state to know the type of its properties
   * @private
   */
  private generateStateModel(): void {
    forIn(this.initialState, (property, name) => {
      this.stateModel[name] = getType(property);
    });
  }

  /**
   * set the value in the property of the state with or without typing
   * depending on the options
   * @param {T} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  private setter(state: T, prop: string, value: any): void {
    if (this.options.strictTyping) {
      this.typedSetter(state, prop, value);
    } else {
      this.basicSetter(state, prop, value);
    }
  }

  /**
   * set the value in the property of the state without typing
   * @param {T} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  private basicSetter(state: T, prop: string, value: any): void {
    state[prop] = value;
  }

  /**
   * set the value in the property of the state with typing
   * @param {T} state
   * @param {String} prop
   * @param {*} value
   * @private
   */
  private typedSetter(state: T, prop: string, value: any): void {
    const expectedType = this.stateModel[prop];
    const expectArray = expectedType === 'array';
    const isValArray = Array.isArray(value);

    // check if the value is an array if it expects it to be
    const isArray = expectArray && isValArray;
    // if `isArray` is true then the type is correct
    // otherwise give the result of the test between the type of the value and the expected type
    const isTypeCorrect = isArray || getType(value) === expectedType;

    // set the property if the type is correct otherwise throw an error
    if (isTypeCorrect) {
      this.basicSetter(state, prop, value);
    } else {
      throw new Error(`"${prop}" in the state "${this.name}" must be of type "${expectedType}". Got "${value}"`);
    }
  }

  /**
   * create an action creator
   * @param {Object} action
   * @param {String} action.name
   * @param {String} action.prop
   * @param {String} action.kind
   * @returns {Function}
   * @private
   */
  private actionCreator(action: ObjectLiteral): ActionDispatcher {
    const name = action.name === stateRef
      ? this.name.toUpperCase() + '_STATE'
      : _.snakeCase(action.name).toUpperCase();

    const starType = '*_' + name;
    const type = action.kind.toUpperCase() + '_' + name;
    const camelType = _.camelCase(type);
    const starCamelType = _.camelCase(starType);

    this.reducerConditions.push({ type, prop: action.prop });

    return (value: any, dispatch: (value: ActionObject) => {}): void => {
      // get all middlewares for the current action
      let middlewares = this.middlewares[camelType];

      middlewares = middlewares
        ? middlewares.concat(this.middlewares[starCamelType] || [])
        : this.middlewares[starCamelType];

      // create an action object to send to `dispatch`
      const actionObject = {
        type,
        payload: value,
        kind: action.kind,
        prop: action.prop,
        state: this.name,
      };

      // create a function that will dispatch the data of the action
      const dispatcher = () => dispatch(actionObject);

      if (middlewares) {
        // create a chain of middlewares that will call the dispatcher at the very end and call them
        chainer(middlewares, GlobalScope.get().store, dispatcher, actionObject)();
      } else {
        dispatcher();
      }
    };
  }

  /**
   * create all the kinds of action for a property
   * @param {Object} action
   * @param {String} action.name
   * @param {String} action.prop
   * @param {String[]} action.kinds
   * @private
   */
  private createAction(action: ObjectLiteral): void {
    const actions: ObjectOf<ActionDispatcher> = {};

    action.kinds.forEach(kind => {
      if (typeof kind !== 'string') {
        throw new Error(`The kind of the actions must be a string. Got "${kind}"`);
      }

      actions[kind] = this.actionCreator({
        name: action.name,
        kind,
        prop: action.prop,
      });
    });

    this.actions[action.name] = actions;
  }

  /**
   * create the actions for this state
   * @param {Object.<String, ActionDefinition>} actionList
   * @returns {this}
   * @public
   */
  createActions(actionList: ObjectOfActionsDefinition<T>): this {
    this.actionsOrigin = actionList;

    forIn(actionList, (action, actionName) => {
      const isStateRef = actionName === stateRef;

      const prop = isStateRef ? actionName : _.camelCase(actionName);
      // @ts-ignore
      const isTrigger = action === ActionKinds.TRIGGER || action.includes(ActionKinds.TRIGGER);

      if (!isStateRef && !this.isInState(prop) && !isTrigger) {
        throw new Error(`The property "${prop}" doesn't exists in the state "${this.name}"`);
      }

      if (typeof action === 'string') {
        // @ts-ignore
        action = [action];
      } else if (!Array.isArray(action)) {
        throw new Error(`The kind of action must be a string or an array. Got "${action}"`);
      }

      this.createAction({ name: actionName, kinds: action, prop });
    });

    return this;
  }

  /**
   * @private
   */
  addAction(actionName: string, actionKinds: string | string[]) {
    if (typeof actionKinds === 'string') {
      actionKinds = [actionKinds];
    } else if (!Array.isArray(actionKinds)) {
      throw new Error(`The kind of action must be a string or an array. Got "${actionKinds}"`);
    }

    const isStateRef = actionName === stateRef;

    const prop = isStateRef ? actionName : _.camelCase(actionName);
    // @ts-ignore
    const isTrigger = action === ActionKinds.TRIGGER || action.includes(ActionKinds.TRIGGER);

    if (!isStateRef && !this.isInState(prop) && !isTrigger) {
      throw new Error(`The property "${prop}" doesn't exists in the state "${this.name}"`);
    }

    this.createAction({ name: actionName, kinds: actionKinds, prop });

    if (!this.actionsOrigin[actionName]) {
      this.actionsOrigin[actionName] = actionKinds;
    } else if (!Array.isArray(this.actionsOrigin[actionName])) {
      this.actionsOrigin[actionName] = [this.actionsOrigin[actionName], ...actionKinds];
    }
  }

  /**
   * create the middlewares for this state
   * @param {Object[]} middlewares
   * @param {String} middlewares[].actionName
   * @param {String} middlewares[].actionKind
   * @param {Function} middlewares[].callbackAction
   * @returns {this}
   * @public
   */
  createMiddlewares(middlewares: Array<MiddlewareCreator<T>>): this {
    middlewares.forEach(middleware => {
      const { actionName, actionKind } = middleware;

      let action = this.actionsOrigin[actionName];

      if (!action) {
        throw new Error(`There is no action "${actionName}"`);
      }

      if (typeof action === 'string') {
        // @ts-ignore
        action = [action];
      }

      // @ts-ignore
      if (!action.includes(actionKind)) {
        throw new Error(`The action "${actionName}" doesn't have the kind "${actionKind}"`);
      }

      this.addMiddleware(middleware);
    });

    return this;
  }

  /**
   * associate a middleware to an action
   * @param {Object} middleware
   * @param {String} middleware.actionName
   * @param {String} middleware.actionKind
   * @param {Function} middleware.callbackAction
   * @private
   */
  addMiddleware(middleware: MiddlewareCreator<T>): void {
    const actionKind = middleware.actionKind === '*'
      ? '*'
      : middleware.actionKind;

    const action = _.camelCase(actionKind + '_' + middleware.actionName);

    if (!this.middlewares[action]) {
      this.middlewares[action] = [middleware];
    } else {
      this.middlewares[action].push(middleware);
    }
  }

  /**
   * create selectors
   * @param {Object} selectors
   * @returns {this}
   * @public
   */
  createSelectors(selectors: StateSelectors<T>): this {
    if (!selectors || typeof selectors !== 'object') {
      throw new Error(`Selectors must be in an object. Got "${selectors}"`);
    }

    forIn(selectors, (selector, name) => {
      if (typeof selector !== 'function') {
        throw new Error(`Selectors must be a function. Got "${selector}" with name "${name}"`);
      }

      this.selectors[name] = selector;
    });

    return this;
  }

  /**
   * return whether or not a prop is in the state
   * @param {String} prop
   * @returns {Boolean}
   * @public
   */
  isInState(prop: string): boolean {
    return prop in this.initialState;
  }

  /**
   * return whether or not a prop is a selector
   * @param {String} prop
   * @returns {Boolean}
   * @public
   */
  isSelector(prop: string): boolean {
    return prop in this.selectors;
  }

  /**
   * return whether the action exists and has the `actionKind`
   * @param {String} prop
   * @param {String} actionKind
   * @returns {Boolean}
   * @public
   */
  hasAction(prop: string, actionKind: string): boolean {
    const action = this.actionsOrigin[prop];

    if (typeof action === 'string') {
      return action === actionKind;
    }

    if (Array.isArray(action)) {
      return action.includes(actionKind);
    }

    return false;
  }

  /**
   * @param {String} action
   * @returns {ActionKinds | ActionKinds[]}
   * @private
   */
  getActionKinds(action: string): ActionKinds | ActionKinds[] {
    return this.actionsOrigin[action];
  }
}
