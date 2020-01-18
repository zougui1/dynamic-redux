import * as _ from 'lodash';

import { separateLastAccessorFromPath, random, merge } from '../utils';
import { ValueOrFunction, Iteratee } from './types';
import { ItemTypeIfArray, ObjectLiteral } from 'src/common';

/**
 * @template T
 * @class
 */
export class Query<T = null> {

  /**
   * current value to query
   * @type {T}
   * @private
   */
  private property: T;
  /**
   * result of the query (is also the source that contains `this.property`)
   * @type {T}
   * @private
   */
  public result: T;
  /**
   * last action that have been done
   * @type {Function}
   * @private
   */
  private lastAction: () => this | Query<unknown>;
  /**
   * path from the original element to `this.property`
   * @type {String}
   * @private
   */
  private path: string;
  /**
   * element returned by a mutating function
   * @type {*}
   * @private
   */
  private returnedElement: any;

  /**
   * @param {T=} property value to query
   * @param {T=} result
   * @param {String=} [path=''] query path
   */
  constructor(property?: T, result?: T, path: string = '') {
    this.property = property;
    this.result = result || property;
    this.path = path;
  }

  /**
   * get the value from `value` whether or not it's a function that return the wanted value
   * @param {Function | *} value
   * @returns {*}
   * @private
   */
  private getValue(value: ValueOrFunction<T>) {
    if (_.isFunction(value)) {
      return value(this.property);
    }
    return value;
  }

  /**
   * create a new action
   * @param {Function} action
   * @returns {*}
   * @private
   */
  private newAction<TQuery = null>(action: () => Query<TQuery>): Query<TQuery> {
    this.lastAction = action;

    // return an empty `Query` if `this.property` is null which will cancel the other actions
    if (this.property == null) {
      return new Query<null>();
    }

    return action();
  }

  /**
   * repeat the last action
   * @returns {Query}
   * @public
   */
  repeat(): this {
    this.lastAction();
    return this;
  }

  /**
   * edit the value of `this.result`
   * @param {*} value
   * @private
   */
  private setter(value: any): void {
    // need to separate the last accessor from the rest of the path
    // to be able to set the value from a mutation
    const { path, lastPath } = separateLastAccessorFromPath(this.path);

    // if the path is empty it means there is no path, so we set `result`
    if (!this.path) {
      this.result = this.property = value;
    } else {
      _.get(this.result, path)[lastPath] = this.property = value;
    }
  }

  /**
   * wraps a group of action into its own function
   * thus allowing to do several actions on different layer
   * of the original element
   * @param {Function} callback
   * @returns {Query}
   * @public
   */
  group(callback: (query: this) => Query) {
    return this.action(() => callback(this));
  }

  /**
   * concatenate 2 paths
   * @param {String} path
   * @returns {String}
   * @private
   */
  private addPath(path: string): string {
    return this.path + path;
  }

  /**
   * concatenate an object path with `this.path`
   * @param {String} path
   * @returns {String}
   * @private
   */
  private objectPath(path: string): string {
    return this.addPath('.' + path);
  }

  /**
   * concatenate an array path with `this.path`
   * @param {String | Number} path
   * @returns {String}
   * @private
   */
  private arrayPath(path: string | number): string {
    return this.addPath(`[${path}]`);
  }

  /**
   * find a value in `this.property` with the `callback`
   * @method
   * @param {Function | String} predicate
   * @param {*=} testValue
   * @param {*=} defaultValue
   * @returns {Query}
   * @public
   */
  find(predicate: string | Iteratee<T, boolean>, testValue?: any, defaultValue?: T): Query<ItemTypeIfArray<T>> {
    if (typeof predicate !== 'function') {

      if (typeof predicate !== 'string') {
        const targetData = predicate;
        predicate = (item) => _.get(item, targetData) === testValue;
      } else {
        throw new Error(`'predicate' must be a function or a string. Got "${predicate}"`);
      }
    } else {
      defaultValue = testValue;
    }

    return this.newAction(() => {
      let index = -1;

      if (Array.isArray(this.property)) {
        const anyProperty = this.property as any;

        let found = anyProperty.find((v, i, source) => {
          // @ts-ignore
          if (predicate(v, i, source)) {
            // avoid to search the index if we already know it
            index = i;
            return true;
          }
          return false;
        });

        if (found == null) {
          if (defaultValue == null) {
            throw new Error(`'find' did not find a value and has no default value defined`);
          } else {
            found = defaultValue;
            index = anyProperty.length;
            // add the value to the property
            anyProperty.push(found);
          }
        }

        return new Query(found, this.result, this.arrayPath(index));
      }
    });
  }

