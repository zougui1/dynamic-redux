import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const NumberActions = createSpecificActionDecorator([
  ActionKinds.DEC,
  ActionKinds.INC,
]);
