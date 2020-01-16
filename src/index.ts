import { CombineStates } from './CombineStates';
import { connect } from './connect';
import { createStore } from './createStore';
import { mapDispatch } from './mapDispatch';
import { mapState } from './mapState';
import { MiddlewareCreator } from './MiddlewareCreator';
import { QueryDispatch } from './QueryDispatch';
import { StateCreator } from './StateCreator';
import { State, Action, Trigger, Hook } from './Decorators';
import { IMiddleware } from './interfaces';

class MyMiddleware implements IMiddleware {
  readonly actionKind = 'set';

  handler = store => next => action => {
    console.log(action.type);
    next();
  }
}

// tslint:disable-next-line: max-classes-per-file
@State()
class MyState {

  @Action(['set', 'push'])
  @Trigger()
  @Hook(MyMiddleware)
  something: string = '';
}

const store = createStore();

const actions = mapDispatch('myState: setSomething')(store.dispatch);
const getter = () => mapState('myState: something')(store.getState());

actions.setSomething('some');

const states = new CombineStates([]);

// process.nextTick(() => console.log(states.states.myStateReducer));
process.nextTick(() => console.log(getter()));

export {
  CombineStates,
  connect,
  createStore,
  mapDispatch,
  mapState,
  MiddlewareCreator,
  QueryDispatch,
  StateCreator,
  IMiddleware,
};
