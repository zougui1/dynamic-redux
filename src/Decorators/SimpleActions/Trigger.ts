import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Trigger = createSpecificActionDecorator(ActionKinds.TRIGGER);
