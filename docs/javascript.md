# How to use Dynamic-redux with Javascript

**It is important to be familiar with Redux vanilla before reading this documentation!**

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

> note: you don't need to add the suffix "Reducer" to the state name, the class automatically do it

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

## How to combine the states

It is important to know that you always *have* to combine your states, otherwise some functions might not work as expected, if at all.

The states combination is very similar to vanilla Redux

```js
import { CombineStates } from 'dynamic-redux';

import exampleState from './exampleState';

export default new CombineStates([exampleState]);
```

> note: even if you have only 1 state, you have to put it in an array

## How to create a store

The creation of a store is straightforward since you don't have to make your own configuration.

```js
import { createStore } from 'dynamic-redux';

import combinedStates from './states';

export default createStore(combinedStates);
```

By default create store will configure the Redux devtools with the `trace` option to true if:

- it's available in the `window` object
- the `NODE_ENV` environment variable is not set to "production"
- the `disableDevTools` option is not set to true
- or if the `forceDevTools` options is set to true

As you have seen above, you can pass options to the function as well

```js
import { createStore } from 'dynamic-redux';

import combinedStates from './states';

export default createStore(combinedStates, {
  forceDevTools: true,
});
```

This will have for effect to have the Redux devtools to be **always** activated, even in production mode

Here is a list of options available to pass to `createStore`

| options         | type    | description                                                     |
| --------------- | ------- | --------------------------------------------------------------- |
| middlewares     | array   | Global scope middlewares that will be passed to Redux           |
| selectors       | object  | Global scope selectors that will be used when mapping the state |
| disableDevTools | boolean | disable the Redux devtools                                      |
| forceDevTools   | boolean | force the activation of the Redux devtools, even if `disableDevTools` is set to `true` |

## How to create middlewares

There is 2 kinds of middlewares:

- global scope middlewares
- action scope middlewares

The global scope middlewares are the ones like in vanilla Redux. These middlewares all are called before the call to the reducer that will modify the value in the state, thus you can do one or more code execution for one or more action with a single middleware.

The action scope middlewares are called only before the call to the `dispatch` function provided by Redux **only** if the current action with its kind has middlewares, otherwise, they never get called.

Action scope middlewares might be preferred since it avoids unecessary function call with `if` statements (since you've got to make a test on the type of the current action to know what to do for what action) since they **only** are called before the action kind that has middlewares is called.

### How to create a global scope middleware

The creation of a global scope middleware is the exact same as in vanilla Redux:

```js
export const myGlobalScopeMiddleware = store => next => action => {
  if(action.type === 'SET_MY_STRING') {
    // do some code
  }

  next(); // call the next middleware or reducer
}
```

And to make it available to Redux is very similar as in vanilla Redux:

```js
import { createStore } from 'dynamic-redux';

import combinedStates from './states';
import { myGlobalScopeMiddleware } from './middlewares';

export default createStore(combinedStates, {
  middlewares: [myGlobalScopeMiddleware],
});
```

### How to create an action scope middleware

To create an action scope middleware, you will have to use a class in which you will give to a method of one of your states

```js
import { StateCreator, MiddlewareCreator } from 'dynamic-redux';

const exampleState = new StateCreator('example', {
  myLowerString: '',
});

exampleState.createActions({
  myLowerString: 'set',
});

exampleState.createMiddlewares([
  // it is important to have the actions created BEFORE the middlewares
  // if `MiddlewareCreator` cannot find the action with its kind it will throw an error
  new MiddlewareCreator('myLowerString', 'set')
    // put your middleware in this method
    .handle(store => next => action => {
      // since the middleware is action specific, you don't need to
      // test on the type of the action to execute the code

      // `payload` is the property that contains the value
      action.payload = action.payload.toLowerCase();

      next();
    }),
]);
```
