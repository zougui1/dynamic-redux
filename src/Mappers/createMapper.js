import _ from 'lodash';

import * as Mappers from '.';
import * as mappers from '../';

export const createMapper = type => {
  const upperType = _.upperFirst(type);

  return userSource => reduxSource => {
    const mapper = new Mappers[upperType + 'Mapper'](userSource, reduxSource, mappers['map' + upperType])

    return mapper.result;
  }
}
