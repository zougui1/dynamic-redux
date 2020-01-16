import { State, Set, GeneralActions } from 'dynamic-redux';

// use this decorator to define your class as a state
// note that by default it will use the name of your class
// as name of state (namespace used in the reducers structure when recovering its properties and actions)
// you can pass it an explicit name in the first parameter
// or pass an object options (the exact same as with `StateCreator`) either in the first or second parameter
@State()
export class ExampleState {

  @Set() // add the kind of action "set" to the property `myProperty`
  @GeneralActions() // add the "general" kinds of action (e.g. set, reset, trigger)
  myProperty: string = 'default value';

}
