import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from "../actionTypes";

const initialState = {
  items: [],
  quantityById: {}
};

export default (state = initialState, action) => {
  let { itemid } = action;
  switch (action.type) {
    case ADD_TO_CART:
      return {
        items: [itemid, ...state.items],
        quantityById: { ...state.quantityById, [itemid]: 1 }
      };
    case REMOVE_FROM_CART:
      return {
        items: state.items.filter(item => item !== itemid),
        quantityById: { ...state.quantityById, [itemid]: undefined }
      };
    case UPDATE_QUANTITY:
      return {
        ...state,
        quantityById: { ...state.quantityById, [itemid]: state.quantityById[itemid] + action.quantity }
      };
    default:
      return state;
  }
};
