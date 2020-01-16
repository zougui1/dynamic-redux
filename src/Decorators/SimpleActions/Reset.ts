import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Reset = createSpecificActionDecorator(ActionKinds.RESET);
