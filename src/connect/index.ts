import * as _ from 'lodash';

import { mapState, mapDispatch } from '../';
import { QueryDispatch } from '../QueryDispatch';
import { Mapper } from './types';
import { VanillaMapper } from 'src/common';

let rConnect;
let error;

/**
 * require react-redux synchronously
 * doesn't throw an error if it doesn't exists
 * only throw it if the `connect` function is executed without react-redux installed
 */
try {
  const reactRedux = require('react-redux'); // tslint:disable-line

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
 * @returns {VanillaMapper}
 */
function getMap(map: Mapper | (Mapper | QueryDispatch), mapper): VanillaMapper {
  if (QueryDispatch.isInstance(map)) {
    // @ts-ignore
    return map.results();
  }

  const mapType = typeof map;

  if (mapType === 'string' || (map && mapType === 'object')) {
    return mapper(map);
  }

  // @ts-ignore
  return map;
};

/**
 * use direct string and object to transform them with the dynamic mappers
 * and make them consumable for the for the `connect` function of *react-redux*
 * @param {String | Object | Function | undefined} mapStateToProps
 * @param {String | Object | Function | undefined} mapDispatchToProps
 * @returns {Object}
 */
export const connect = (mapStateToProps: Mapper, mapDispatchToProps: Mapper | QueryDispatch) => {
  if (!rConnect) {
    throw error;
  }

  mapStateToProps = getMap(mapStateToProps, mapState);
  mapDispatchToProps = getMap(mapDispatchToProps, mapDispatch);

  return rConnect(mapStateToProps, mapDispatchToProps);
};
