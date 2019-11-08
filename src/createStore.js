import _ from 'lodash';
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose
} from 'redux';

import { mappersData } from './Mappers';

const defaultOptions = {
  selectors: {},
  middlewares: null
};

/**
 *
 * @param {Object} reducer
 * @param {Object} [options={}]
 */
export const createStore = (reducer, options = defaultOptions) => {
  const { middlewares, selectors } = options;

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`Middlewares (if any) must be in an array. Got "${middlewares}"`);
  }

  if (!_.isObject(selectors)) {
    throw new Error(`Selectors (if any) must be in an object. Got "${selectors}"`);
  }

  // set the states into the mappers
  mappersData.states = reducer.states;
  //TODO create a `global` state for stuff such as the global selectors
  mappersData.selectors = selectors;

  let enhancers;
  let devTools;
  //const window = {}; //! used only for dev and tests

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
