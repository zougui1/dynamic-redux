// @ts-nocheck
import { CombineStates } from '../CombineStates';
import {createStore } from '../createStore';
import { StateCreator } from '../StateCreator';
import { mapState } from './mapState';

const myNumber = 5;
const myString = 'super string';
const username = 'Zougui';
const password = 'super password';
const email = 'zougui@gmail.com';

const state = new StateCreator('state', {
  myNumber,
  myString,
});

const user = new StateCreator('user', {
  username,
  password,
  email,
});

const combinedStates = new CombineStates([
  state,
  user,
]);

const store = createStore(combinedStates);

describe('mapState()', () => {
  it('should return an object with the correct properties when used with a string (Single state)', () => {
    const returnedValues = mapState('state: myNumber myString')(store.getState());

    expect(typeof returnedValues).toBe('object');
    expect(!!returnedValues).toBe(true);
    expect(returnedValues).toHaveProperty('myNumber', myNumber);
    expect(returnedValues).toHaveProperty('myString', myString);
  });

  it('should return an object with the correct properties when used with an object (Multiple states)', () => {
    const returnedValues = mapState({
      state: 'myNumber myString',
      user: ['username password', 'email'],
    })(store.getState());

    expect(typeof returnedValues).toBe('object');
    expect(!!returnedValues).toBe(true);
    expect(returnedValues).toHaveProperty('myNumber', myNumber);
    expect(returnedValues).toHaveProperty('myString', myString);
    expect(returnedValues).toHaveProperty('username', username);
    expect(returnedValues).toHaveProperty('password', password);
    expect(returnedValues).toHaveProperty('email', email);
  });

  it('should throw an error when trying to get properties from a non-existing state', () => {
    const nonExistingState = () => mapState('nonExistingState: myNumber')(store.getState());

    expect(nonExistingState).toThrowError('nonExistingState');
  });

  it('should throw an error when trying to get a non-existing property', () => {
    const nonExistingProperty = () => mapState('state: nonExistingProperty')(store.getState());

    expect(nonExistingProperty).toThrowError('nonExistingProperty');
  });

  it('should throw an error when not used with a String or an Object', () => {
    // @ts-ignore
    const invalidType = () => mapState(['state', 'myNumber'])(store.getState());

    expect(invalidType).toThrowError('The props must be either a string or an object');
  });

  it('should throw an error when not used with a String or an Array within an object', () => {
    const invalidType = () => {
      mapState({
        // @ts-ignore
        state: { myProperty: true },
        // @ts-ignore
        user: false,
      })(store.getState());
    };

    expect(invalidType).toThrowError('The props in an object must be either an array or a string');
  });

  it('should throw an error when not used with a String in an Array within an object', () => {
    const invalidType = () => {
      mapState({
        // @ts-ignore
        state: [5],
      })(store.getState());
    };

    expect(invalidType).toThrowError('The props in the arrays within an object must be a string');
  });
});
