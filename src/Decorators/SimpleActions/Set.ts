import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Set = createSpecificActionDecorator(ActionKinds.SET);
