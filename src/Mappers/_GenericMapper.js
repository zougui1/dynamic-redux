import _ from 'lodash';

import { removeSpaces } from '../utils';

export class GenericMapper {

  /**
   * @property {string | Object} dirtyProps
   * @private
   */
  dirtyProps;

  /**
   * @property {string[]} props
   * @private
   */
  props = '';

  /**
   * @property {Object} reducer
   * @private
   */
  reducer = {};

  /**
   * @property {Function} publicMapper
   * @private
   */
  publicMapper;

  /**
   *
   * @param {string} props
   * @param {Function} publicMapper
   * @param {Function} each
   * @public
   */
  constructor(props, publicMapper, each) {

    if (!props) {
      throw new Error('The props must be specified');
    }

    this.dirtyProps = props;
    this.publicMapper = publicMapper;
    this.each = each;

    if (_.isString(props)) {
      this.mapString();
    } else if (_.isObject(props)) {
      this.mapObject();
    } else {
      throw new Error(`The props must be either a string or an object. Got "${props}"`);
    }
  }

  /**
   * map the string `this.props`
   */
  mapString = () => {
    this.cleanProps();

    // it's up to the user to handle the datas
    this.props.forEach(this.each(this));
  }

  /**
   * if map through `this.dirtyProps` when it's an object
   */
  mapObject = () => {
    _.forIn(this.dirtyProps, (props, reducerName) => {
      let propList = reducerName + ': ';

      if (Array.isArray(props)) {
        propList += props.join(' ');
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
  setReducer = name => {
    this.reducer = {
      name: name,
      suffixed: name + 'Reducer'
    };
  }

  /**
   * transform the `dirtyProps` into usable data
   * @param {string} dirtyProps
   * @private
   */
  cleanProps = (dirtyProps = this.dirtyProps) => {
    const [reducer, props] = removeSpaces(dirtyProps.split(':'));

    this.props = removeSpaces(props.split(/\s/g));
    this.setReducer(reducer);
  }
}
