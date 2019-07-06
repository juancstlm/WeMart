import { filter } from "ic-snacks/dist/esm/components/SVGIcon/icons";

export const getCartState = store => store.cart;

export const getItemsInCart = store =>
  store && store.cart ? store.cart.items : [];

export const getItemInCartById = (store, id) =>
  getCartState(store) ? { ...getCartState(store), id } : {};

export const getQuantityInCartById = (store, id) =>
  getCartState(store).quantityById[Number(id)] ? getCartState(store).quantityById[Number(id)] : 0;
