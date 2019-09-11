import { combineReducers } from 'redux';

class CombineStates {

  /**
   * @property {Object} states
   * @public
   */
  states = {};

  /**
   * @property {Object} reducers
   * @public
   */
  reducers = {};

  /**
   * @property {Function} combineReducers
   * @function
   * @public
   */
  combinedReducers = null;

  /**
   * @param {Object} states
   * @public
   */
  constructor(states) {
    this.setStates(states);
    this.combinedReducers = combineReducers(this.reducers);
  }

  /**
   * @param {Array} states
   * @private
   */
  setStates = states => {
    states.forEach(state => {
      this.reducers[state.name + 'Reducer'] = state.reducer;
      this.states[state.name + 'Reducer'] = state;
    });
  }

}

export default CombineStates;
