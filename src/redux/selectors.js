export const getItemsInCart = store =>
  store && store.cart ? store.cart.items : [];
