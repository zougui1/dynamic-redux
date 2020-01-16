export function getType(element: any): string {
  return Array.isArray(element)
    ? 'array'
    : typeof element;
}
