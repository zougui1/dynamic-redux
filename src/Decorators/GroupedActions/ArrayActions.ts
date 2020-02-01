import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const ArrayActions = createSpecificActionDecorator([
  ActionKinds.CONCAT,
  ActionKinds.FILTER,
  ActionKinds.MAP,
  ActionKinds.POP,
  ActionKinds.PUSH,
  ActionKinds.QUERY,
  ActionKinds.SHIFT,
  ActionKinds.UNSHIFT,
]);
