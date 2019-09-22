import _ from 'lodash';

import { removeSpaces } from './utils';

/**
 * set the prop of the `state` into `newState` based on the `prop` passed if it exists in the state
 * @param {Object} state
 * @param {Object} newState
 * @param {Object} reducer
 * @param {String} reducer.name
 * @param {String} reducer.suffixed
 * @param {Object} states
 * @returns {Function}
 * @throws if the prop passed isn't in the state
 */
const getter = (newState, state, reducer, states) => {

  const stateReducer = state[reducer.suffixed];
  const currentState = states[reducer.suffixed];

  if (!stateReducer) {
    throw new Error(`There is no state called "${reducer.name}"`);
  }

  return prop => {
    let propName = prop;

    const isInState = currentState.isInState(prop);
    const isSelector = currentState.isSelector(prop);

    if (!isInState && !isSelector) {
      throw new Error(`There is no prop or selector called "${prop}" in the state "${reducer.name}"`);
    }

    if (isSelector) {
      propName += 'Selector';
    }

    // return either a property from the state or a selector
    newState[propName] = isInState
      ? stateReducer[prop]
      : (...args) => currentState.selectors[prop](stateReducer, ...args);
  }
}

/**
 * puts the props of the `state` into `newState` based on the `_props` passed
 * @param {String} _props
 * @param {Object} state
 * @param {Object} newState
 * @param {Object} states
 */
const mapString = (_props, state, newState, states) => {
  const stateParts = removeSpaces(_props.split(':'));

  if (stateParts.length < 2) {
    throw new Error('The props must be specified within a state');
  }

  const [reducerName, propsStr] = stateParts;
  const props = removeSpaces(propsStr.split(/\s/g));
  const reducerSuffixed = reducerName + 'Reducer';

  const reducer = { name: reducerName, suffixed: reducerSuffixed };

  props.forEach(getter(newState, state, reducer, states));
}

/**
 * puts the props of the `state` into `newState` based on the `reducers` passed
 * @param {Object} reducers
 * @param {Object} state
 * @param {Object} newState
 * @param {Object} states
 */
const mapObject = (reducers, state, newState, states) => {
  _.forIn(reducers, (props, reducerName) => {
    let propList = reducerName + ': ';

    if (Array.isArray(props)) {
      propList += props.join(' ');
    } else if (_.isString(props)) {
      propList += props;
    } else {
      throw new Error(`The props must be either an array or a string. Got "${props}"`);
    }

    mapString(propList, state, newState, states);
  });
}

/**
 * returns the properties from an object based on the props passed in parameter
 * @param {String | Object} props
 * @returns {Function}
 */
export function mapDynamicState(props) {
  return state => {

    if (!props) {
      throw new Error('The props must be specified');
    }

    const newState = {};
    let mapper;

    if (_.isString(props)) {
      mapper = mapString;
    } else if (_.isObject(props)) {
      mapper = mapObject;
    } else {
      throw new Error(`The props must be either a string or an object. Got "${props}"`);
    }

    mapper(props, state, newState, mapDynamicState.states);

    return newState;
  }
}
