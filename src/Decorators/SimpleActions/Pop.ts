import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Pop = createSpecificActionDecorator(ActionKinds.POP);
