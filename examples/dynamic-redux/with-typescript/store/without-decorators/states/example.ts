import { StateCreator, MiddlewareCreator } from 'dynamic-redux';

const exampleState = new StateCreator('example', {
  myProperty: 'default value',
  myArray: [],
  myObject: {},
  myNumber: 0,
});

// there is several kinds of actions
// note that the autocompletion of the kinds of action available for the type of your original property in the state
// will work perfectly fine and will show you an error if you set an invalid kind of action
exampleState.createActions({
  // the basic one is 'set', which only replace the value in the state
  // by the new value passed in arguments to the action
  // note that `set` can be used with all types
  myProperty: 'set',
  // but there is more actions that are more "advanced" and useful
  // what if you wanted to merge an object in the state with another object
  // either to add new properties to the said object
  // or the modify the existing ones
  // simply set the value as 'merge' to be able to merge
  // the value in the state with another object
  // will throw an error if both the value in the state
  // and the value passed in argument aren't an object
  myObject: 'merge',
  // there is more useful actions for arrays
  // since there is more than one that you would like to use
  // you can set an array of strings to define them
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
  ],
  // you can increment and decrement a number as well
  // they will throw an error if both the value in the state
  // and the value passed in argument aren't a number
  myNumber: [
    'inc',
    'dec',
    // you can also reset a property which will set it to its value from the initial state
    'reset',
  ],

  // you can reset the whole state as well, which will set the initial state
  // this can be done by simply referencing the current state with `__STATE__`
  // and set the reset action
  // ! only `reset` can be used on the state. if you try another action
  // ! it will throw the following error: "state" doesn't exists on state "<stateName>"
  __STATE__: 'reset',

});

// create middlewares from an array of `Middleware`
exampleState.createMiddlewares([
  // first param target the name of the action
  // if there is no action with the same name it will throw an error
  // second param target the kind of action
  // if the action doesn't use the same kind it will throw an error
  // ! a middleware can't be used on '__STATE__' this will not throw an error but won't work either
  new MiddlewareCreator('myNumber', 'inc')
    // `.callback` will take the function to use as a middleware
    // `store` is the redux store
    // `next` is a function to call if you want the next middleware
    // or the action to be called if there is no middleware after
    // `action` is an object containing the data about the current action
    .handle(store => next => action => {
      // the other middlewares (if any) and the final action will be called
      // if the value passed to the action is superior to 0
      // otherwise the next middlewares (if any) and final action
      // won't be called and the increment won't occur
      if (action.payload > 0) {
        next();
      }
    }),
]);

export default exampleState;
