import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Concat = createSpecificActionDecorator(ActionKinds.CONCAT);
