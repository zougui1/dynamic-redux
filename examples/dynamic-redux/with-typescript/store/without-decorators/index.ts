import { createStore } from 'dynamic-redux';

import combinedStates from './states';

export const store = createStore(combinedStates);
