export * from './mapDynamicState';
export * from './mapDynamicDispatch';
export * from './createStore';
export * from './DynamicState';
export * from './CombineStates';
export * from './Middleware';
export * from './connect';

import { DynamicState } from './DynamicState';
import { CombineStates } from './CombineStates';
import { createStore } from './createStore';
import { mapDynamicDispatch } from './mapDynamicDispatch';
import { mapDynamicState } from './mapDynamicState';
import { Middleware } from './Middleware';

const state = new DynamicState('state', {
  array: [0, 1, 2, 3, 4, 5, 6],
  test: 50
}, { strictTyping: true });

state.createActions({
  test: ['set', 'reset'],
  __STATE__: 'reset'
});
/*
state.createMiddlewares([
  new Middleware('test', 'set').callback(store => next => action => {
    console.log('middleware');
    next();
  })
]);*/

state.createSelectors({
  array4AndMore: state => state.array.filter(n => n >= 4),
});

const combinedStates = new CombineStates([state]);

const store = createStore(combinedStates);

const actions = mapDynamicDispatch('state: resetState resetTest setTest')(store.dispatch);

const getter = () => mapDynamicState('state: test array4AndMore')(store.getState());

console.log(getter().array4AndMoreSelector());
actions.setTest(50);
console.log(getter());
//actions.resetTest();
//console.log(getter());
