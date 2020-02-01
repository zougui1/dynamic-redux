// @ts-nocheck
import { CombineStates } from '../CombineStates';
import { createStore } from '../createStore';
import { StateCreator } from '../StateCreator';
import { mapDispatch } from './mapDispatch';

const myNumber = 5;
const myString = 'super string';
const username = 'Zougui';
const password = 'super password';
const email = 'zougui@gmail.com';

const state = new StateCreator('state', {
  myNumber,
  myString,
});

state.createActions({
  myNumber: ['set', 'inc', 'dec'],
  myString: 'set',
});

const user = new StateCreator('user', {
  username,
  password,
  email,
});

user.createActions({
  username: 'set',
  password: 'set',
  email: 'set',
});

const combinedStates = new CombineStates([
  state,
  user,
]);

const store = createStore(combinedStates);

describe('mapDispatch()', () => {
  it('should return an object with the correct actions when used with a string (Single state)', () => {
    const returnedFunctions = mapDispatch('state: setMyNumber incMyNumber setMyString')(store.dispatch);

    expect(typeof returnedFunctions).toBe('object');
    expect(!!returnedFunctions).toBe(true);
    expect(typeof returnedFunctions.setMyNumber).toBe('function');
    expect(typeof returnedFunctions.setMyString).toBe('function');
    expect(typeof returnedFunctions.incMyNumber).toBe('function');
  });

  it('should return an object with the correct actions when used with an object (Multiple states)', () => {
    const returnedFunctions = mapDispatch({
      state: 'setMyNumber incMyNumber setMyString',
      user: ['setUsername setPassword', 'setEmail'],
    })(store.dispatch);

    expect(typeof returnedFunctions).toBe('object');
    expect(!!returnedFunctions).toBe(true);
    expect(typeof returnedFunctions.setMyNumber).toBe('function');
    expect(typeof returnedFunctions.setMyString).toBe('function');
    expect(typeof returnedFunctions.incMyNumber).toBe('function');
    expect(typeof returnedFunctions.setUsername).toBe('function');
    expect(typeof returnedFunctions.setPassword).toBe('function');
    expect(typeof returnedFunctions.setEmail).toBe('function');
  });

  it('should throw an error when trying to get actions from a non-existing state', () => {
    const nonExistingState = () => mapDispatch('nonExistingState: setMyNumber')(store.dispatch);

    expect(nonExistingState).toThrowError('nonExistingState');
  });

  it('should throw an error when trying to get a non-existing action', () => {
    const nonExistingAction = () => mapDispatch('state: nonExistingAction')(store.dispatch);

    expect(nonExistingAction).toThrowError('nonExistingAction');
  });

  it('should throw an error when not used with a String or an Object', () => {
    // @ts-ignore
    const invalidType = () => mapDispatch(['state', 'setMyNumber'])(store.getState());

    expect(invalidType).toThrowError('The props must be either a string or an object');
  });

  it('should throw an error when not used with a String or an Array within an object', () => {
    const invalidType = () => {
      mapDispatch({
        // @ts-ignore
        state: { setMyProperty: true },
        // @ts-ignore
        user: false,
      })(store.getState());
    };

    expect(invalidType).toThrowError('The props in an object must be either an array or a string');
  });

  it('should throw an error when not used with a String in an Array within an object', () => {
    const invalidType = () => {
      mapDispatch({
        // @ts-ignore
        state: [5],
      })(store.getState());
    };

    expect(invalidType).toThrowError('The props in the arrays within an object must be a string');
  });
});
