import * as _ from 'lodash';
import { Dispatch } from 'redux';

import { MappersDataType, ObjectString, ObjectLiteral, ActionKinds, GlobalScope, AllActions } from '../common';
import { splitWords, prefixAll, forIn } from '../utils';
import { mapDispatch } from '../mapDispatch/mapDispatch';

/**
 * @typedef {DispatchData | String[]} DispatchDataArray
 */

export class QueryDispatch {

  private dispatchData: ObjectString = {};
  private stateNamespace: string;

  /**
   * @param {String | Object} [dispatchData]
   * @param {String} [stateNamespace]
   */
  constructor(dispatchData?, stateNamespace?) {
    if (dispatchData) {
      if (typeof dispatchData === 'string') {
        this.dispatchData = this.parseDispatchData(dispatchData);
      } else if (dispatchData && typeof dispatchData === 'object' && !Array.isArray(dispatchData)) {
        this.dispatchData = dispatchData;
      } else {
        throw new Error(`The dispatch datas must be a string or an object. Got "${dispatchData}"`);
      }
    }

    this.stateNamespace = stateNamespace;
  }

  /**
   * @param {String | String[]} dispatchData
   * @returns {String[]}
   * @private
   */
  private splitDispatchData(dispatchData: string | string[]): string[] {
    const splitedData = Array.isArray(dispatchData)
      ? [dispatchData.join(' ')]
      : dispatchData.split(':');

    if (splitedData.length === 1) {
      splitedData.unshift(this.stateNamespace);
    }

    return splitedData;
  }

  /**
   * parse a dispatch data string into an object
   * @param {String | String[]} dispatchData
   * @returns {Object.<String, String>}
   * @private
   */
  private parseDispatchData(dispatchData: string | string[]): ObjectString {
    const [stateName, properties] = this.splitDispatchData(dispatchData);

    return { [stateName]: properties };
  }

  /**
   * @returns {Object}
   * @public
   */
  results(): (dispatch: Dispatch) => ObjectLiteral {
    return mapDispatch(this.dispatchData);
  }

  /**
   * @param {String} stateNamespace
   * @param {(q: QueryDispatch) => *} callback
   * @returns {this}
   * @public
   */
  state(stateNamespace: string, callback: ((q: QueryDispatch) => any)): this {
    const query = new QueryDispatch(null, stateNamespace);

    callback(query);
    if (!this.dispatchData[stateNamespace]) {
      this.dispatchData[stateNamespace] = '';
    }

    this.dispatchData[stateNamespace] += query.dispatchData[stateNamespace];

    return this;
  }

  /**
   * @param {DispatchDataArray} dispatchData
   * @returns {Object.<String, String>}
   * @private
   */
  private unifyDispatchData(dirtyDispatchData: MappersDataType | string[]): ObjectString {
    let dispatchData: ObjectString;

    if (typeof dirtyDispatchData === 'string' || Array.isArray(dirtyDispatchData)) {
      dispatchData = this.parseDispatchData(dirtyDispatchData);
    } else if (!dirtyDispatchData || typeof dirtyDispatchData !== 'object') {
      throw new Error(`the dispatch data must be a string, an object or an array of strings. Got "${dirtyDispatchData}"`);
    }

    return dispatchData;
  }

  /**
   * @param {Object} dispatchData
   * @param {(properties: String[]) => String | String[]} [callback]
   * @private
   */
  private mapDispatchData(dispatchData: ObjectString, callback?: ((properties: string[]) => string | string[])): void {
    forIn(dispatchData, (propertyList, stateName) => {
      if (!this.dispatchData[stateName]) {
        this.dispatchData[stateName] = '';
      }

      /**
       * @type {String | String[]}
       */
      let properties: string | string[] = Array.isArray(propertyList)
        ? propertyList
        : splitWords(propertyList);

      properties = callback ? callback(properties as string[]) : properties;
      properties = Array.isArray(properties)
        ? properties.join(' ')
        : properties;

      this.dispatchData[stateName] += ' ' + properties;
    });
  }

  /**
   * @param {ActionKinds} actionKind prefix to add to the properties
   * @returns {(dispatchData: String | Object) => this}
   * @private
   */
  private createAction = (actionKind: ActionKinds) => (dirtyDispatchData: MappersDataType) => {
    const dispatchData: ObjectString = this.unifyDispatchData(dirtyDispatchData);

    this.mapDispatchData(dispatchData, properties => {
      return prefixAll(actionKind, properties);
    });

    return this;
  }

  // general actions
  set = this.createAction(ActionKinds.SET);
  reset = this.createAction(ActionKinds.RESET);
  trigger = this.createAction(ActionKinds.TRIGGER);
  query = this.createAction(ActionKinds.QUERY);
  // array actions
  push = this.createAction(ActionKinds.PUSH);
  pop = this.createAction(ActionKinds.POP);
  shift = this.createAction(ActionKinds.SHIFT);
  unshift = this.createAction(ActionKinds.UNSHIFT);
  concat = this.createAction(ActionKinds.CONCAT);
  filter = this.createAction(ActionKinds.FILTER);
  map = this.createAction(ActionKinds.MAP);
  // object actions
  merge = this.createAction(ActionKinds.MERGE);
  // number actions
  inc = this.createAction(ActionKinds.INC);
  dec = this.createAction(ActionKinds.DEC);

  /**
   * @param {MappersDataType | String[]} dispatchData
   * @returns {this}
   * @public
   */
  dispatch = (dirtyDispatchData: MappersDataType | string[]): this => {
    const dispatchData: ObjectString = this.unifyDispatchData(dirtyDispatchData);

    this.mapDispatchData(dispatchData);

    return this;
  }

  /**
   * @param {DispatchDataArray} dispatchData
   * @param {String[]} actionList
   * @returns {this}
   * @public
   */
  action = (dispatchData: MappersDataType | string[], actionList: AllActions[]): this => {
    actionList.forEach(action => this[action as string](dispatchData));
    return this;
  }

  /**
   * @param {DispatchDataArray} dispatchData
   * @returns {this}
   * @public
   */
  all = (dirtyDispatchData: MappersDataType): this => {
    const dispatchData: ObjectString = this.unifyDispatchData(dirtyDispatchData);

    const states = GlobalScope.get().states;

    // loop through each state in `dispatchData`
    forIn(dispatchData, (dirtyProperties, stateName) => {
      let properties: string[];

      if (typeof dirtyProperties === 'string') {
        properties = splitWords(dirtyProperties);
      } else {
        properties = dirtyProperties;
      }

      const state = states[stateName];

      // loop through each property
      for (const property of properties) {
        const propertyActions = state.getActionKinds(property);

        // loop through the action kinds available for `property`
        for (const propertyAction of propertyActions) {
          this[propertyAction]({ [stateName]: property });
        }
      }
    });

    return this;
  }

  /**
   * get if the `element` is an instance of `QueryDispatch`
   * @param {*} element
   * @returns {Boolean}
   * @public
   * @static
   */
  static isInstance(element: any): boolean {
    return element instanceof QueryDispatch;
  }
}
