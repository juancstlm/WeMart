import React from "react";
import CartListItem from "./cart_list_item";
import itemsEmpty from "../../images/items_empty.png";

const CartList = ({ items, handleRemove, handleIncrease, handleDecrease }) => {
  const renderItems = () => items.map(item => {
    return (
      <CartListItem
        handleRemove={handleRemove}
        handleIncrease={handleIncrease}
        handleDecrease={handleDecrease}
        key={item.itemID}
        item={item}
      />
    );
  });

  if (items.length === 0) {
    return (
      <div>
        <div style={{ textAlign: "center", marginTop: "25%" }}>
          <img alt='no items' src={itemsEmpty} style={{}} />
          <h1>No Items</h1>
        </div>
      </div>
    );
  } else {
    return (
      <ul className="list-group" style={{ lineHeight: "20px" }}>
        {renderItems()}
      </ul>
    );
  }
};

export default CartList;
