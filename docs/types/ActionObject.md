# ActionObject

Properties:

| name    | type   | description                                                 | example             |
|---------|--------|-------------------------------------------------------------|---------------------|
| type    | string | Upper-snake case value determining the "type" of the action | `'SET_MY_PROPERTY'` |
| payload | any    | The value that will change the state                        | `'new value'`       |
| kind    | string | The kind of action                                          | `'set'`             |
| prop    | string | The property that will be changed by this action            | `'myProperty'`      |
| state   | string | Name of the state that contains the action                  | `'example'`         |
