import * as _ from 'lodash';

import { ObjectOf, ObjectLiteral } from '.';
import { StateCreator } from '../StateCreator';
import { Selector } from './Selector';
import { MiddlewareCreator } from '../MiddlewareCreator';
import { ISelector } from '../interfaces/ISelector';

export class GlobalScope {

  private static instance: GlobalScope;

  /**
   * give it the type of an object of states
   */
  states: ObjectOf<StateCreator<ObjectLiteral>> = {};
  /**
   * give it the type of an object of selectors
   */
  selectors: ObjectOf<ObjectOf<Selector<ObjectLiteral>>> = {};
  globalSelectors: ObjectOf<Selector<ObjectLiteral>> = {};
  /**
   * give it the type of the redux store
   */
  store;

  actions: any = {};

  middlewares: ObjectOf<MiddlewareCreator[]> = {};

  private constructor() { }

  public static get(): GlobalScope {
    if (!GlobalScope.instance) {
      GlobalScope.instance = new GlobalScope();
    }

    return GlobalScope.instance;
  }

  addSelectors(stateName: string, selector: ISelector<any>) {
    if (!this.selectors[stateName]) {
      this.actions[stateName] = {};
    }

    const selectorName = _.lowerFirst(selector.constructor.name);

    this.selectors[stateName][selectorName] = selector.handler;
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

  addMiddleware(stateName: string, middleware: MiddlewareCreator): void {
    if (!this.middlewares[stateName]) {
      this.middlewares[stateName] = [];
    }

    this.middlewares[stateName].push(middleware);
  }
}
