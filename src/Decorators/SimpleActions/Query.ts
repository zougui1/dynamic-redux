import { createSpecificActionDecorator } from '../../utils/createSpecificActionDecorator';
import { ActionKinds } from '../../common';

export const Query = createSpecificActionDecorator(ActionKinds.QUERY);
