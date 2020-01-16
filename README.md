# dynamic-redux

## installation

> npm i

## build the code

> npm run build

## to do

* pass to second argument of the first function on the middlewares the current state
* pass to third argument of the first function on the middlewares the actions of the current state
* proper error handling for the `Query` object
* unit tests
* re-organize everything
* re-write everything in TS with propert typing
* a proper documentation
* define states with the use of decorator in typescript (same as in typeORM)
* entirely test and improve `Query`'s typing

```ts
@Middleware()
class Handler {
  static targetName = 'property'; // the handler will be called if the targeted property is 'property'. This is required for global middlewares and State middlewares
  static actionKind = 'merge'; // the handler will be called only if the action kinb is 'merge'. This is always required, can be '*' to targets all action kinds

  // the actual handler to call
  handle = (store) => (next) => (action) {

  }
}

/**
 * automatically take the class' name for the state namespace
 * @param {String|Object} [nameOrOptions] state namespace if it's a string, otherwise it's an option object
 * @param {Object} [options] option object for the state
 */
@State() // automatically take the class' name for the state namespace. but with an optionnal parameter to directly set its name. second param
class MyState {
  @Set() // define a set action for the property `myString` for type 'string' with default value `'default value'`
  myString: string = 'default value';

  @Set()
  @Merge()
  myObject: object = {};

  @Actions(['set', 'filter', 'push'])
  myArray: Array = [];

  @Hooks(Handler) // attach the middleware `handler` to the property `something`
  something: string = 'value';
}
```