  /**
   * get a new query of a value in `this.property`
   * @param {String} path
   * @returns {Query}
   * @public
   */
  get<K extends keyof T & string>(path: K): Query<T[K]> {
    return this.newAction(() => new Query(_.get(this.property, path), this.result, this.objectPath(path)));
  }

  /**
   * get a new query at the position `index` in `this.property`
   * @param {Number} index
   * @returns {Query}
   * @public
   */
  at(index: number): Query<ItemTypeIfArray<T>> {
    if (Array.isArray(this.property)) {
      if (index < 0) {
        throw new Error(`'at' cannot use an index lower than 0`);
      } else if (index >= this.property.length) {
        throw new Error(`'at' cannot use an index greater  or equal to the array length. index: "${index}", array length: "${this.property.length}"`);
      }

      // @ts-ignore
      return this.newAction(() => new Query<ItemTypeIfArray<T>>(this.property[index], this.result, this.arrayPath(index)));
    }
  }

  /**
   * push one or more `items` into `this.property`
   * @param {T[]} items
   * @returns {Query}
   * @public
   */
  push(...items: Array<ItemTypeIfArray<T>>): this {
    items = items.map(this.getValue);

    return this.action(() => {
      if (Array.isArray(this.property)) {
        this.property.push(...items);
      }
    });
  }

  /**
   * pop a value from `this.property`
   * @param {(q: Query) => void} callback
   * @returns {Query}
   * @public
   */
  pop(callback: ((item: Query<ItemTypeIfArray<T>>) => any)): this {
    return this.action(() => {
      if (Array.isArray(this.property)) {
        callback(new Query(this.property.pop()));
      }
    });
  }

  /**
   * shift a value from `this.property`
   * @param {(q: Query) => void} callback
   * @returns {Query}
   * @public
   */
  shift(callback: ((item: Query<ItemTypeIfArray<T>>) => any)): this {
    return this.action(() => {
      if (Array.isArray(this.property)) {
        callback(new Query(this.property.shift()));
      }
    });
  }

  /**
   * unshift one or more items` into `this.property`
   * @param {T[]} items
   * @returns {Query}
   * @public
   */
  unshift(...items: Array<ItemTypeIfArray<T>>): this {
    items = items.map(this.getValue);
    return this.action(() => {
      if (Array.isArray(this.property)) {
        this.property.unshift(...items);
      }
    });
  }

  /**
   * concatenate `this.property` with `items`
   * @param {Array<T[]>} items
   * @returns {Query}
   * @public
   */
  concat(...items: Array<Array<ItemTypeIfArray<T>>>): this {
    items = items.map(this.getValue);

    return this.action(() => {
      if (Array.isArray(this.property)) {
        return this.property.concat(...items);
      }
    });
  }

  /**
   * map into `this.property`
   * @param {Function | String} callback
   * @returns {Query}
   * @public
   */
  map(callback: Iteratee<T>): this {
    if (typeof callback !== 'function') {

      if (typeof callback === 'string') {
        const targetData = callback;
        callback = (item) => _.get(item, targetData);
      } else {
        throw new Error(`'callback' must be a function or a string. Got "${callback}"`);
      }
    }

    return this.setAction(() => {
      if (Array.isArray(this.property)) {
        this.property.map(callback);
      }
    });
  }

  /**
   * filter `this.property`
   * @param {Function | String | Number} callback
   * @param {*?} testValue
   * @returns {Query}
   * @public
   */
  filter(predicate: string | number | Iteratee<T, boolean>, testValue: any): this {
    let callback: Iteratee<T, boolean>;

    if (typeof predicate !== 'function') {

      if (typeof predicate === 'string') {
        const targetData = predicate;
        callback = (item) => _.get(item, targetData) === testValue;
      } else if (Number.isInteger(+predicate)) {
        const targetData = predicate;
        callback = (v, i) => i === targetData;
      } else {
        throw new Error(`'predicate' must be a function, string or integer. Got "${predicate}"`);
      }
    } else {
      callback = predicate;
    }

    return this.setAction(() => {
      if (Array.isArray(this.property)) {
        this.property.filter(callback);
      }
    });
  }

