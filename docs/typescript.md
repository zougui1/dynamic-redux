# How to use Dynamic-redux with Typescript

Note that you can use typescript in the same way as with Javascript. This documentation will only cover how to use typescript with decorators. If you want to use dynamic-redux in typescript without decorators look at the Javascript documentation.

## How to create a state

You can create a state by simply using a decorator on a class

```ts
import { State } from 'dynamic-redux';

@State()
export class Example {

}
```

`State` can take 2 arguments, a name for the state (which will by default be the class' name) or an option object, and the second is an option object if the first parameter is used for the name.

## How to create actions

You can use the decorators for the actions as well!

```ts
import { State, Set, Push, ObjectActions } from 'dynamic-redux';

@State()
export class Example {

  @Set() // set action
  myString: string = 'default value';

  @Push() // push action
  myArray: string[] = [];

  @ObjectActions() // all actions available for objects
  myObject: any = {};
}
```

## How to combine the states

You can combine the states the same way as in Javascript. [Click here to see how](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-combine-the-states).

But this is not necessary, you will see why in the next section.

## How to create a store

The creation of a store can be done in the exact same way as in Javascript. [Click here to see how](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-create-a-store).

But you can also do it a bit differently. As you saw in the previous section, it is optionnal to combine the states.
The reason is that it is also optionnal to give the `createStore` function the combined states as it will combine it itself if not given.

```ts
import { createStore } from 'dynamic-redux';

export const store = createStore();
```

This work perfectly well with all the states working normally.

## How to create middlewares

### How to create a global middleware

The way of creating a global middleware is the same as in Javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-create-a-global-middleware)

### How to create an action middleware

To create an action middleware, you will have to create a class, class that can implement an interface for autocompletion

```ts
import { IMiddleware } from 'dynamic-redux';

export class MyMiddleware implements IMiddleware {

  readonly actionKind = 'set';

  handler = store => next => action => {
    console.log('MyMiddleware.handler is called');
    next();
  }
}
```

The logic behind is the same as in Javascript

Now to attach it to an action you will need the `Hook` decorator

```ts
import { State, Set, Hook } from 'dynamic-redux';

import { MyMiddleware } from './MyMiddleware';

@State()
export class Example {

  @Set() // set action
  @Hook([MyMiddleware])
  myString: string = 'default value';
}
```

Here we attached the middleware to the property `myString`, with the property `actionKind` in the middleware class it will target the kind "set" on the property "myString".

## How to recover the properties from the states

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-recover-the-properties-from-the-states)

## How to recover actions from the states

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-recover-actions-from-the-states)


## How to connect mapStateToProps and mapDispatchToProps with a React component

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-connect-mapstatetoprops-and-mapdispatchtoprops-with-a-react-component)

## How to create selectors

### How to create global selectors

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-create-global-selectors)

### How to create state selectors

The way of creating a state selector is similar to the way of creating an action middleware.
Here too, you will need to create a class that will contain the selector, with a decorator to attach them to a state.

This is how to create a selector

```ts
import { ISelector } from 'dynamic-redux';

export class GetMyStringLowerSelector implements ISelector {

  handler = state => {
    return state.myString.toLowerCase();
  }
}
```

And this is how to attach it to a state

```ts
import { State, Selectors } from 'dynamic-redux';

import { GetMyStringLowerSelector } from './GetMyStringLowerSelector';

@State()
@Selectors([GetMyStringLowerSelector])
export class Example {

  @Set() // set action
  myString: string = 'VaLuE';
}
```

## How to perform complex actions using Query

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-perform-complex-actions-using-query)

## How to use QueryDispatch

Works like in javascript. [See](https://github.com/zougui1/dynamic-redux/blob/master/docs/javascript.md#how-to-use-querydispatch)
