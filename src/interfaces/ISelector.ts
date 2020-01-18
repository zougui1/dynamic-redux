import { Selector } from '../common';

export interface ISelector<T> {
  handler: Selector<T>;

  new();
}