  /**
   * splice `this.property`
   * @param {Number} start
   * @param {Number} deleteCount
   * @param {Array} items
   * @returns {Query}
   * @public
   */
  splice(start: number, deleteCount: number, ...items: Array<ItemTypeIfArray<T>>): this {
    return this.returningAction(() => {
      if (Array.isArray(this.property)) {
        return this.property.splice(start, deleteCount, ...items);
      }
    });
  }

  /**
   * slice `this.property`
   * @param {Number} start
   * @param {Number} deleteCount
   * @returns {Query}
   * @public
   */
  slice(start: number, deleteCount: number) {
    return this.setAction(() => {
      if (Array.isArray(this.property)) {
        return this.property.slice(start, deleteCount);
      }
    });
  }

  /**
   * remove elements using either a predicate or values
   * @param {Function | Array} predicate
   * @param {(q: Query) => void} callback
   * @returns {Query}
   * @public
   */
  remove(predicate: Iteratee<T, boolean> | Array<ItemTypeIfArray<T>>, callback: ((query: Query<Array<ItemTypeIfArray<T>>>) => any)) {
    if (_.isFunction(predicate)) {
      this.newAction(() => {
        if (Array.isArray(this.property)) {
          callback(new Query(_.remove(this.property, predicate)));
        }
        return null;
      });
    } else {
      this.newAction(() => {
        if (Array.isArray(this.property)) {
          _.pullAll(this.property, predicate);
        }
        return null;
      });
    }
    return this;
  }

  /**
   * remove duplicates of `this.property`
   * @returns {Query}
   * @public
   */
  uniq(): this {
    return this.setAction(() => {
      if (Array.isArray(this.property)) {
        _.uniq(this.property);
      }
    });
  }

  /**
   * get a random value out of an array or a string
   * @returns {Query}
   * @public
   */
  random(): Query<ItemTypeIfArray<T>> {
    let index: number = 0;

    if (Array.isArray(this.property)) {
      index = random(0, this.property.length - 1);
    }

    // @ts-ignore
    return this.newAction(() => new Query<ItemTypeIfArray<T>>(this.property[index], this.result, this.arrayPath(index)));
  }

  /**
   * merge `objects` with `this.property`
   * @param {Object[]} objects
   * @returns {Query}
   * @public
   */
  merge(...objects: ObjectLiteral[]): this {
    return this.setAction(() => {
      if (this.property != null && typeof this.property === 'object') {
        merge(this.property, ...objects);
      }
    });
  }

  /**
   * reverse `this.property`
   * @returns {Query}
   * @public
   */
  reverse(): this {
    return this.action(() => {
      if (Array.isArray(this.property)) {
        this.property.reverse();
      }
    });
  }

  /**
   * removes elements from `this.property` corresponding to `indexes`
   * @param {Number[]} indexes
   * @returns {Query}
   * @public
   */
  pullAt(indexes: number[]): this {
    return this.returningAction(() => {
      if (Array.isArray(this.property)) {
        _.pullAt(this.property, indexes);
      }
    });
  }

  /**
   * set `this.property` with `this.returnedElement`
   * @return {Query}
   * @private
   */
  private returned(): this {
    return this.set(this.returnedElement);
  }

  /**
   * set `this.property` with `value`
   * @param {*} value
   * @returns {Query}
   * @public
   */
  set(value: any): this {
    return this.setAction(() => this.getValue(value));
  }

  /**
   * create an action that return `this`
   * @param {Function} action
   * @returns {Query}
   * @private
   */
  private action(action: (() => any)): this {
    this.newAction(action);
    return this;
  }

  /**
   * create an action to set a value
   * @param {Function} action
   * @returns {Query}
   * @private
   */
  private setAction(action: (() => any)): this {
    return this.action(() => this.setter(action()));
  }

  /**
   * create an action for actions that returns a value for `this.returnedElement`
   * @param {Function} action
   * @returns {Query}
   * @private
   */
  private returningAction(action: (() => any)): this {
    return this.action(() => this.returnedElement = action());
  }
}
/*
const val = {
  something: {
    that: {
      is: {
        nested: [
          {
            with: {
              several: ['values'],
            },
          },
        ],
      },
    },
  },
  else: {
    something: {
      tells: {
        me: ['that', 'this', 'is', 'gonna', 'be', 'hard'],
      },
    },
  },
};

new Query(val);
*/
