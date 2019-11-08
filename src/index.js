export * from './mapState';
export * from './mapDispatch';
export * from './createStore';
export * from './DynamicState';
export * from './CombineStates';
export * from './Middleware';
export * from './connect';

/*
import { DynamicState } from './DynamicState';
import { CombineStates } from './CombineStates';
import { createStore } from './createStore';
import { mapDispatch } from './mapDispatch';
import { mapState } from './mapState';
import { Middleware } from './Middleware';

const state = new DynamicState('state', {
  array: [0, 1, 2, 3, 4, 5, 6],
  test: 50
}, { strictTyping: true });

state.createActions({
  array: ['map', 'filter'],
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
/*
state.createSelectors({
  array4AndMore: state => state.array.filter(n => n >= 4),
});

const combinedStates = new CombineStates([state]);

const store = createStore(combinedStates);

const actions = mapDispatch('state: resetState resetTest setTest')(store.dispatch);

const getter = () => mapState('state: array test array4AndMore something')(store.getState());

console.log(getter());
actions.setTest(10);
const got = getter();
got.test = 100;
console.log(got);
console.log(getter());*/
//actions.resetTest();
//console.log(getter());
