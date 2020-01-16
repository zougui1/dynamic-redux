import { ObjectOf, ObjectLiteral } from '.';
import { StateCreator } from '../StateCreator';
import { Selector } from './Selector';

export class GlobalScope {

  private static instance: GlobalScope;

  /**
   * give it the type of an object of states
   */
  states: ObjectOf<StateCreator<ObjectLiteral>> = {};
  /**
   * give it the type of an object of selectors
   */
  selectors: ObjectOf<Selector<ObjectLiteral>> = {};
  /**
   * give it the type of the redux store
   */
  store;

  actions: any = {};

  private constructor() { }

  public static get(): GlobalScope {
    if (!GlobalScope.instance) {
      GlobalScope.instance = new GlobalScope();
    }

    return GlobalScope.instance;
  }

  addActions(stateName: string, actionName: string, actionKinds: string | string[]) {
    if (!this.actions[stateName]) {
      this.actions[stateName] = {};
    }

    const stateActions = this.actions[stateName];

    if (typeof stateActions[actionName] === 'string') {
      stateActions[actionName] = [stateActions[actionName]];
    } else if (!stateActions[actionName]) {
      stateActions[actionName] = [];
    }

    if (typeof actionKinds === 'string') {
      actionKinds = [actionKinds];
    }

    stateActions[actionName] = stateActions[actionName].concat(actionKinds);
  }
}
