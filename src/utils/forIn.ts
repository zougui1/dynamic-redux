type ForInCallback<T> = (value: T[keyof T], name: string) => any;

export function forIn<T>(object: T, cb: ForInCallback<T>): void {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      cb(object[key], key);
    }
  }
}
