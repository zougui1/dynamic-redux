## installation

> npm i

## build the code

> npm run build


## middlewares handling ideas

linked to a state


could wrap the targeted action into the middlewares that target it, so that the middlewares does not affect the performance of *all* actions, but *only* the action it is targeting

Middleware arguments:
* {String} the *action* to target
* {String} *kind* of action to target
* {Boolean}(default: true) whether or not call `next` if the generated type doesn't match the current action

since it is linked to the current state it could test if the action exists and if it uses the same kind of action, if not it could throw an error

```js
import { DynamicState, Middleware } from 'dynamic-redux';

const state = new DynamicState('test', {
  myProperty: 'default value'
});

state.createActions({
  myProperty: 'set'
});

state.addMiddlewares([
  // the callback inside the `callback` method will be called
  // only if the action setMyProperty is called
  new Middleware('myProperty', 'set').callback(store => next => action => {
    // do something
  })
]);
```

not linked to anything

would work like on redux vanilla

Middleware arguments:
* {String} the type to test to execute the callback
* {Boolean}(default: true) whether or not call `next` if the type doesn't match the current action

```js
import { Middleware, createStore, CombinedStates, DynamicState } from 'dynamic-redux';

const state = new DynamicState('test', {
  myProperty: 'default value'
});

state.createActions({
  myProperty: 'set'
});

const combinedStates = new CombinedStates([state]);

const middlewares = [
  // the callback inside the `callback` method will be called
  // only if an action of type 'SET_MY_PROPERTY' is called
  new Middleware('SET_MY_PROPERTY').callback(store => next => action => {
    // do something
  })
]

const store = createStore(combinedStates, middlewares);
```

* both above solutions

#### advantages

* linked solution
  * could test if the action and action-kind it references exists and throw an error if one of those doesn't
* non-linked solution

#### disadvantages

* linked solution
  * add a step to create a complete state if there's one or more middlewares to link
* non-linked solution
