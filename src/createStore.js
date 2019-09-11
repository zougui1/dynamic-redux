import {
  createStore as rCreateStore,
  applyMiddleware,
  compose
} from 'redux';

import mapDynamicDispatch from './mapDynamicDispatch';

/**
 *
 * @param {Object} reducer
 * @param {Array?} middlewares
 */
export const createStore = (reducer, middlewares) => {
  if(typeof middlewares === 'object' && !Array.isArray(middlewares)) {
    let middlewaresArr = [];
    let i = 0;

    for(const key in middlewares) middlewaresArr[i++] = middlewares[key];
    middlewares = middlewaresArr;
  }

  mapDynamicDispatch.states = reducer.states;

  let enhancers;
  let devTools = [];

  if(window.devToolsExtension && process.env.NODE_ENV !== 'production') {
    devTools.push(window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }));
  }

  if(middlewares) enhancers = compose(applyMiddleware(...middlewares), ...devTools);
  else enhancers = devTools[0];

  const store = rCreateStore(reducer.combinedReducers, enhancers);

  mapDynamicDispatch.store = store;

  return store;
}
