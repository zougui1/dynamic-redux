// @ts-nocheck
import { CombineStates } from './CombineStates';
import { StateCreator } from '../StateCreator';

describe('CombineStates()', () => {
  const state1 = new StateCreator('state1', {});
  const state2 = new StateCreator('state2', {});

  it('should construct without crashing', () => {
    // tslint:disable-next-line: no-unused-expression
    new CombineStates([]);
  });

  it('should have all the states with a suffix saved in a property', () => {
    const combinedStates = new CombineStates([state1, state2]);

    expect(combinedStates.states.state1Reducer instanceof StateCreator).toBe(true);
    expect(combinedStates.states.state2Reducer instanceof StateCreator).toBe(true);
  });

  it('should have all the reducers with a suffix saved in a property', () => {
    const combinedStates = new CombineStates([state1, state2]);

    expect(typeof combinedStates.reducers.state1Reducer).toBe('function');
    expect(typeof combinedStates.reducers.state2Reducer).toBe('function');
  });

  it('should have the combined reducers saved in a property', () => {
    const combinedStates = new CombineStates([state1, state2]);

    expect(typeof combinedStates.combinedReducers).toBe('function');
  });
})
