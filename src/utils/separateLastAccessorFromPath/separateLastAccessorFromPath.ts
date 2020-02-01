import { getArrayIndexing } from '..';

interface SeparatedPath {
  path: string;
  lastPath: string;
}

/**
 * separate the last `path` accessor from the rest of the path
 * @param {String} path
 * @returns {Object}
 */
export function separateLastAccessorFromPath(path: string): SeparatedPath {
  const index = getArrayIndexing(path);
  let fullPath;
  let lastPath;

  // if `index.length` is greater than 1 it means there's an array indexing
  if (index.length > 1) {
    lastPath = Number(index[1]);
    fullPath = index[0];
  } else {
    // get the last accessor from the path
    const split = path.split('.');
    lastPath = split.pop();
    fullPath = split.join('.');
  }

  return {
    path: fullPath,
    lastPath,
  };
}
