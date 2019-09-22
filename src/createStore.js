import _ from 'lodash';
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose
} from 'redux';

import { mapDynamicDispatch, mapDynamicState } from '.';

/**
 *
 * @param {Object} reducer
 * @param {Array?} middlewares
 */
export const createStore = (reducer, middlewares) => {
  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`Middlewares (if any) must be in an array. Got "${middlewares}"`);
  }

  // set the states into the mappers
  mapDynamicDispatch.states = reducer.states;
  mapDynamicState.states = reducer.states;

  let enhancers;
  let devTools;
  const window = {}; //! used only for dev and tests

  // add the devtools if not in production
  if(window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production') {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true });
  }

  // create enhancers with middlewares (if any) and devtools
  if (middlewares) {
    enhancers = compose(applyMiddleware(...middlewares), devTools);
  } else {
    enhancers = devTools;
  }

  const store = createReduxStore(reducer.combinedReducers, enhancers);

  // used for the local middlewares
  _.forIn(reducer.states, state => {
    state.store = store;
  });

  return store;
}
