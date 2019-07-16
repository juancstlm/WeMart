import {ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART, UPDATE_QUANTITY} from "../actionTypes";

const initialState = {
  items: [],
  quantityById: {}
};

export default (state = initialState, action) => {
  let { itemid, item } = action;
  switch (action.type) {
    case ADD_TO_CART:
      return {
        items: [...state.items, item],
        quantityById: { ...state.quantityById, [itemid]: 1 }
      };
    case REMOVE_FROM_CART:
      return {
        items: state.items.filter(item => item.itemid !== itemid),
        quantityById: { ...state.quantityById, [itemid]: undefined }
      };
    case UPDATE_QUANTITY:
      return {
        ...state,
        quantityById: { ...state.quantityById, [itemid]: state.quantityById[itemid] + action.quantity }
      };
    case CLEAR_CART:
      return initialState;
    default:
      return state;
  }
};
