import * as _ from 'lodash';

import { GenericMapper } from './GenericMapper';
import { ObjectLiteral, GlobalScope } from '../common';

export class StateMapper {

  /**
   * @type {GenericMapper}
   * @private
   */
  private mapper: GenericMapper;

  /**
   * @type {Object}
   * @private
   */
  private state: ObjectLiteral;

  /**
   * @type {Object}
   * @private
   */
  private newState: ObjectLiteral = {};

  /**
   * return the result (`this.newState`) of the mapper
   * @returns {Object}
   * @public
   */
  get result(): ObjectLiteral {
    return this.newState;
  }

  /**
   *
   * @param {string} props
   * @param {Object} state
   * @public
   */
  constructor(props: string, state: ObjectLiteral) {
    this.state = state;
    this.mapper = new GenericMapper(props, this.each);
  }

  /**
   * called by `this.mapper` when mapping a string
   * @param {Object} thisArg `this.mapper`'s context
   * @private
   */
  private each = thisArg => {
    const { name, suffixed } = thisArg.reducer;
    const globalScope = GlobalScope.get();

    const stateReducer = this.state[suffixed];
    const currentState = globalScope.states[suffixed];

    if (!stateReducer) {
      throw new Error(`The state "${name}" doesn't exists`);
    }

    return prop => {
      let propName = prop;

      const isInState = currentState.isInState(prop);
      const isSelector = currentState.isSelector(prop);
      const globalSelector = globalScope.selectors[prop];

      if (!isInState && !isSelector && !globalSelector) {
        throw new Error(`There is no prop or selector called "${prop}" in the state "${name}"`);
      }

      if (isSelector || globalSelector) {
        propName += 'Selector';
      }

      // return either a property from the state or a selector
      this.newState[propName] = isInState
        ? stateReducer[prop]
        : globalSelector
          ? (...args) => globalScope.selectors[prop](this.state, ...args)
          : (...args) => currentState.selectors[prop](stateReducer, ...args);
    };
  }
}
