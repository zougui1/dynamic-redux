import { createStore } from 'dynamic-redux';

import combinedStates from './states';

// first argument must be an instance of `CombinedStates` and is required
// second argument must be an array and are used as middlewares for redux. is not required
export default createStore(combinedStates);
