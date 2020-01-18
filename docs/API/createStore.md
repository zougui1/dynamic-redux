# createStore

**type:** Function.
**return:** Redux's store.
**description:** create a redux store.

Parameters:

| name    | type           | required | default value                          | description                                 |
|---------|----------------|----------|----------------------------------------|---------------------------------------------|
| state   | CombineStates  | false    |                                        | states to to use for the store              |
| options | StoreOptions   | false    | `{ selectors: {}, middlewares: null }` | options for the store and its configuration |
