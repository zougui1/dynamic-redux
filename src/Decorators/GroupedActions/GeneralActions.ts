import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const GeneralActions = createSpecificActionDecorator([
  ActionKinds.RESET,
  ActionKinds.SET,
  ActionKinds.TRIGGER,
]);
