import { ActionKinds, generalActions, arrayActions, objectActions, numberActions } from './ActionKinds';

export type ActionDefinition<T> = keyof T | Array<keyof T>;
