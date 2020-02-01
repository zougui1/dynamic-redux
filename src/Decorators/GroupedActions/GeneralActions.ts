import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const GeneralActions = createSpecificActionDecorator([
  ActionKinds.RESET,
  ActionKinds.SET,
  ActionKinds.TRIGGER,
]);
