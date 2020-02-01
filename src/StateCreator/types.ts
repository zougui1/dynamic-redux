import {
  ActionDispatcher,
  Selector,
  GeneralActions,
  ArrayActions,
  ObjectActions,
  NumberActions,
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

export type EnumerateActionsForType<T> = (
  T extends any[]
    ? ActionDefinition<ArrayActions | GeneralActions>
    : T extends object
      ? ActionDefinition<ObjectActions | GeneralActions>
      : T extends number
        ? ActionDefinition<NumberActions | GeneralActions>
        : ActionDefinition<GeneralActions>
);
export type ObjectOfActionsDefinition<T> = {
  [P in keyof T]: EnumerateActionsForType<T[P]>;
};
