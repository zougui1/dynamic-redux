export function cloneDeep<T>(element: T): T | T[] {
  if (Array.isArray(element)) {
    return element.map(e => cloneDeep(e));
  }

  if (element && typeof element === 'object') {
    const obj: any = {};

    for (const key in element) {
      if (element.hasOwnProperty(key)) {
        obj[key] = cloneDeep(element[key]);
      }
    }

    return obj;
  }

  return element;
}
