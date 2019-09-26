import _ from 'lodash';

import { GenericMapper } from './_GenericMapper';

const reActions = /(push|pop|shift|unshift|concat|set|merge|filter|map|inc|dec)/;

export class DispatchMapper {

  /**
   * @property {GenericMapper} mapper
   * @private
   */
  mapper;

  /**
   * @property {Function} dispatch
   * @private
   */
  dispatch;

  /**
   * @param {Object} actions
   * @private
   */
  actions = {};

  /**
   * return the result (`this.actions`) of the mapper
   * @returns {Object}
   * @public
   */
  get result() {
    return this.actions;
  }

  /**
   *
   * @param {string} props
   * @param {Object} state
   * @param {Function} publicMapper
   * @public
   */
  constructor(props, dispatch, publicMapper) {
    this.dispatch = dispatch;
    this.mapper = new GenericMapper(props, publicMapper, this.each);
  }

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
  createDispatch = (reducerActions, action, dispatch, tempActions) => {
    const actions = reducerActions[action.propName];

    _.forIn(actions, (actionCreator, name) => {
      if (name === action.kind) {
        tempActions[action.name] = arg => {
          return actionCreator(arg, dispatch);
        }
      }
    });

  }

  /**
   * called by `this.mapper` when mapping a string
   * @param {Object} thisArg `this.mapper`'s context
   */
  each = thisArg => {
    const { name, suffixed } = thisArg.reducer;
    const { states } = thisArg.publicMapper;

    if (!states[suffixed]) {
      throw new Error(`The reducer "${name}" doesn't exists`);
    }

    const reducerActions = states[suffixed].actions;

    return action => {
      if (action === 'resetState') {
        this.actions['reset' + _.upperFirst(name) + 'State'] = () => reducerActions['__STATE__'].reset(null, this.dispatch);
        return;
      }

      let [actionKind, propName] = action.replace(reActions, '$1_').split('_');

      if (!propName) {
        throw new Error(`The action must be prefixed by its kind. Got "${action}"`);
      }

      propName = _.lowerFirst(propName);

      if (!reducerActions[propName]) {
        throw new Error(`The action "${propName}" doesn't exists on state "${name}"`);
      }

      const _action = { reducer: thisArg.reducer, name: action, kind: actionKind, propName: propName };

      this.createDispatch(reducerActions, _action, this.dispatch, this.actions);
    }
  }
}
