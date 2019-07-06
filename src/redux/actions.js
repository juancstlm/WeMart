import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from "./actionTypes";

export const addToCart = (item, quantity) => ({
  type: ADD_TO_CART,
  itemid: item.itemid
});

export const removeFromCart = item => ({
  type: REMOVE_FROM_CART,
  itemid: item.itemid
});

export const updateQuantity = (item, quantity) => ({
  type: UPDATE_QUANTITY,
  itemid: item.itemid,
  quantity: quantity
})
