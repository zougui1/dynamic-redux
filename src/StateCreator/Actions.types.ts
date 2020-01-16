import { ActionObject } from '../common';

export type ValidateType = (value: any) => boolean;

export type validatePropTypeFunction = (state: object, action: ActionObject, prop: string) => void;
export type validateTypeFunction = (action: ActionObject) => void;
export type ActionCallback<T> = (state: object, action: ActionObject, prop: string) => T;
