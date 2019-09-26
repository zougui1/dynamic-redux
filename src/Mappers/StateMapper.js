import _ from 'lodash';

import { GenericMapper } from './_GenericMapper';

const suffix = 'Reducer';

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
   * @param {Function} publicMapper
   * @public
   */
  constructor(props, state, publicMapper) {
    this.state = state;
    this.mapper = new GenericMapper(props, publicMapper, this.each);
  }

  /**
   * called by `this.mapper` when mapping a string
   * @param {Object} thisArg `this.mapper`'s context
   */
  each = thisArg => {
    const { name, suffixed } = thisArg.reducer;
    const { states, selectors } = thisArg.publicMapper;

    const stateReducer = this.state[suffixed];
    const currentState = states[suffixed];

    if (!stateReducer) {
      throw new Error(`The state "${name}" doesn't exists`);
    }

    return prop => {
      let propName = prop;

      const isInState = currentState.isInState(prop);
      const isSelector = currentState.isSelector(prop);
      const globalSelector = selectors[prop];

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
          ? (...args) => selectors[prop](this.unsuffixedState(), ...args)
          : (...args) => currentState.selectors[prop](stateReducer, ...args);
    }
  }

  /**
   * return the state with all its properties unsuffixed
   * @returns {Object}
   */
  unsuffixedState = () => {
    const newState = {};

    _.forIn(this.state, (state, name) => {
      newState[name.substring(0, name.length - suffix.length)] = state;
    });

    return newState;
  }

}
