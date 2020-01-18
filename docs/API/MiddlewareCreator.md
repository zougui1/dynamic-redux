# createStore

**type:** Class

**description:** create a middleware consumable by the states

Parameters:

| name    | type    | required | description                         |
|---------|---------|----------|-------------------------------------|
| action  | string  | true     | action for the middleware to target |
| options | string  | true     | kind of the action to target        |

Methods:

## handle

**return:** *this*

**description:** will define `handler` as the handler of the middleware

Parameters:

| name    | type     | required | description                |
|---------|----------|----------|----------------------------|
| handler | function | true     | handler for the middleware |

some additional information about the middleware's handler

There is 3 functions

```js
new MiddlewareCreator('property', 'action')
  .handler((store) => (next) => (action) => {});
```

The first function's first parameter is the Redux's store.

The second function's first parameter is the next middleware or action to call or not

The third function's first parameter is an object of type [ActionObject](https://github.com/zougui1/dynamic-redux/blob/master/docs/types/ActionObject.md)
