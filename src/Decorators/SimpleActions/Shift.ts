import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Shift = createSpecificActionDecorator(ActionKinds.SHIFT);
