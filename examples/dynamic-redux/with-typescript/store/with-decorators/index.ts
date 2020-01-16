import { createStore } from 'dynamic-redux';

// note that you don't need to give the combined states
// if you use the `State` decorator for all your states
// you can still do it if you want to
export const store = createStore();
