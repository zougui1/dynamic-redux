import * as _ from 'lodash';

import { ValidateType, validatePropTypeFunction, validateTypeFunction, ActionCallback } from './Actions.types';
import { ActionObject } from '../common';
import { merge } from '../utils';

/**
 * validate a type
 * @param {Function} validateType
 * @param {*} value
 * @param {String} error
 * @throws if the type is not valid
 */
const baseValidateType = (validateType: ValidateType, value: any, error: string): void => {
  if (!validateType(value)) {
    throw new Error(error);
  }
};

/**
 * create a template of type validation for the prop in the state
 * @param {Function} validateType
 * @param {String} type
 * @returns {Function}
 */
const createValidatePropType = (validateType: ValidateType, type: string) =>
  (state: object, action: ActionObject, prop: string): void => {
    baseValidateType(
      validateType,
      state[prop],
      `${type} action must be used on type '${type}'. Type "${action.type}" property concerned "${prop}"`,
    );
  };

/**
 * create a template of type validation for the value in the action
 * @param {Function} validateType
 * @param {String} type
 * @returns {Function}
 */
const createValidateType = (validateType: ValidateType, type: string) => (action: ActionObject) => {
  baseValidateType(
    validateType,
    action.payload,
    `Value passed to action "${action.type}" must be ${type}. Got "${action.payload}"`,
  );
};

const validatePropArray = createValidatePropType(Array.isArray, 'array');
const validatePropObject = createValidatePropType(_.isObject, 'object');
const validatePropNumber = createValidatePropType(Number.isFinite, 'number');

const validateArray = createValidateType(Array.isArray, 'an array');
const validateFunction = createValidateType(_.isFunction, 'a function');
const validateObject = createValidateType(_.isObject, 'an object');
const validateNumber = createValidateType(Number.isFinite, 'a number');

/**
 * create an action template
 * @param {Function} validatePropType
 * @returns {Function}
 */
const baseAction = (validatePropType?: validatePropTypeFunction) =>
  <T>(validateType: validateTypeFunction, callback: ActionCallback<T>) =>
    (state: object, action: ActionObject, prop: string): T => {
      if (validatePropType) {
        validatePropType(state, action, prop);
      }

      if (validateType) {
        validateType(action);
      }

      return callback(state, action, prop);
    };

// action template for arrays
const arrayAction = baseAction(validatePropArray);

// function using native functions with data of the action
const nativeFunction = (state: object, action: ActionObject, prop: string) => {
  return state[prop][action.kind](action.payload);
};

// action template for objects
const objectAction = baseAction(validatePropObject);

// action template for numbers
const numberAction = baseAction(validatePropNumber);

export class Actions {

  // actions for arrays
  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   */
  static array = arrayAction<any>(null, nativeFunction);

  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Array}
   */
  static arrayWithArray = arrayAction<[]>(validateArray, nativeFunction);

  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Array}
   */
  static arrayWithFunction = arrayAction<[]>(validateFunction, nativeFunction);

  // actions for objects
  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Object}
   */
  static objectWithObject = objectAction<object>(validateObject, (state: object, action: ActionObject, prop: string): object => {
    return state[prop] = merge(state[prop], action.payload);
  });

  // actions for numbers
  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Number}
   */
  static numberWithNumber = numberAction<number>(validateNumber, (state: object, action: ActionObject, prop: string): number => {
    switch (action.kind) {
      case 'inc':
        return state[prop] += action.payload;
      case 'dec':
        return state[prop] -= action.payload;
    }
  });

}
