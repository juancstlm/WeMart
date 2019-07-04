import {ADD_TO_CART, REMOVE_FROM_CART} from "../actionTypes";

const initialState = {
  items: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    case REMOVE_FROM_CART:
      return {
        items: state.items.filter(item => item.itemid !== action.payload.itemid)
      };
    default:
      return state;
  }
};
