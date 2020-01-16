import {
  ActionDispatcher,
  Selector,
  generalActions,
  arrayActions,
  objectActions,
  numberActions,
  ObjectOf,
  ActionDefinition,
} from '../common';
import { MiddlewareCreator } from '../MiddlewareCreator';

export type StateModel<T> = {
  [P in keyof T]: string;
};

export type Actions<T> = {
  [P in keyof T]: ActionDispatcher;
};

export type StateActions<T> = {
  [P in keyof T]: () => {}; // TODO handle actions type
};

export type StateMiddlewares<T> = {
  [P in keyof T]: MiddlewareCreator<T>;
};

export type StateSelectors<T> = ObjectOf<Selector<T>>;

export interface StateOptions {
  name?: string;
  strictTyping?: boolean;
}

export type EnumerateActionsForType<T> = ActionDefinition<typeof generalActions> | (
  T extends any[]
    ? ActionDefinition<typeof arrayActions>
    : T extends object
      ? ActionDefinition<typeof objectActions>
      : T extends number
        ? ActionDefinition<typeof numberActions>
        : ActionDefinition<typeof generalActions>
);
export type ObjectOfActionsDefinition<T> = {
  [P in keyof T]: EnumerateActionsForType<T[P]>;
};
