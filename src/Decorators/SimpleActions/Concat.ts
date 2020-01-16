import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Concat = createSpecificActionDecorator(ActionKinds.CONCAT);
