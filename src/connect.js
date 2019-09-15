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
const getMap = (map, mapper) => {
  if (_.isString(map) || _.isObject(map)) {
    return mapper(map);
  }

  return map;
}

/**
 * use direct string and object to transform them with the dynamic mappers and make them consumable for the for the `connect` function of *react-redux*
 * @param {String | Object | Function | undefined} _mapStateToProps
 * @param {String | Object | Function | undefined} _mapDispatchToProps
 * @returns {Object}
 */
export const connect = (_mapStateToProps, _mapDispatchToProps) => {
  if(!rConnect) {
    throw error;
  }

  const mapStateToProps = getMap(_mapStateToProps, mapDynamicState);
  const mapDispatchToProps = getMap(_mapDispatchToProps, mapDynamicDispatch);

  return rConnect(mapStateToProps, mapDispatchToProps);
}
