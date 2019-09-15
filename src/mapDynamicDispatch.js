import _ from 'lodash';

import { removeSpaces } from './utils';

const reActions = /(push|pop|shift|unshift|concat|set|merge|filter|map|reduce|inc|dec)/;

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
 */
const createDispatch = (states, action, dispatch, tempActions) => {
  const actions = states[action.reducer].actions[action.propName];

  _.forIn(actions, (actionCreator, name) => {
    if (name === action.kind) {
      tempActions[action.name] = arg => {
        return dispatch(actionCreator(arg));
      }
    }
  });

}

/**
 *
 * @param {String} _actions
 * @param {Function} dispatch
 * @param {Object} tempActions
 * @param {Object} states
 */
const mapString = (_actions, dispatch, tempActions, states) => {
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

    if (action === 'resetState') {
      tempActions['reset' + _.upperFirst(reducerName) + 'State'] = () => dispatch(states[reducer].actions['__STATE__'].reset());
      return;
    }

    let [actionKind, propName] = action.replace(reActions, '$1_').split('_');

    if (!propName) {
      throw new Error(`The action must be prefixed by its kind. Got "${action}"`);
    }

    propName = _.lowerFirst(propName);

    if (!states[reducer].actions[propName]) {
      throw new Error(`The action "${propName}" doesn't exists on state "${reducerName}"`);
    }

    const _action = { reducer, reducerName, name: action, kind: actionKind, propName: propName };

    createDispatch(states, _action, dispatch, tempActions);
  });
}

/**
 *
 * @param {Object} reducers
 * @param {Function} dispatch
 * @param {Object} tempActions
 * @param {Object} states
 */
const mapObject = (reducers, dispatch, tempActions, states) => {
  _.forIn(reducers, (actions, reducerName) => {
    let actionList = reducerName + ': ';

    if (Array.isArray(actions)) {
      actionList += actions.join(' ');
    } else if (_.isString(actions)) {
      actionList += actions;
    } else {
      throw new Error(`The actions must be either an array or a string. Got "${actions}"`);
    }

    mapString(actionList, dispatch, tempActions, states);
  });
}

export function mapDynamicDispatch(actions) {
  return dispatch => {

    if (!actions) {
      throw new Error('The actions must be specified');
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

    mapper(actions, dispatch, tempActions, mapDynamicDispatch.states);

    return tempActions;
  }

}
