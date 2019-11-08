import _ from 'lodash';

// get the objects Mappers from the current directory into an object
import * as Mappers from './_Mappers';

/**
 *
 * @param {string} type mapper's type
 */
export const createMapper = type => {
  const upperType = _.upperFirst(type);

  return userSource => reduxSource => {
    // get the right Mapper object
    const MapperObject = Mappers[upperType + 'Mapper'];

    // instanciate the mapper
    const mapper = new MapperObject(userSource, reduxSource);

    // return its result
    return mapper.result;
  }
}
