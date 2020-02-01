export enum ActionKinds {
  // general actions
  SET = 'set',
  RESET = 'reset',
  TRIGGER = 'trigger',
  QUERY = 'query',

  // array actions
  PUSH = 'push',
  POP = 'pop',
  SHIFT = 'shift',
  UNSHIFT = 'unshift',
  CONCAT = 'concat',
  FILTER = 'filter',
  MAP = 'map',

  // object actions
  MERGE = 'merge',

  // number actions
  INC = 'inc',
  DEC = 'dec',
}

// object containing all general actions
export type GeneralActions = 'set' | 'reset' | 'trigger';

// object containing all array actions
export type ArrayActions = (
  'push' |
  'pop' |
  'shift' |
  'unshift' |
  'concat' |
  'filter' |
  'map' |
  'query'
);

// object containing all object actions
export type ObjectActions = 'merge' | 'query';

// object containing all number actions
export type NumberActions = 'inc' | 'dec';

export type AllActions = GeneralActions | ArrayActions | ObjectActions | NumberActions;

export const actionList = Object.values(ActionKinds);
