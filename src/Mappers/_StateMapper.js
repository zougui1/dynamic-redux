import _ from 'lodash';

import { GenericMapper } from './_GenericMapper';
import { mappersData } from './_mappersData';

export class StateMapper {

  /**
   * @property {GenericMapper} mapper
   * @private
   */
  mapper;

  /**
   * @property {Object} state
   */
  state;

  /**
   * @param {Object} newState
   * @public
   */
  newState = {};

  /**
   * return the result (`this.newState`) of the mapper
   * @returns {Object}
   * @public
   */
  get result() {
    return this.newState;
  }

  /**
   *
   * @param {string} props
   * @param {Object} state
   * @public
   */
  constructor(props, state) {
    this.state = state;
    this.mapper = new GenericMapper(props, this.each);
  }

  /**
   * called by `this.mapper` when mapping a string
   * @param {Object} thisArg `this.mapper`'s context
   */
  each = thisArg => {
    const { name, suffixed } = thisArg.reducer;

    const stateReducer = this.state[suffixed];
    const currentState = mappersData.states[suffixed];

    if (!stateReducer) {
      throw new Error(`The state "${name}" doesn't exists`);
    }

    return prop => {
      let propName = prop;

      const isInState = currentState.isInState(prop);
      const isSelector = currentState.isSelector(prop);
      const globalSelector = mappersData.selectors[prop];

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
          ? (...args) => mappersData.selectors[prop](this.state, ...args)
          : (...args) => currentState.selectors[prop](stateReducer, ...args);
    }
  }
}
