import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Merge = createSpecificActionDecorator(ActionKinds.MERGE);
