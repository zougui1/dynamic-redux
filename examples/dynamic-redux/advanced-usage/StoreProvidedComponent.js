import React from 'react';
import { connect } from 'react-redux';
import { mapDynamicState, mapDynamicDispatch } from 'dynamic-redux';

// no longer need to import the action creators

const mapStateToPropsFromString = mapDynamicState('example: myProperty');

const mapDispatchToProps = mapDynamicDispatch({
  example: [
    // get the actions of `myProperty`
    'setMyProperty',
    // get the actions of `myArray` (note that they do not need to be in the same string)
    'pushMyArray popMyArray shiftMyArray unshiftMyArray concatMyArray filterMyArray mapMyArray reduceMyArray',
    // get the actions of `myObject`
    'mergeMyObject',
    // get the action of `myNumber`
    'incMyNumber decMyNumber'
  ],
});

// works exactly the same as redux vanilla
const StoreProvidedComponent = ({
  myProperty,
  setMyProperty,
  pushMyArray,
  popMyArray,
  shiftMyArray,
  unshiftMyArray,
  concatMyArray,
  filterMyArray,
  mapMyArray,
  reduceMyArray,
  mergeMyObject,
  incMyNumber,
  decMyNumber
}) => {
  // replace the old value with this one
  setMyProperty('new value');

  // add a value at the end of the array
  pushMyArray('new entry');
  // remove the last entry of the array
  popMyArray();
  // add a value at the first index of the array
  unshiftMyArray('new entry');
  // remove the first entry of the array
  shiftMyArray();
  // concatenate the array with this one
  concatMyArray(['array', 'to', 'concat']);
  // does the same as the native `filter` function
  filterMyArray(value => typeof value === 'string');
  // does the same as the native `map` function
  mapMyArray(value => <p>{value}</p>);
  // does the same as the native `reduce` function
  reduceMyArray((accumulator, currentValue) => accumulator + currentValue);

  // merge the object in the state with this one
  mergeMyObject({ property: 'value' });

  // increment the number in the state
  incMyNumber(1); // increment by 1
  // decrement the number in the state
  decMyNumber(5); // decrement by 5

  return <p>myProperty: {myProperty}</p>
};

export default connect(mapStateToPropsFromString, mapDispatchToProps)(StoreProvidedComponent);
