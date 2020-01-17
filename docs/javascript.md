# How to use Dynamic-redux with Javascript

## How to create a state

A state with Dynamic-redux is a merge of a reducer with its action creators and action types

Here is how to create a basic state with Dynamic-redux:

```js
import { StateCreator } from 'dynamic-redux';

const initialState = {
  myString: 'default value',
  myArray: ['first value'],
  myObject: { foo: 'bar' },
};

const exampleState = new StateCreator(
  // here `"example"` is the name of the state, name that is used as a 'namespace' when mapping
  // properties and actions from the state
  'example',
  // here `initialState` is the default state's value
  initialState,
);
```

A state can have options:

```js
import { StateCreator } from 'dynamic-redux';

const initialState = {
  myString: 'default value',
  myArray: ['first value'],
  myObject: { foo: 'bar' },
};

const options = {
  // when `strictTyping` is set to `true`
  // the values in the state CANNOT change of type
  // if the value change of type it will throw an error
  // note that this will not take count of nested type
  // it doesn't matter if the value is changed from an array of strings to an array of numbers
  strictTyping: true,
};

const exampleState = new StateCreator(
  'example',
  initialState,
  // options of the state
  options,
);
```

## How to create actions

Having a state is pretty nice, but without actions to change the values, it's not so useful.
Here is how you can define basic actions for the properties of your state:

```js
import { StateCreator } from 'dynamic-redux';


const exampleState = new StateCreator('example', {
  myString: 'default value',
  myArray: ['first value'],
  myObject: { foo: 'bar' },
});

exampleState.createActions({
  // this will create an action of kind "set" for the following properties
  myString: 'set',
  myArray: 'set',
  myObject: 'set',
});
```

> note: if you try to define an action for a property that doesn't exist in the initial state, it will throw an error. So make sure to set a default value for all your properties before defining your actions!

There is not only one kind of action, "set" is the most basic one, but there is more!
Here is a list of all existing action kinds
```js
import { StateCreator } from 'dynamic-redux';


const exampleState = new StateCreator('example', {
  myString: 'default value',
  myArray: ['first value'],
  myObject: { foo: 'bar' },
  myNumber: 0,
});

exampleState.createActions({
  // a property can have several action kinds at once, just use an array for that
  myString: [
    // this will replace the old value with the new value
    'set', // can be used with any type
    // this will set the value to its original value (default value in the initial state)
    'reset', // can be used with any type
  ],
  myObject: [
    // this will merge the object in the state with the given object
    'merge', // can only be used with objects
    // can perform complex action on a value (more detail later)
    'query', // can only be used with objects and arrays
  ],
  myArray: [
    // will add a value at the end of the array, just like the vanilla `push` method
    'push', // can only be used with arrays
    // will remove the last value of the array, just like the vanilla `pop` method
    'pop', // can only be used with arrays
    // will remove the first value of the array, just like the vanilla `shift` method
    'shift', // can only be used with arrays
    // will add a value at the beginning of the array, just like the vanilla `unshift` method
    'unshift', // can only be used with arrays
    // will concat the array in the state with the given array, just like the vanilla `concat` method
    'concat', // can only be used with arrays
    // will filter the values in the array based on the given predicate, just like thet vanilla `filter` method
    'filter', // can only be used with arrays
    // will change the values in the array based on the given callback, just like thet vanilla `map` method
    'push', // can only be used with arrays
  ],
  myNumber: [
    // will increment the number based on the given number if specified, default value is 1
    'inc', // can only be used with numbers
    // will decrement the number based on the given number if specified, default value is 1
    'dec', // can only be used with numbers
  ],

  // you can reset the whole state as well
  // this can be done simply by referencing the current state with `__STATE__`
  // and set the "reset" action
  // WARNING! only the "reset" action kind can be used on the state. if you try another action
  // it will throw the following error: `"state" doesn't exists on state "{stateName}"`
  __STATE__: 'reset',
});
```
