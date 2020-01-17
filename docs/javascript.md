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
  // you can define several kind of action for a single property using an array
  myObject: ['set'],
});
```

> note: if you try to define an action for a property that doesn't exist in the initial state, it will throw an error. So make sure to set a default value for all your properties before defining your actions!

There is not only one kind of action, "set" is the most basic one, but there is more!

### General action kinds

General actions are action kinds can be used on **any** type:

```js
exampleState.createActions({
  myString: [
    // this will replace the old value with the new value
    'set',
    // this will set the value to its original value (default value in the initial state)
    'reset',
  ],
  // "trigger" is a bit special as it doesn't need the property to exists
  // it is used to create an action that is only used with middlewares and without modifying the state
  nonExistingProperty: 'trigger',
});
```

> note: the action kind "trigger" can be also be used on an existing property

### Object action kinds

```js
exampleState.createActions({
  myObject: [
    // this will merge the object in the state with the given object
    'merge',
    // can perform complex action on a value (more detail later)
    'query',
  ],
});
```

### Array action kinds

```js
exampleState.createActions({
  myArray: [
    // will add a value at the end of the array, just like the vanilla `push` method
    'push',
    // will remove the last value of the array, just like the vanilla `pop` method
    'pop',
    // will remove the first value of the array, just like the vanilla `shift` method
    'shift',
    // will add a value at the beginning of the array, just like the vanilla `unshift` method
    'unshift',
    // will concat the array in the state with the given array, just like the vanilla `concat` method
    'concat',
    // will filter the values in the array based on the given predicate, just like thet vanilla `filter` method
    'filter',
    // will change the values in the array based on the given callback, just like thet vanilla `map` method
    'push',
    // can perform complex action on a value (more detail later)
    'query',
  ],
});
```

### Number action kinds

```js
exampleState.createActions({
  myNumber: [
    // will increment the number based on the given number if specified, default value is 1
    'inc',
    // will decrement the number based on the given number if specified, default value is 1
    'dec',
  ],
});
```

### How to perform actions on the state directly

```js
exampleState.createActions({
  // you can reset the whole state as well
  // this can be done simply by referencing the current state with `__STATE__`
  // and set the "reset" action
  __STATE__: 'reset',
});
```

> note: it will throw an error if you try to use an action kind other than "reset" on the state
