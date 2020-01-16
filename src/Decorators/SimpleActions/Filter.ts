import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Filter = createSpecificActionDecorator(ActionKinds.FILTER);
