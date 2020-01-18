# StateCreator

**type:** Class

**description:** State that contains and handle the reducer, action creators and action types

Parameters:

| name         | type         | required | default value | description          |
|--------------|--------------|----------|---------------|----------------------|
| stateName    | string       | true     |               | name of the state    |
| initialState | object       | true     |               | default state        |
| options      | StateOptions | false    | `{}`          | options of the state |

Properties:

| name     | type     | description          |
|----------|----------|----------------------|
| name     | string   | name of the state    |

Methods:

## createActions

**return:** *this*

**description:** Create the actions for the state

**parameters:**

| name         | type                                      | required | description          |
|--------------|-------------------------------------------|----------|----------------------|
| actionList   | object.&lt;string, string \| string[]&gt; | true     | Object containing all the actions for the properties in the state |

## createMiddlewares

**return:** *this*

**description:** Create the middlewares for the actions

**parameters:**

| name         | type         | required | description                 |
|--------------|--------------|----------|-----------------------------|
| middlewares  | Middleware[] | true     | List of all the middlewares |

## createSelectors

**return:** *this*

**description:** Create the selectors for the state

**parameters:**

| name         | type                            | required | description                         |
|--------------|---------------------------------|----------|-------------------------------------|
| selectors    | object.&lt;string, function&gt; | true     | Object containing all the selectors for the state |

The selectors must be a function. The first parameter will be the current state and all other parameters will be parameters that have been passed to the called selector function that wrapped this function

```js
const exampleState = new StateCreator('example' {
  myString: 'value',
});

exampleState.createSelector({
  myStringSuffixedSelector: (state, suffix) => {
    return state.myString + ':' + suffix;
  },
});
```

```js
const mapStateToProps = mapState('example: myStringSuffixedSelector');

const MyComponent = ({ myStringSuffixedSelector }) => {
  const suffixedString = myStringSuffixedSelector('mySuffix'); // 'value:mySuffix'
  return null;
}

connect(mapStateToProps)(MyComponent);
```

## isInState

**return:** boolean

**description:** Check if `prop` is in the state

**parameters:**

| name    | type   | required | description   |
|---------|--------|----------|---------------|
| prop    | string | true     | prop to check |

## isSelector

**return:** boolean

**description:** Check if `prop` is a selector

**parameters:**

| name    | type   | required | description   |
|---------|--------|----------|---------------|
| prop    | string | true     | prop to check |

## hasAction

**return:** boolean

**description:** Check if the action with its kind exists

**parameters:**

| name       | type   | required | description        |
|------------|--------|----------|--------------------|
| prop       | string | true     | name of the action |
| actionKind | string | true     | kind of the action |

## getActionKinds

**return:** boolean

**description:** Get the kinds used for `action`

**parameters:**

| name       | type   | required | description        |
|------------|--------|----------|--------------------|
| action     | string | true     | name of the action |
