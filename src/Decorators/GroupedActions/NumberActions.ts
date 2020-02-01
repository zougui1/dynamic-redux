import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const NumberActions = createSpecificActionDecorator([
  ActionKinds.DEC,
  ActionKinds.INC,
]);
