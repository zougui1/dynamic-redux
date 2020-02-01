import { createSpecificActionDecorator } from '../utils/createSpecificActionDecorator/createSpecificActionDecorator';
import { ActionKinds, AllActions } from '../common';

export function Action(actionKinds: AllActions | AllActions[]) {
  return createSpecificActionDecorator(actionKinds as ActionKinds)();
}
