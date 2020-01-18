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

[See StateCreator's API](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/StateCreator.md)

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

[See CombineStates' API](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/CombineStates.md)

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

[See createState's API](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/createStore.md)

## How to create middlewares

There is 2 kinds of middlewares:

- global middlewares
- action middlewares

The global middlewares are the ones like in vanilla Redux. These middlewares all are called before the call to the reducer that will modify the value in the state, thus you can do one or more code execution for one or more action with a single middleware.

The action middlewares are called only before the call to the `dispatch` function provided by Redux **only** if the current action with its kind has middlewares, otherwise, they never get called.

Action middlewares might be preferred since it avoids unecessary function call with `if` statements (since you've got to make a test on the type of the current action to know what to do for what action) since they **only** are called before the action kind that has middlewares is called.

### How to create a global middleware

The creation of a global middleware is the exact same as in vanilla Redux:

```js
export const myGlobalMiddleware = store => next => action => {
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
import { myGlobalMiddleware } from './middlewares';

export default createStore(combinedStates, {
  middlewares: [myGlobalMiddleware],
});
```

### How to create an action middleware

To create an action middleware, you will have to use a class in which you will give to a method of one of your states

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

[See MiddlewareCreator's API](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/MiddlewareCreator.md)

## How to recover the properties from the states

Dynamic-redux has its own functions to help you recover the properties from the state in a much more concise way.

If you want to recover the properties from a single state, a simple string is enough:

```js
import { mapState } from 'dynamic-redux';

const mapStateToProps = mapState('example: myString myObject myArray');
```

and that's it.

`example` is the state's name used as a 'namespace' the namespace and the properties to recover are separated by a colon `:`.
The properties are separated by a whitespace

If you want to recover the properties from several states, you can use an object:

```js
import { mapState } from 'dynamic-redux';

const mapStateToProps = mapState({
  example: 'myString myObject',
  secondState: ['property1', 'property2 property3'],
});
```

The property of the object is the state's name, and the value can be either a string or an array of strings.
The strings in the array can be either a string containing a single property or a string containing several properties separated by a whitespace.

> note: if the state or the property in the state doesn't exists it will throw an error

## How to recover actions from the states

The way to recover the actions from the states is *very* similar to the way of recovering properties from them, and this is thanks to the function `mapDispatch`

for actions from a single state:

```js
import { mapDispatch } from 'dynamic-redux';

const mapDispatchToProps = mapDispatch('example: setMyString mergeMyObject');
```

for actions from a several states:

```js
import { mapDispatch } from 'dynamic-redux';

const mapDispatchToProps = mapDispatch({
  example: 'setMyString mergeMyObject',
  secondState: ['setProperty1', 'pushProperty2 queryProperty3'],
});
```

> note: if the state or the action in the state doesn't exists it will throw an error

There is also another of recovering action from the state using `QueryDispatch`, but we will cover that later.

## How to connect mapStateToProps and mapDispatchToProps with a React component

While the library can be used in JS vanilla and with any other framework. Dynamic-redux has a function to add a bit more abstraction on top of the connection

In Redux vanilla (using react-redux) you would connect you mappedProps to your React component like so

```js
import React from 'react';
import { connect } from 'react-redux';
import { mapState, mapDispatch } from 'dynamic-redux';

const mapStateToProps = mapState('example: myString myObject myArray');
const mapDispatchToProps = mapDispatch({
  example: 'setMyString mergeMyObject',
  anotherState: ['setProperty1', 'mergeProperty2 queryProperty3'],
});

const MyComponent = () => <p>Some text</p>;

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

With Dynamic-redux's `connect` function, you won't even need to import and call the mapper functions

```js
import React from 'react';
import { connect } from 'dynamic-redux';

const mapStateToProps = 'example: myString myObject myArray';
const mapDispatchToProps = {
  example: 'setMyString mergeMyObject',
  anotherState: ['setProperty1', 'mergeProperty2 queryProperty3'],
};

const MyComponent = () => <p>Some text</p>;

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

## How to create selectors

Like for the middlewares, there is 2 types of selectors

- Global selectors
- State selectors

### How to create global selectors

Global selectors are defined globally and must be given to the `createStore` function

The first parameter of a global selector is the Redux's whole state. All other parameters are the arguments you might have given to your selector when called.

/store/states/example.js

```js
import { StateCreator } from 'dynamic-redux';

const exampleState = new StateCreator('example', {
  myString: 'VaLuE',
});

export default exampleState;
```

/store/selectors.js

```js
export const getMyStringLowerSelector = state => {
  return state.exampleState.myString.toLowerCase();
}
```

/store/index.js

```js
import { createStore } from 'dynamic-redux';

import combinedStates from './states';
import { getMyStringLowerSelector } from './selectors';

export default createStore(combinedStates, {
  selectors: {
    getMyStringLowerSelector: getMyStringLowerSelector,
  },
});
```

Your selectors can be recovered from the `mapState` function and used like that:

```js
import React from 'react';
import { connect } from 'dynamic-redux';

const mapStateToProps = 'example: getMyStringLowerSelector';

const MyComponent = ({ getMyStringLowerSelector }) => {
  // the selector will always be a function
  // if you give it parameters they will be given to its original function from the second parameter
  return getMyStringLowerSelector();
}

export default connect(mapStateToProps)(MyComponent);
```

> note: it doesn't matter in which namespace (here it's "example") a global selector is get from

### How to create state selectors

Global selectors are attached to a state the same way as action middlewares

The first parameter of a state selector is the state value. All other parameters are the arguments you might have given to your selector when called.

```js
import { StateCreator } from 'dynamic-redux';

const exampleState = new StateCreator('example', {
  myString: 'VaLuE',
});

exampleState.createSelectors({
  getMyStringLower: state => {
    return state.myString.toLowerCase();
  },
});

export default exampleState;
```

And will be used the same way as a global selector

```js
import React from 'react';
import { connect } from 'dynamic-redux';

const mapStateToProps = 'example: getMyStringLowerSelector';

const MyComponent = ({ getMyStringLowerSelector }) => {
  // the selector will always be a function
  // if you give it parameters they will be given to its original function from the second parameter
  return getMyStringLowerSelector();
}

export default connect(mapStateToProps)(MyComponent);
```

> note: for a state selector you must get it from its defined state

## How to perform complex actions using Query

Query is an object containing lot of methods to allow you to perform more complex actions. For example, what if you want to add a value in an array within an object?

With the following state

```js
import { StateCreator } from 'dynamic-redux';

const exampleState = new StateCreator('example', {
  myObject: {
    anArray: [0, 1, 2],
  },
});

exampleState.createActions({
  myObject: 'set',
});
```

Without `Query` you would do something like that:

```js
import React from 'react';
import { connect } from 'dynamic-redux';

const mapStateToProps = 'example: myObject';
const mapDispatchToProps = 'example: setMyObject';

const MyComponent = ({ myObject, setMyObject }) => {
  myObject.anArray.push(3);

  setMyObject(myObject);

  return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

With Query it would be something like that:

```js
import React from 'react';
import { connect } from 'dynamic-redux';

const mapDispatchToProps = 'example: queryMyObject';

const MyComponent = ({ queryMyObject }) => {
  queryMyObject(q => q
    .get('anArray')
    .push(3)
  );

  return null;
}

export default connect(null, mapDispatchToProps)(MyComponent);
```

In this example the benefits isn't big because the example is simply, but you can imagine what it would be if it was adding a value in an array, in an object, in an array that is in an object. Or if we had to find an object within an array and modify that found object.

The query action is a function that takes the Query object as parameter and you **must** return the `Query` object


More details on Query available in the API. (make a link to Query's API)

## How to use QueryDispatch

QueryDispatch can be used to avoid the copy/paste of writing the actions you want to recover.

For example imagine you want to recover those actions:

```js
const mapDispatchToProps = mapDispatch({
  example: 'setMyArray pushMyArray popMyArray concatMyArray filterMyArray mapMyArray',
  anotherState: 'setProperty1 setProperty2 setProperty3 setProperty4',
});
```

With `QueryDispatch` it would be something like that:

```js
const mapDispatchToProps = new QueryDispatch()
  .all('example: myArray')
  .set('example: property1 property2 property3 property4');
```

QueryDispatch cannot be used just like that, since what all those methods returns is the instance of `QueryDispatch`, you don't recover data that can be consumed by react-redux or any other library you use, if any.

If you want to use another library's connect function or any solution other than Dynamic-redux, you will have to call the method `results` at the end of the chain.

```js
import { connect } from 'react-redux';

const mapDispatchToProps = new QueryDispatch()
  .all('example: myArray')
  .set('example: property1 property2 property3 property4')
  .results();

connect(null, mapDispatchToProps);
```

If you use dynamic-redux's connect function, you can simply pass it as it is

```js
import { connect } from 'dynamic-redux';

const mapDispatchToProps = new QueryDispatch()
  .all('example: myArray')
  .set('example: property1 property2 property3 property4');

connect(null, mapDispatchToProps);
```

More details on QueryDispatch available in the API. (make a link to QueryDispatch's API)
