import { filter } from "ic-snacks/dist/esm/components/SVGIcon/icons";

export const getCartState = store => store.cart;

// Returns an array of all the item objects in the cart
export const getItemsInCart = store =>
  store && store.cart.items ? store.cart.items : [];

//Returns the item object given an item id if it exist in the store
export const getItemInCartById = (store, id) =>
  getCartState(store) ? { ...getCartState(store), id } : {};

// Gets the quantity of that itemid in the current store
export const getQuantityInCartById = (store, id) =>
  getCartState(store).quantityById[Number(id)]
    ? getCartState(store).quantityById[Number(id)]
    : 0;

export const getCartTotal = store =>
  getItemsInCart(store)
    ? getItemsInCart(store).reduce(
        (total, item) =>
          item.sale !== 0
            ? total + item.sale * getQuantityInCartById(store, item.itemid)
            : total + item.price * getQuantityInCartById(store, item.itemid),
        0
      )
    : 0;
