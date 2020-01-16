# dynamic-redux

## installation

> npm i

## build the code

> npm run build

## to do

* finish the examples
* pass to second argument of the first function on the middlewares the current state
* pass to third argument of the first function on the middlewares the actions of the current state
* proper error handling for the `Query` object
* unit tests
* a proper documentation
* entirely test and improve `Query`'s typing
* add a method to QueryDispatch to be able to do something like that: (without forgetting to handle the state)

```js
const mapDispatchToProps = new QueryDispatch()
  .byKind({
    push: 'myProperty',
    set: ['myProperty', 'mySecondProperty'],
  })
  .byProperty({
    myProperty: ['set', 'push'],
    mySecondProperty: 'set',
  });
```
