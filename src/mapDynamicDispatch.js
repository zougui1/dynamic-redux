import _ from 'lodash';

import { removeSpaces } from './utils';
import mapDynamicState from './mapDynamicState';

/**
 *
 * @param {Object} states
 * @param {Object} action
 * @param {String} action.reducer
 * @param {String} action.reducerName
 * @param {String} action.name
 * @param {Function} dispatch
 * @param {Object} store
 * @param {Function} store.getState
 * @returns {Object}
 */
const createDispatch = (states, action, dispatch, store) => {
  const actions = states[action.reducer].actions[action.name];
  const newActions = {};

  _.forIn(actions, (actionCreator, name) => {
    newActions[name] = arg => {
      return dispatch(actionCreator(arg));
    }
  });

  newActions.get = mapDynamicState(`${action.reducerName}: ${action.name}`)(store.getState());

  return newActions;
}

/**
 *
 * @param {String} _actions
 * @param {Function} dispatch
 * @param {Object} tempActions
 * @param {Object} states
 */
const mapString = (_actions, dispatch, tempActions, states, store) => {
  const stateParts = removeSpaces(_actions.split(':'));

  if (stateParts.length < 2) {
    throw new Error('The actions aren\'t specified within a state');
  }

  const [reducerName, actionsStr] = stateParts;
  const actions = removeSpaces(actionsStr.split(/\s/g));
  const reducer = reducerName + 'Reducer';

  actions.forEach(action => {
    if (!states[reducer]) {
      throw new Error(`The reducer "${reducerName}" doesn't exists`);
    }

    if (action !== 'resetReducer' && !states[reducer].actions[action]) {
      throw new Error(`The action "${action}" doesn't exists on the reducer "${reducerName}"`);
    }

    const _action = { reducer, reducerName, name: action };

    tempActions[action] = createDispatch(states, _action, dispatch, store);
  });
}

/**
 *
 * @param {Object} reducers
 * @param {Function} dispatch
 * @param {Object} tempActions
 * @param {Object} states
 */
const mapObject = (reducers, dispatch, tempActions, states, store) => {
  _.forIn(reducers, (actions, reducerName) => {
    let actionList = reducerName + ': ';

    if (Array.isArray(actions)) {
      actionList += actions.join(' ');
    } else if (_.isString(actions)) {
      actionList += actions;
    } else {
      throw new Error(`The actions must be either an array or a string. Got "${actions}"`);
    }

    mapString(actionList, dispatch, tempActions, states, store);
  });
}

function mapDynamicDispatch(actions) {
  return dispatch => {

    if (!actions) {
      console.warn('The wanted actions are not specified');
      return {};
    }

    const tempActions = {};
    let mapper;

    if (_.isString(actions)) {
      mapper = mapString;
    } else if (_.isObject(actions)) {
      mapper = mapObject;
    } else {
      throw new Error(`The actions must be either a string or an object. Got "${actions}"`);
    }

    mapper(actions, dispatch, tempActions, mapDynamicDispatch.states, mapDynamicDispatch.store);

    return tempActions;
  }

}

module.exports = mapDynamicDispatch;
