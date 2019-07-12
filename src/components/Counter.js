import React from "react";
import PropTypes from "prop-types";
import { Button, Icon } from "ic-snacks";

let spanStyle = {
  width: "24%",
  fontSize: "1.4em",
  alignItems: "center",
  justifyContent: "center",
  display: "inline-flex"
};

const Counter = ({onDecrease, quantity, onRemove, onIncrease}) => {
  return (
    <div style={{ height: "100%" }}>
      <button
        style={{ height: "100%", width: "24%", padding: "0" }}
        className="primary"
        onClick={onDecrease}
        disabled={quantity === 1}
      >
        <i className="fa fa-minus" />
      </button>
      <span style={spanStyle}>{quantity}</span>
      <button
        style={{
          height: "100%",
          width: "24%",
          marginRight: "4%",
          padding: "0"
        }}
        className="primary"
        onClick={onIncrease}
      >
        <i className="fa fa-plus" />
      </button>
      <button
        style={{ height: "100%", width: "24%", padding: "0" }}
        className="primary"
        onClick={onRemove}
      >
        <i className="fa fa-trash" />
      </button>
    </div>
  );
};

Counter.propTypes = {
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
  onRemove: PropTypes.func
};

export default Counter;
