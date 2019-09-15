import { CombineStates } from 'dynamic-redux';

import exampleState from './example';

// the first argument must be an array and contains at least 1 `DynamicState` instance and is required
export default new CombineStates([exampleState]);
