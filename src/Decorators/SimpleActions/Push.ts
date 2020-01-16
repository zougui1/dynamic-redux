import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Push = createSpecificActionDecorator(ActionKinds.PUSH);
