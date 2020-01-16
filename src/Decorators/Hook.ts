import * as _ from 'lodash';

import { MiddlewareCreator } from '../MiddlewareCreator';
import { ObjectLiteral, GlobalScope } from 'src/common';

export function Hook(dirtyMiddlewares: any) {
  let middlewares: any[] = [];

  if (!dirtyMiddlewares) {
    throw new Error(`Middlewares must be a MiddlewareCreator or an array of MiddlewareCreator. Got "${dirtyMiddlewares}"`);
  }

  if (!Array.isArray(dirtyMiddlewares)) {
    middlewares.push(dirtyMiddlewares);
  } else {
    middlewares = middlewares.concat(dirtyMiddlewares);
  }

  for (let i = 0; i < middlewares.length; i++) {
    const middlewareInstance = new middlewares[i]();

    if (typeof middlewareInstance.actionKind !== 'string') {
      throw new Error(`The action kind of middleware "${middlewareInstance.constructor.name}" must be a string. Got "${middlewareInstance.actionKind}"`);
    }

    middlewares[i] = middlewareInstance;
  }

  return (target: ObjectLiteral, propertyName: string) => {
    const globalScope = GlobalScope.get();
    const stateName = _.lowerFirst(target.constructor.name);
    const state = globalScope.states[stateName];

    for (const middleware of middlewares) {
      state.addMiddleware(new MiddlewareCreator(propertyName, middleware.actionKind));
    }
  };
}
