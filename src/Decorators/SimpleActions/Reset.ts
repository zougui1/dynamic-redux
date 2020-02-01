import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Reset = createSpecificActionDecorator(ActionKinds.RESET);
