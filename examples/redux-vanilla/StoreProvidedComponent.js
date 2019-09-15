import React from 'react';
import { connect } from 'react-redux';

// need to import each action creators needed
import { setMyProperty } from './store/actions/example';

// the returned object can easily grow if several properties in the store are needed
const mapStateToProps = state => ({
  myProperty: state.exampleReducer.myProperty
});

// the returned object can easily grow if several properties in the store need to be modified
const mapDispatchToProps = dispatch => ({
  setMyProperty: myProperty => dispatch(setMyProperty(myProperty))
});

const StoreProvidedComponent = ({ myProperty, setMyProperty }) => {
  setMyProperty('new value');

  return <p>myProperty: {myProperty}</p>
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreProvidedComponent);
