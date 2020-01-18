import * as _ from 'lodash';

import { ObjectLiteral, GlobalScope } from '../common';
import { ISelector } from '../interfaces/ISelector';

export function Selectors<T = ObjectLiteral>(selectors: Array<ISelector<T>>) {
  return (target: new () => ObjectLiteral) => {
    const globalScope = GlobalScope.get();
    const stateName = _.lowerFirst(target.constructor.name);

    for (const selector of selectors) {
      const selectorInstance = new selector();

      globalScope.addSelectors(stateName, selectorInstance);
    }
  }
}
