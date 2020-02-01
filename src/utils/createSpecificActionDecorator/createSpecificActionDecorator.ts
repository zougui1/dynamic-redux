import * as _ from 'lodash';

import { ObjectLiteral, GlobalScope, ActionKinds } from '../../common';

export function createSpecificActionDecorator(actionKinds: ActionKinds | ActionKinds[]) {
  return () => {
    return (target: ObjectLiteral, propertyName: string) => {
      const stateName = _.lowerFirst(target.constructor.name);

      GlobalScope.get().addActions(stateName, propertyName, actionKinds);
    };
  };
}
