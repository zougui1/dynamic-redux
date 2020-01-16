export type ItemTypeIfArray<T> = T extends Array<infer R> ? R : T;
