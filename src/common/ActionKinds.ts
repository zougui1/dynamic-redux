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
export const generalActions = {
  set: null,
  reset: null,
  trigger: null,
};

// object containing all array actions
export const arrayActions = {
  push: null,
  pop: null,
  shift: null,
  unshift: null,
  concat: null,
  filter: null,
  map: null,
  query: null,
};

// object containing all object actions
export const objectActions = {
  merge: null,
  query: null,
};

// object containing all number actions
export const numberActions = {
  inc: null,
  dec: null,
};

export const allActions = {
  ...generalActions,
  ...arrayActions,
  ...objectActions,
  ...numberActions,
};
