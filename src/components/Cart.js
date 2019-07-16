import React, {useState} from "react";
import CartList from "./cart_list";
import "./header.css";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {removeFromCart, updateQuantity} from "../redux/actions";
import {getCartTotal, getItemsInCart} from "../redux/selectors";
import PropTypes from "prop-types";

const Cart = ({
  onCloseClick,
  history,
  cartItems,
  totalPrice,
  removeFromCart,
  updateQuantity
}) => {
  const [width, setWidth] = useState(800);

  const componentWillMount = () => {
    window.addEventListener("resize", this.handleWindowSizeChange);
  };

  // make sure to remove the listener
  // when the component is not mounted anymore
  const componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  };

  const handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

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

  const title = {
    height: "10%",
    padding: "20px 30px",
    margin: "0"
  };

  const shoppingCart = {
    position: "fixed",
    top: "0",
    right: "0",
    zIndex: "11",
    width: "35vw",
    height: "100vh",
    background: "#f7f7f7",
    boxShadow: "1px 2px 3px 0px rgba(0,0,0,0.10)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #a9a9a9",
    maxHeight: "100vh"
  };

  const shoppingCartMobile = {
    position: "fixed",
    top: "0",
    right: "0",
    zIndex: "11",
    width: "100vw",
    height: "100%",
    background: "#f7f7f7",
    boxShadow: "1px 2px 3px 0px rgba(0,0,0,0.10)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #a9a9a9",
    maxHeight: "100vh"
  };

  const checkoutBtn = {
    width: "98%",
    height: "82%",
    padding: "0"
  };

  const isMobile = width <= 700;
  if (isMobile) {
    return (
      <div style={shoppingCartMobile}>
        <div className="jumbotron" style={title}>
          <span className="lead">Shopping Cart</span>
          <button
            className="primary"
            style={{ float: "right", height: "30px", fontSize: "14px" }}
          >
            Close
          </button>
        </div>
        <div style={{ height: "80%", overflowY: "scroll" }}>
          <CartList
            items={cartItems}
            handleRemove={itemID => handleRemove(itemID)}
            handleIncrease={itemID => handleIncrease(itemID)}
            handleDecrease={itemID => handleDecrease(itemID)}
          />
        </div>
        <div
          style={{
            height: "70px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <button
            style={checkoutBtn}
            className="primary"
            onClick={handleCheckoutClick}
          >
            Checkout
          </button>
        </div>
        <div
          style={{
            float: "right",
            margin: "-55px 25px 0 auto",
            padding: "4px 7px",
            borderRadius: "4px",
            background: "white",
            color: "#D30707"
          }}
        >
          {"$" + totalPrice.toFixed(2)}
        </div>
      </div>
    );
  } else {
    return (
      <div style={shoppingCart}>
        <div className="jumbotron" style={title}>
          <span className="lead">Shopping Cart</span>
          <button
            className="primary"
            style={{ float: "right", height: "30px", fontSize: "14px" }}
            onClick={() => onCloseClick(false)}
          >
            Close
          </button>
        </div>
        <div style={{ height: "80%", overflowY: "scroll" }}>
          <CartList
            items={cartItems}
            handleRemove={item => handleRemove(item)}
            handleIncrease={item => handleIncrease(item)}
            handleDecrease={item => {handleDecrease(item)}}
          />
        </div>
        <div
          style={{ height: "10%", display: "flex", justifyContent: "center" }}
        >
          <button
            style={checkoutBtn}
            className="primary"
            onClick={handleCheckoutClick}
          >
            Checkout
          </button>
        </div>
        <div
          style={{
            float: "right",
            margin: "-57px 25px 0 auto",
            padding: "4px 7px",
            borderRadius: "4px",
            background: "white",
            color: "#D30707"
          }}
        >
          {"$" + totalPrice.toFixed(2)}
        </div>
      </div>
    );
  }
};
export default connect(
  state => ({
    cartItems: getItemsInCart(state),
    totalPrice: getCartTotal(state)
  }),
  { updateQuantity, removeFromCart }
)(withRouter(Cart));

Cart.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  initialLoad: PropTypes.number
};
