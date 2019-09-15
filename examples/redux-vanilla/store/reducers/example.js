import { SET_MY_PROPERTY } from '../action-types/example';

const initialState = {
  myProperty: 'default value'
};

const exampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_PROPERTY:
      return {
        ...state,
        myProperty: action.payload
      };

    default:
      return { ...state };
  }
}

export default exampleReducer;
