const { mapState, DynamicState, createStore, CombineStates } = require('../dist');

const myNumber = 5;
const myString = 'super string';
const username = 'Zougui';
const password = 'super password';
const email = 'zougui@gmail.com';

const state = new DynamicState('state', {
  myNumber,
  myString,
});

const user = new DynamicState('user', {
  username,
  password,
  email,
});

const combinedStates = new CombineStates([
  state,
  user,
]);

const store = createStore(combinedStates);

const sum = (x, y) => x + y;

test('sum will sum 2 numbers', () => {
  const z = sum(2, 5);

  expect(z).toBe(8);
});

describe('mapState returns the expected values in their expected properties', () => {
  test('mapState used with a string. Single state', () => {
    const returnedValues = mapState('state: myNumber myString')(store.getState());

    expect(returnedValues).toHaveProperty('myNumber', myNumber);
    expect(returnedValues).toHaveProperty('myString', myString);
  });

  test('mapState used with an object. Multiple states', () => {
    const returnedValues = mapState({
      state: 'myNumber myString',
      user: ['username password', 'email'],
    })(store.getState());

    expect(returnedValues).toHaveProperty('myNumber', myNumber);
    expect(returnedValues).toHaveProperty('myString', myString);
    expect(returnedValues).toHaveProperty('username', username);
    expect(returnedValues).toHaveProperty('password', password);
    expect(returnedValues).toHaveProperty('email', email);
  });
});

describe('mapState throws an error when you try to get non-existing data', () => {
  test('mapState tries to get data from a non-existing state', () => {
    const nonExistingState = () => mapState('nonExistingState: myNumber')(store.getState());

    expect(nonExistingState).toThrowError('nonExistingState');
  });

  test('mapState tries to get a non-existing property', () => {
    const nonExistingProperty = () => mapState('state: nonExistingProperty')(store.getState());

    expect(nonExistingProperty).toThrowError('nonExistingProperty');
  })
});

describe('mapState throws an error when you give it invalid types !(String | Object.<String | String[]>)', () => {
  test('does not use mapState with a String nor an Object', () => {
    const invalidType = () => mapState(['state', 'myNumber'])(store.getState());

    expect(invalidType).toThrowError('The props must be either a string or an object');
  });

  test('does not use mapState with a String nor an Array within an object', () => {
    const invalidType = () => {
      mapState({
        state: { myProperty: true },
        user: false,
      })(store.getState());
    }

    expect(invalidType).toThrowError('The props in an object must be either an array or a string');
  });

  test('does not use mapState with a String in an Array within an object', () => {
    const invalidType = () => {
      mapState({
        state: [5],
      })(store.getState());
    }

    expect(invalidType).toThrowError('The props in the arrays within an object must be a string');
  });
});
