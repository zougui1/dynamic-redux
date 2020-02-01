import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Push = createSpecificActionDecorator(ActionKinds.PUSH);
