import { createSpecificActionDecorator } from '../utils/createSpecificActionDecorator';
import { ActionKinds, allActions } from '../common';

export function Action(actionKinds: keyof typeof allActions | Array<keyof typeof allActions>) {
  return createSpecificActionDecorator(actionKinds as ActionKinds)();
}
