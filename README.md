Dynamic-redux is a library that add a lot of abstraction on top of redux to avoid all the redundancy brung by redux.

It helps you write applications using the logic of redux in a faster, easier and more concise way.

# installation

> npm i dynamic-redux -S

## Documentations

* [How to use Dynamic-redux with Javascript](https://github.com/zougui1/dynamic-redux/tree/master/docs/javascript.md)
* [How to use Dynamic-redux with Typescript](https://github.com/zougui1/dynamic-redux/tree/master/docs/typescript.md)

## to do

* finish the examples (typescript with decorators definition of middlewares)
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

## docs to do

* create an API md that will contain the public API of dynamic-redux
* refer the API for every section to their corresponding reference
