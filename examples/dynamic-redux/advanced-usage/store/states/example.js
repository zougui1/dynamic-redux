import { DynamicState } from 'dynamic-redux';

const exampleState = new DynamicState('example', {
  myProperty: 'default value',
  myArray: [],
  myObject: {},
  myNumber: 0
});

// there is several kinds of actions
exampleState.createActions({
  // the basic one is 'set', which only replace the value in the state
  // by the new value passed in arguments to the action
  // note that `set` can be used with all types
  myProperty: 'set',
  // but there is more actions that are more "advanced" and useful
  // what if we wanted to merge an object in the state with another object
  // either to add new properties to the said object
  // or the modify the existing ones
  // simply set the value as 'merge' to be able to merge
  // the value in the state with another object
  // will throw an error if both the value in the state
  // and the value passed in argument aren't an object
  myObject: 'merge',
  // there is more useful actions for arrays
  // since there is more than one that we would like to use
  // we can set an array of strings to define them
  myArray: [
    // has the same effect as the native `push` function
    // will throw an error if the value in the state isn't an array
    'push',
    // has the same effect as the native `pop` function
    // will throw an error if the value in the state isn't an array
    'pop',
    // has the same effect as the native `shift` function
    // will throw an error if the value in the state isn't an array
    'shift',
    // has the same effect as the native `unshift` function
    // will throw an error if the value in the state isn't an array
    'unshift',
    // has the same effect as the native `concat` function
    // will throw an error if both the value in the state
    // and the value passed in argument aren't an array
    'concat',
    // has the same effect as the native `filter` function
    // will throw an error if the value in the state isn't an array
    // and the value passed in argument isn't a function
    'filter',
    // has the same effect as the native `map` function
    // will throw an error if the value in the state isn't an array
    // and the value passed in argument isn't a function
    'map',
    // has the same effect as the native `reduce` function
    // will throw an error if the value in the state isn't an array
    // and the value passed in argument isn't a function
    'reduce',
  ],
  // we can increment and decrement a number as well
  // they will throw an error if both the value in the state
  // and the value passed in argument aren't a number
  myNumber: ['inc', 'dec']
});

export default exampleState;
