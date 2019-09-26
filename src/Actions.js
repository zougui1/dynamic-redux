import _ from 'lodash';

/**
 * validate a type
 * @param {Function} validateType
 * @param {*} prop
 * @param {String} error
 * @throws if the type is not valid
 */
const baseValidateType = (validateType, prop, error) => {
  if (!validateType(prop)) {
    throw new Error(error);
  }
}

/**
 * create a template of type validation for the prop in the state
 * @param {Function} validateType
 * @param {String} type
 * @returns {Function}
 */
const createValidatePropType = (validateType, type) => (state, action, prop) => {
  baseValidateType(
    validateType,
    state[prop],
    `${type} action used on a non-${type}. Type "${action.type}" property concerned "${prop}"`
  );
}

/**
 * create a template of type validation for the value in the action
 * @param {Function} validateType
 * @param {String} type
 * @returns {Function}
 */
const createValidateType = (validateType, type) => action => {
  baseValidateType(
    validateType,
    action.payload,
    `Value passed to action "${action.type}" must be ${type}. Got "${action.payload}"`
  );
}

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
const baseAction = validatePropType => (validateType, callback) => (state, action, prop) => {
  if (validatePropType) {
    validatePropType(state, action, prop);
  }

  if (validateType) {
    validateType(action);
  }

  return callback(state, action, prop);
}

// action template for arrays
const arrayAction = baseAction(validatePropArray);

// function using native functions with data of the action
const nativeFunction = (state, action, prop) => {
  return state[prop][action.kind](action.payload);
}

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
  static array = arrayAction(null, nativeFunction);

  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Array}
   */
  static arrayWithArray = arrayAction(validateArray, nativeFunction);

  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Array}
   */
  static arrayWithFunction = arrayAction(validateFunction, nativeFunction);

  // actions for objects
  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Object}
   */
  static objectWithObject = objectAction(validateObject, (state, action, prop) => {
    return state[prop] = _.merge(state[prop], action.payload);
  });

  // actions for numbers
  /**
   * @param {Object} state
   * @param {Object} action
   * @param {String} prop
   * @returns {Number}
   */
  static numberWithNumber = numberAction(validateNumber, (state, action, prop) => {
    switch (action.kind) {
      case 'inc':
        return state[prop] += action.payload;
      case 'dec':
        return state[prop] -= action.payload;
    }
  });

}
