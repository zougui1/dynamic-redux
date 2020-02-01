import { combineReducers, Reducer } from 'redux';

import { StateCreator } from 'src/StateCreator';
import { ObjectOf, GlobalScope } from '../common';

export class CombineStates {

  /**
   * @type {Object.<String, StateCreator>}
   * @private
   */
  public states: ObjectOf<StateCreator<any>> = {};

  /**
   * @type {Object.<String, Reducer>}
   * @private
   */
  public reducers: ObjectOf<Reducer> = {};

  /**
   * @type {Reducer}
   * @private
   */
  public combinedReducers: Reducer = null;

  /**
   * @param {DynamicState[]} states
   * @public
   */
  constructor(states: Array<StateCreator<any>>) {
    this.setStates(states.concat(Object.values(GlobalScope.get().states)));
    this.combinedReducers = combineReducers(this.reducers);
  }

  /**
   * @param {DynamicState[]} states
   * @private
   */
  private setStates(states: Array<StateCreator<any>>) {
    states.forEach(state => {
      this.reducers[state.name + 'Reducer'] = state.reducer;
      this.states[state.name + 'Reducer'] = state;
    });
  }
}
