import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const ObjectActions = createSpecificActionDecorator([
  ActionKinds.MERGE,
  ActionKinds.QUERY,
]);
