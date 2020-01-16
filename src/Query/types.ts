import { ItemTypeIfArray } from 'src/common';

export type ValueOrFunction<T> = any | ((value: T) => any);
export type Iteratee<T, TReturn = T> = (item: ItemTypeIfArray<T>, i: number, source: Array<ItemTypeIfArray<T>>) => TReturn;
