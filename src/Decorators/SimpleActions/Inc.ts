import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Inc = createSpecificActionDecorator(ActionKinds.INC);
