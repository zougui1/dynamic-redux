import { createStore, compose } from 'redux';

import rootReducer from './reducers';

let devTools = [];

// push the redux dev tools in the `devTools` array if we are not in production
// and if the `__REDUX_DEVTOOLS_EXTENSION__` property exists on object window
if(window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV !== 'production') {
  devTools.push(window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }));
}

const enhancers = devTools[0];

export default createStore(rootReducer, enhancers);
