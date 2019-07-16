import React from "react";
import Counter from "./Counter";
import {connect} from "react-redux";
import {getQuantityInCartById} from "../redux/selectors";

const CartItem = ({
  item,
  inCart,
  handleIncrease,
  handleDecrease,
  handleRemove
}) => {
  function SalePrice(props) {
    return <div>${(props.price * props.quantity).toFixed(2)}</div>;
  }

  function RegularPrice(props) {
    return <div>${(props.price * props.quantity).toFixed(2)}</div>;
  }

  function Price(props) {
    var isOnSale = props.isOnSale;
    if (isOnSale) {
      return <SalePrice price={props.salePrice} quantity={props.quantity} />;
    }
    return (
      <RegularPrice price={props.regularPrice} quantity={props.quantity} />
    );
  }

  return (
    <li className="list-group-item">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-2" style={{ padding: "4px", width: "70px" }}>
            <img alt={item.name} className="img-responsive" src={item.image} />
          </div>
          <div className="col-xs-8">
            <span>{item.name}</span>
            <br />
            <span style={{ color: "gray" }}>{item.quantity}</span>
          </div>
          <div className="col-xs-2" style={{ textAlign: "right" }}>
            <Price
              isOnSale={item.sale !== "0"}
              salePrice={item.sale}
              regularPrice={item.price}
              quantity={inCart}
            />
          </div>
          <div
            style={{
              marginRight: "15px",
              width: "40%",
              height: "30px",
              float: "right",
              marginBottom: "2%"
            }}
          >
            <Counter
              quantity={inCart}
              onIncrease={() => handleIncrease(item)}
              onDecrease={() => handleDecrease(item)}
              onRemove={() => handleRemove(item)}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default connect((state, ownProps) => ({
  inCart: getQuantityInCartById(state, ownProps.item.itemid)
}))(CartItem);
