import _ from 'lodash';
import {
  createStore as rCreateStore,
  applyMiddleware,
  compose
} from 'redux';

import { mapDynamicDispatch } from '.';

/**
 *
 * @param {Object} reducer
 * @param {Array?} middlewares
 */
export const createStore = (reducer, middlewares) => {
  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`Middlewares (if any) must be in an array. Got "${middlewares}"`);
  }

  mapDynamicDispatch.states = reducer.states;

  let enhancers;
  const devTools = [];
  const window = {};

  if(window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production') {
    devTools.push(window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }));
  }

  if (middlewares) {
    enhancers = compose(applyMiddleware(...middlewares), ...devTools);
  } else {
    enhancers = devTools[0];
  }

  const store = rCreateStore(reducer.combinedReducers, enhancers);

  _.forIn(reducer.states, state => {
    state.store = store;
  });

  return store;
}
