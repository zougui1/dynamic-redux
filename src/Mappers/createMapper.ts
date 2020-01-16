import * as _ from 'lodash';
import { Dispatch } from 'redux';

// get the objects Mappers from the current directory into an object
import * as Mappers from './Mappers';
import { MappersDataType, ObjectLiteral } from '../common';

type MapperCreator = (userSource: MappersDataType) => (reduxSource: Dispatch | ObjectLiteral) => ObjectLiteral;

/**
 *
 * @param {string} type mapper's type
 */
export function createMapper(type: string): MapperCreator {
  const upperType = _.upperFirst(type);

  return (userSource: MappersDataType) => (reduxSource: Dispatch | ObjectLiteral) => {
    // get the right Mapper object
    const MapperObject = Mappers[upperType + 'Mapper'];

    // instanciate the mapper
    const mapper = new MapperObject(userSource, reduxSource);

    // return its result
    return mapper.result;
  };
}
