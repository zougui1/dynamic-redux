import _ from 'lodash';

import { removeSpaces } from './utils';

/**
 * puts the props of the `state` into `newState` based on the `_props` passed
 * @param {String} _props
 * @param {Object} state
 * @param {Object} newState
 */
const mapString = (_props, state, newState) => {
  const stateParts = removeSpaces(_props.split(':'));

  if (stateParts.length < 2) {
    throw new Error('The props aren\'t specified within a state');
  }

  const [reducerName, propsStr] = stateParts;
  const props = removeSpaces(propsStr.split(/\s/g));
  const reducer = reducerName + 'Reducer';

  props.forEach(prop => newState[prop] = state[reducer][prop]);
}

/**
 * puts the props of the `state` into `newState` based on the `reducers` passed
 * @param {Object} reducers
 * @param {Object} state
 * @param {Object} newState
 */
const mapObject = (reducers, state, newState) => {
  _.forIn(reducers, (props, reducerName) => {
    let propList = reducerName + ': ';

    if (Array.isArray(props)) {
      propList += props.join(' ');
    } else if (_.isString(props)) {
      propList += props;
    } else {
      throw new Error(`The props must be either an array or a string. Got "${props}"`);
    }

    mapString(propList, state, newState);
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
      console.warn('The wanted props are not specified');
      return {};
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

    mapper(props, state, newState);

    return newState;
  }
}
