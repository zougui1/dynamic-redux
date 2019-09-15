import React from 'react';
import { connect } from 'react-redux';
import { mapDynamicState, mapDynamicDispatch } from 'dynamic-redux';

// no longer need to import the action creators

// the first argument must be either a string or an object of string and/or array and is required
//! if string
// the part before the colon is the name of the state
// the part after the colon is the name(s) of the properties contained in the state
// the properties' names must be separated by a whitespace
const mapStateToPropsFromString = mapDynamicState('example: myProperty');

//! if object
// the properties name is the name of the state
// the value contained must be either a string or an array of string
// that are the properties contained in the state
const mapDispatchToPropsFromObject = mapDynamicState({
  example: 'myProperty'
});

// `mapDynamicDispatch` works exactly the same as `mapDynamicState`
// with the only difference for the name of the actions
// which are the name of the properties prefixed by the kind of action defined
// in this case we had defined `myProperty: 'set'` in the `createActions` method
// so the only action available is `setMyProperty`
const mapDispatchToProps = mapDynamicDispatch('example: setMyProperty');

// works exactly the same as redux vanilla
const StoreProvidedComponent = ({ myProperty, setMyProperty }) => {
  setMyProperty('new value');

  return <p>myProperty: {myProperty}</p>
};

export default connect(mapStateToPropsFromString, mapDispatchToProps)(StoreProvidedComponent);
