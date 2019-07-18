import React from "react";
import PropTypes from "prop-types";
import "./checkoutbutton.css";

const CheckOutButton = ({ total, savingsTotal, onClick }) => {
  const formattedTotal = total.toFixed(2);
  const formattedSavingsTotal = savingsTotal.toFixed(2);

  return (
    <div className={"wmrt-CheckoutButton"}>
      <div className={"wmrt-CheckoutButton-button"}>
        <a onClick={onClick}>
          <div className={"wmrt-CheckoutButton-text"}>Checkout</div>
          <div className={"wmrt-CheckoutButton-totalContainer"}>
            <div className={"wmrt-CheckoutButton-total"}>
              <span
                className={"wmrt-CheckoutButton-total-fullPrice"}
              >{`$${formattedTotal}`}</span>
              <span
                className={"wmrt-CheckoutButton-total-savingsPrice"}
              >{`$${formattedSavingsTotal}`}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default CheckOutButton;

CheckOutButton.propTypes = {
  /* The order total */
  total: PropTypes.number,
  /* The order total with all savings applied */
  savingsTotal: PropTypes.number,
  /* Function to execute when button is pressed */
  onClick: PropTypes.func
};
