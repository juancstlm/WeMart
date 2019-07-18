import React, { useState } from "react";
import CartList from "./cart_list";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/actions";
import {
  getCartTotal,
  getItemsInCart,
  getCartTotalWithSavings
} from "../../redux/selectors";
import PropTypes from "prop-types";
import "./cart.css";
import { Button } from "ic-snacks";
import CheckOutButton from "../CheckoutButton/CheckoutButton";

const Cart = ({
  onCloseClick,
  history,
  cartItems,
  totalPrice,
  removeFromCart,
  updateQuantity,
  savingsTotal
}) => {
  // Remove the item from the cart
  const handleRemove = item => {
    removeFromCart(item);
  };

  //Increases item quantity in cart
  const handleIncrease = item => {
    console.log("handle Increase", item);
    updateQuantity(item, 1);
  };

  // Decreases the quantity of this item by 1 in the cart.
  const handleDecrease = item => {
    console.log("handle Increase", item);
    updateQuantity(item, -1);
  };

  const handleCheckoutClick = () => {
    history.push("/checkout");
  };

  return (
    <div className={"wmrt-Cart"}>
      <div className="jumbotron wmrt-Cart-title">
        <span className="wmrt-Cart-name">Shopping Cart</span>
        <Button snacksStyle={"primary"} onClick={() => onCloseClick(false)}>
          Close
        </Button>
      </div>
      <div className={"wmrt-Cart-content"}>
        <CartList
          items={cartItems}
          handleRemove={item => handleRemove(item)}
          handleIncrease={item => handleIncrease(item)}
          handleDecrease={item => {
            handleDecrease(item);
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckOutButton
          onClick={handleCheckoutClick}
          total={totalPrice}
          savingsTotal={savingsTotal}
        />
      </div>
    </div>
  );
};
export default connect(
  state => ({
    cartItems: getItemsInCart(state),
    totalPrice: getCartTotal(state),
    savingsTotal: getCartTotalWithSavings(state)
  }),
  { updateQuantity, removeFromCart }
)(withRouter(Cart));

Cart.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  initialLoad: PropTypes.number
};
