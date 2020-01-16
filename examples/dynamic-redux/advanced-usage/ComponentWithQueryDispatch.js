import { connect, QueryDispatch } from 'dynamic-redux';

// `QueryDispatch` can be used to avoid some redundancy of writing several kind of actions
// for a single property and/or several properties of a single action
// note that you can still use the same syntax as with `mapDispatch`
// if you pass it to the constructor
const mapDispatchToProps = new QueryDispatch({ example: 'setMyProperty' })
  // here you need to explicitely set the state namespace
  .all('example: myArray') // this will recover ALL the actions that have been set for the property `myArray` (accepts an object for same use as with `mapDispatch`)
  .set('example: myProperty myObject myNumber') // this will recover the set action for all three properties (accepts an object for same use as with `mapDispatch`) (this method is available for all kinds of action)
  // with this you won't need to explicitely define the state namespace for all method called within its callback
  .state('example', qd => qd
    // here I don't need to set the state namespace since we're in the callback of the `state` method
    .reset('myProperty myObject') // (accepts an object for same use as with `mapDispatch`)
    .action('myProperty', ['set', 'merge']) // this will recover the "set" and "merge" kinds of action for the property `myProperty` (accepts an object for same use as with `mapDispatch`)
);
// note that you will HAVE to call the method `.results()` at the end of the query if you don't use the `connect` function from dynamic-redux

const StoreProvidedComponent = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(StoreProvidedComponent);
