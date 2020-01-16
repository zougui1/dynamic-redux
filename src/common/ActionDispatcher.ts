import { ActionObject } from './ActionObject';

export type ActionDispatcher = (value: any, dispatch: (value: ActionObject) => {}) => void;
