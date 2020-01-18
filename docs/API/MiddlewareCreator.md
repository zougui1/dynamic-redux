# createStore

**type:** Class
**description:** create a middleware consumable by the states

Parameters:

| name    | type    | required | description                         |
|---------|---------|----------|-------------------------------------|
| action  | string  | true     | action for the middleware to target |
| options | string  | true     | kind of the action to target        |

Methods:

## Handle

**return:** *this*
**description:** will define `handler` as the handler of the middleware

Parameters:

| name    | type     | required | description                |
|---------|----------|----------|----------------------------|
| handler | function | true     | handler for the middleware |
