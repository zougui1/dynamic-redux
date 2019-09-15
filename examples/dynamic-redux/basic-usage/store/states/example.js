import { DynamicState } from 'dynamic-redux';

// first argument is the name of the state and must be a string and is required
// second argument is the initial state and is required
const exampleState = new DynamicState('example', {
  myProperty: 'default value'
});

// this method will create the action creators as well as the action types
// depending on the values it receives
// must be an object and is required
exampleState.createActions({
  // the property name must match a property that is in the initial state
  // otherwise it will throw an error
  // the value must be a string or an array of string
  // it will define what 'kind' of action it will create
  myProperty: 'set'
});

export default exampleState;
