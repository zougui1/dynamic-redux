import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Unshift = createSpecificActionDecorator(ActionKinds.UNSHIFT);
