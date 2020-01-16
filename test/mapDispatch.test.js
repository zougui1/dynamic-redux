const { mapDispatch, DynamicState, createStore, CombineStates } = require('../dist');

const myNumber = 5;
const myString = 'super string';
const username = 'Zougui';
const password = 'super password';
const email = 'zougui@gmail.com';

const state = new DynamicState('state', {
  myNumber,
  myString,
});

state.createActions({
  myNumber: ['set', 'inc', 'dec'],
  myString: 'set',
});

const user = new DynamicState('user', {
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

describe('mapDispatch returns functions in the expected properties', () => {
  test('mapDispatch used with a string. Single state', () => {
    const returnedFunctions = mapDispatch('state: setMyNumber incMyNumber setMyString')(store.dispatch);

    expect(returnedFunctions).toHaveProperty('setMyNumber');
    expect(returnedFunctions).toHaveProperty('setMyString');
    expect(returnedFunctions).toHaveProperty('incMyNumber');
    expect(typeof returnedFunctions.setMyNumber).toBe('function');
    expect(typeof returnedFunctions.setMyString).toBe('function');
    expect(typeof returnedFunctions.incMyNumber).toBe('function');
  });

  test('mapDispatch used with an Object. Multiple states', () => {
    const returnedFunctions = mapDispatch({
      state: 'setMyNumber incMyNumber setMyString',
      user: ['setUsername setPassword', 'setEmail']
    })(store.dispatch);

    expect(returnedFunctions).toHaveProperty('setMyNumber');
    expect(returnedFunctions).toHaveProperty('setMyString');
    expect(returnedFunctions).toHaveProperty('incMyNumber');
    expect(returnedFunctions).toHaveProperty('setUsername');
    expect(returnedFunctions).toHaveProperty('setPassword');
    expect(returnedFunctions).toHaveProperty('setEmail');
    expect(typeof returnedFunctions.setMyNumber).toBe('function');
    expect(typeof returnedFunctions.setMyString).toBe('function');
    expect(typeof returnedFunctions.incMyNumber).toBe('function');
    expect(typeof returnedFunctions.setUsername).toBe('function');
    expect(typeof returnedFunctions.setPassword).toBe('function');
    expect(typeof returnedFunctions.setEmail).toBe('function');
  });
});

describe('mapDispatch throws an error when you try to get non-existing data', () => {
  test('mapDispatch tries to get actions from a non-existing state', () => {
    const nonExistingState = () => mapDispatch('nonExistingState: setMyNumber')(store.dispatch);

    expect(nonExistingState).toThrowError('nonExistingState');
  });

  test('mapDispatch tries to get a non-existing action', () => {
    const nonExistingAction = () => mapDispatch('state: nonExistingAction')(store.dispatch);

    expect(nonExistingAction).toThrowError('nonExistingAction');
  });
});

describe('mapDispatch throws an error when you give it invalid types !(String | Object.<String | String[]>)', () => {
  test('does not use mapDispatch with a String nor an Object', () => {
    const invalidType = () => mapDispatch(['state', 'setMyNumber'])(store.getState());

    expect(invalidType).toThrowError('The props must be either a string or an object');
  });

  test('does not use mapDispatch with a String nor an Array within an object', () => {
    const invalidType = () => {
      mapDispatch({
        state: { setMyProperty: true },
        user: false,
      })(store.getState());
    }

    expect(invalidType).toThrowError('The props in an object must be either an array or a string');
  });

  test('does not use mapDispatch with a String in an Array within an object', () => {
    const invalidType = () => {
      mapDispatch({
        state: [5],
      })(store.getState());
    }

    expect(invalidType).toThrowError('The props in the arrays within an object must be a string');
  });
});
