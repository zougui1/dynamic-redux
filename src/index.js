export * from './mapDynamicState';
export * from './mapDynamicDispatch';
export * from './createStore';
export * from './DynamicState';
export * from './CombineStates';
export * from './connect';

import { DynamicState } from './DynamicState';
import { CombineStates } from './CombineStates';
import { createStore } from './createStore';
import { mapDynamicDispatch } from './mapDynamicDispatch';
import { mapDynamicState } from './mapDynamicState';

const state = new DynamicState('state', {
  test: 'default value'
});

state.createActions({
  test: ['set', 'reset'],
  __STATE__: 'reset'
});

const combinedStates = new CombineStates([state]);

const store = createStore(combinedStates);

const actions = mapDynamicDispatch('state: setTest')(store.dispatch);

const getter = () => mapDynamicState('state: test')(store.getState());

console.log(actions);

console.log(getter());
actions.setTest('new value');
console.log(getter());
//actions.resetTest();
console.log(getter());
