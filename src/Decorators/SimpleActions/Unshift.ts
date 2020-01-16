import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Unshift = createSpecificActionDecorator(ActionKinds.UNSHIFT);
