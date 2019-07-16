import {ADD_TO_CART, CLEAR_CART, REMOVE_FROM_CART, SET_ZIP_CODE, UPDATE_QUANTITY} from "./actionTypes";

export const addToCart = (item, quantity) => ({
  type: ADD_TO_CART,
  item: item,
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
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const setZipCode = zipCode => ({
  type: SET_ZIP_CODE,
  zipCode: zipCode,
})
