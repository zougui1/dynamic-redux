import * as _ from 'lodash';
import { Dispatch } from 'redux';

import { GenericMapper } from './GenericMapper';
import { ObjectLiteral, MappersDataType, GlobalScope } from '../common';
import { Actions } from '../StateCreator/types';

const reActions = /^(push|pop|shift|unshift|concat|set|merge|filter|map|inc|dec|reset|trigger|query)/;

export class DispatchMapper {

  /**
   * @type {GenericMapper} mapper
   * @private
   */
  private mapper: GenericMapper;

  /**
   * @type {Function} dispatch
   * @private
   */
  private dispatch: Dispatch;

  /**
   * @type {Object} actions
   * @private
   */
  private actions: ObjectLiteral = {};

  /**
   * return the result (`this.actions`) of the mapper
   * @returns {Object}
   * @public
   */
  get result(): ObjectLiteral {
    return this.actions;
  }

  /**
   *
   * @param {String} props
   * @param {Function} dispatch
   * @public
   */
  constructor(props: MappersDataType, dispatch: Dispatch) {
    this.dispatch = dispatch;
    this.mapper = new GenericMapper(props, this.each);
  }

  /**
   *
   * @param {Object} reducerActions
   * @param {Object} action
   * @param {String} action.reducer
   * @param {String} action.propName
   * @param {String} action.name
   * @param {String} action.kind
   * @param {Function} dispatch
   * @param {Object} tempActions
   * @private
   */
  private createDispatch(reducerActions: Actions<ObjectLiteral>, action: ObjectLiteral, dispatch: Dispatch, tempActions: ObjectLiteral) {
    const actions = reducerActions[action.propName];

    _.forIn(actions, (actionCreator, name) => {
      if (name === action.kind) {
        tempActions[action.name] = (...args) => {
          // TODO create an object to recognize if there was more than 1 arg here
          const value = args.length < 2
            ? args[0]
            : args;

          (actionCreator as any)(args[0], dispatch);
        };
      }
    });
  }

  /**
   * called by `this.mapper` when mapping a string
   * @param {Object} thisArg `this.mapper`'s context
   * @private
   */
  private each = (thisArg) => {
    const { name, suffixed } = thisArg.reducer;

    const { states } = GlobalScope.get();

    if (!states[suffixed]) {
      throw new Error(`The reducer "${name}" doesn't exists`);
    }

    const reducerActions = states[suffixed].actions;
    const capitalizedName = _.upperFirst(name);

    return action => {
      if (action === 'resetState') {
        // @ts-ignore
        this.actions['reset' + capitalizedName + 'State'] = () => reducerActions.__STATE__.reset(null, this.dispatch);
        return;
      }

      let [actionKind, propName] = action.replace(reActions, '$1_').split('_'); // tslint:disable-line: prefer-const

      if (!propName) {
        throw new Error(`The action must be prefixed by its kind. Got "${action}"`);
      }

      propName = _.lowerFirst(propName);

      if (!reducerActions[propName]) {
        throw new Error(`The action "${propName}" doesn't exists on state "${name}"`);
      }

      const actionObject = { reducer: thisArg.reducer, name: action, kind: actionKind, propName };

      this.createDispatch(reducerActions, actionObject, this.dispatch, this.actions);
    };
  }
}
