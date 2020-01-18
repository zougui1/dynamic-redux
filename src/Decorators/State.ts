import * as _ from 'lodash';

import { ObjectLiteral, GlobalScope } from '../common';
import { StateCreator } from '../StateCreator';
import { StateOptions } from '../StateCreator/types';

export function State(nameOrOptions?: string | ObjectLiteral, maybeOptions?: StateOptions) {

  return (target: new () => ObjectLiteral) => {
    let name: string;
    let options: StateOptions = {};

    if (typeof nameOrOptions === 'string') {
      name = nameOrOptions;
    } else if (nameOrOptions && typeof nameOrOptions === 'object') {
      options = nameOrOptions;
    }

    if (!options && maybeOptions && typeof maybeOptions === 'object') {
      options = maybeOptions;
    }

    const targetName = _.lowerFirst(target.name);
    name = name || options.name || targetName;

    const globalScope = GlobalScope.get();

    globalScope.states[name] = new StateCreator(name, new target(), options)
      .createActions(globalScope.actions[targetName])
      .createMiddlewares(globalScope.middlewares[targetName])
      .createSelectors(globalScope.selectors[targetName]);
  };
}
