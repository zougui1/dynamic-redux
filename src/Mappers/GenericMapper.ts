import * as _ from 'lodash';

import { removeSpaces, forIn } from '../utils';
import { ObjectLiteral, MappersDataType } from '../common';

export class GenericMapper {

  /**
   * @type {String | Object<String, String | String[]>}
   * @private
   */
  private dirtyProps: MappersDataType;

  /**
   * @type {string[]}
   * @private
   */
  private props: string[] = [];

  /**
   * @type {Object}
   * @private
   */
  private reducer: ObjectLiteral = {};

  /**
   * @type {Function}
   * @protected
   */
  protected each: (thisArg: this) => (item: string, i: number) => any;

  /**
   *
   * @param {string} props
   * @param {Function} each
   * @public
   */
  constructor(props: MappersDataType, each: (thisArg: GenericMapper) => (item: string, i: number) => any) {

    if (!props) {
      throw new Error('The props must be specified');
    }

    this.dirtyProps = props;
    this.each = each;

    if (typeof props === 'string') {
      this.mapString();
    } else if (props && typeof props === 'object' && !Array.isArray(props)) {
      this.mapObject();
    } else {
      throw new Error(`The props must be either a string or an object. Got "${props}"`);
    }
  }

  /**
   * map the string `this.props`
   * @param {MappersDataType} [dirtyProps=this.dirtyProps]
   * @private
   */
  private mapString = (dirtyProps: MappersDataType = this.dirtyProps): void => {
    this.cleanProps(dirtyProps);

    // it's up to the user to handle the datas
    this.props.forEach(this.each(this));
  }

  /**
   * if map through `this.dirtyProps` when it's an object
   * @private
   */
  private mapObject = (): void => {
    forIn(this.dirtyProps, (props, reducerName) => {
      let propList = reducerName + ': ';

      if (Array.isArray(props)) {
        props.forEach(prop => {
          if (!_.isString(prop)) {
            throw new Error(`The props in the arrays within an object must be a string. Got "${prop}"`);
          }

          propList += prop + ' ';
        });
      } else if (_.isString(props)) {
        propList += props;
      } else {
        throw new Error(`The props in an object must be either an array or a string. Got "${props}"`);
      }

      this.mapString(propList);
    });
  }

  /**
   * set `this.reducer` with its name and its suffixed name given `name`
   * @param {string} name
   * @private
   */
  private setReducer = (name: string): void => {
    this.reducer = {
      name,
      suffixed: name + 'Reducer',
    };
  }

  /**
   * transform the `dirtyProps` into usable data
   * @param {string} [dirtyProps=this.dirtyProps]
   * @private
   */
  private cleanProps = (dirtyProps: MappersDataType = this.dirtyProps): void => {
    if (typeof dirtyProps === 'string') {
      const [reducer, props] = removeSpaces(dirtyProps.split(':'));

      this.props = removeSpaces(props.split(/\s/g));
      this.setReducer(reducer);
    }
  }
}
