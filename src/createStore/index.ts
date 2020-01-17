import * as _ from 'lodash';
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
} from 'redux';

import { CombineStates } from '../CombineStates';
import { DefaultOptions } from './types';
import { GlobalScope } from '../common';

const defaultOptions = {
  selectors: {},
  middlewares: null,
};

/**
 *
 * @param {CombineStates} reducer
 * @param {DefaultOptions} [options]
 */
export const createStore = (reducer?: CombineStates | undefined, options: DefaultOptions = defaultOptions) => {
  const { middlewares, selectors, disableDevTools, forceDevTools } = options;

  // combines the states from the global scope if no reducer is specified
  if (!reducer) {
    reducer = new CombineStates(Object.values(GlobalScope.get().states));
  }

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`Middlewares (if any) must be in an array. Got "${middlewares}"`);
  }

  if (!_.isObject(selectors)) {
    throw new Error(`Selectors (if any) must be in an object. Got "${selectors}"`);
  }

  // set "global" data that are used elsewhere
  const globalScope = GlobalScope.get();
  globalScope.states = reducer.states;
  globalScope.selectors = selectors;

  let enhancers: any;
  let devTools: any;
  const window: any = {}; // ! used only for dev and tests

  // add the devtools:
  // - if not in production and not disabled
  // - or if the devtools are forced
  // @ts-ignore
  if (forceDevTools || (!disableDevTools && window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production')) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__({ trace: true });
  }

  // create enhancers with middlewares (if any) and devtools
  if (middlewares) {
    enhancers = compose(applyMiddleware(...middlewares), devTools);
  } else {
    enhancers = devTools;
  }

  const store = createReduxStore(reducer.combinedReducers, enhancers);

  return store;
};
