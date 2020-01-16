import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Trigger = createSpecificActionDecorator(ActionKinds.TRIGGER);
