import _ from 'lodash';
import { mapDynamicState, mapDynamicDispatch } from '.';

let rConnect;
let error;

/**
 * require react-redux synchronously
 * doesn't throw an error if it doesn't exists
 * only throw it if the `connect` function is executed without react-redux installed
 */
try {
  const reactRedux = require('react-redux');

  if (reactRedux) {
    rConnect = reactRedux.connect;
  }
} catch (e) {
  error = e;
}

/**
 *
 * @param {String | Object | Function | undefined} mapper
 * @param {Function} dynamicMapper
 * @returns {Function | undefined}
 */
const getMapper = (mapper, dynamicMapper) => {
  if (_.isFunction(mapper)) {
    return mapper;
  } else if (_.isString(mapper) || _.isObject(mapper)) {
    return dynamicMapper(mapper);
  }

  return null;
}

/**
 *
 * @param {String | Object | Function | undefined} _mapStateToProps
 * @param {String | Object | Function | undefined} _mapDispatchToProps
 * @returns {Object}
 */
const connect = (_mapStateToProps, _mapDispatchToProps) => {
  const mapStateToProps = getMapper(_mapStateToProps, mapDynamicState);
  const mapDispatchToProps = getMapper(_mapDispatchToProps, mapDynamicDispatch);

  if(!rConnect) {
    throw error;
  }

  return rConnect(mapStateToProps, mapDispatchToProps);
}

export default connect;
