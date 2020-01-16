import { CombineStates } from './CombineStates';
import { connect } from './connect';
import { createStore } from './createStore';
import { mapDispatch } from './mapDispatch';
import { mapState } from './mapState';
import { MiddlewareCreator } from './MiddlewareCreator';
import { QueryDispatch } from './QueryDispatch';
import { StateCreator } from './StateCreator';
import { State, Action, Trigger } from './Decorators';

@State()
class MyState {

  @Action(['set', 'push'])
  @Trigger()
  something: string = '';
}

const states = new CombineStates([]);

process.nextTick(() => console.log(states.states.myStateReducer));

export {
  CombineStates,
  connect,
  createStore,
  mapDispatch,
  mapState,
  MiddlewareCreator,
  QueryDispatch,
  StateCreator,
};
