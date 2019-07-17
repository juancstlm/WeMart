export const getCartState = store => store.cart;
export const getUserState = store => store.user;

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

// Gets the total price of the cart with savings
export const getCartTotalWithSavings = store =>
  getItemsInCart(store)
    ? getItemsInCart(store).reduce(
        (total, item) =>
          item.sale !== 0
            ? total + item.sale * getQuantityInCartById(store, item.itemid)
            : total + item.price * getQuantityInCartById(store, item.itemid),
        0
      )
    : 0;

// Gets the full price of all the items in cart, ignoring sale prices or discounts
export const getCartTotal = store =>
  getItemsInCart(store)
    ? getItemsInCart(store).reduce(
        (total, item) =>
          total + item.price * getQuantityInCartById(store, item.itemid), 0
      )
    : 0;

// Gets the zip code entered by the current user
export const getZipCode = store =>
  getUserState(store) && getUserState(store).zipCode
    ? getUserState(store).zipCode
    : null;
