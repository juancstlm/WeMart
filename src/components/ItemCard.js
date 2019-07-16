import React from "react";
import PropTypes from "prop-types";
import {Button, LoadingBox} from "ic-snacks";
import {StyleRoot} from "radium";
import Counter from "./Counter";
import onSaleBadge from "../images/onSaleBadge.png";
import {withRouter} from "react-router-dom";
import {addToCart, removeFromCart, updateQuantity} from "../redux/actions";
import {connect} from "react-redux";
import {getQuantityInCartById} from "../redux/selectors";

//STYLES
//Add To cart button Style
const addToCartButton = {
  display: "inherit",
  margin: "0 0 auto",
  width: "100%"
};

//Item Card Styles
const itemCard = { background: "#ffffff", width: "100%", marginBottom: "25px" };
const itemCard_cardContents = {
  cursor: "pointer",
  margin: "0 5% 1rem 5%",
  width: "90%",
  display: "block"
};
const itemCard_badge = {
  position: "absolute",
  height: "2rem",
  width: "10rem",
  backgroundRepeat: "no-repeat"
};
const itemCard_badge_onSale = {
  ...itemCard_badge,
  backgroundImage: `url(${onSaleBadge})`,
  backgroundSize: "auto 2rem"
};
const itemCard_media = { margin: "0 auto" };
const itemCard_media_image = {
  margin: "0 auto 01rem auto",
  display: "block",
  maxWidth: "100%",
  paddingTop: "1rem"
};
const itemCard_itemInfo = { padding: ".5rem 0 0", fontSize: "1.3rem" };
const itemCard_itemInfo_weight = {
  color: "#808080",
  fontSize: "1.1rem",
  margin: "0"
};
const itemCard_fullItemName = {
  marginTop: "0",
  paddingBottom: "0",
  color: "#393939",
  fontWeight: "400",
  height: "3.6rem",
  overflow: "hidden"
};
const itemCard_price = {
  fontSize: "1.8rem",
  fontWeight: "400",
  fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, sans-serif'
};
const itemCard_price_sale = {
  color: "#FF0000",
  fontSize: "1.8rem",
  fontWeight: "600",
  marginRight: ".5rem"
};
const itemCard_price_crossedOut = {
  textDecoration: "line-through",
  color: "#808080"
};
const itemCard_buttonBar = { margin: "4% 5% 0% 5%" };

const ItemCard = ({
  item,
  inCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  history
}) => {
  const { image, itemid, name, price, quantity, sale } = item;


  // Renders the item price.
  // If sale price is zero then it renders normally, otherwise
  // it renders the sale price in red and the original MSRP with a strike-through.
  const renderPrice = () => {
    if (sale !== 0) {
      return (
        <div style={itemCard_price}>
          <span style={itemCard_price_sale}>${Number(sale).toFixed(2)}</span>
          <span style={itemCard_price_crossedOut}>
            ${Number(price).toFixed(2)}
          </span>
        </div>
      );
    } else {
      return <span style={itemCard_price}>${Number(price).toFixed(2)}</span>;
    }
  };

  // Places a badge to the top right of the item to indicate any special properties of the item.
  // Currently "On Sale" is the only badge.
  const renderBadge = () => {
    if (sale !== 0) {
      return <div style={itemCard_badge_onSale}/>;
    }
  };

  // Renders the items button bar. By default this includes the counter
  const renderButtonBar = () => {
    // Mobile has traditional state
    if (window.innerWidth < 550) {
      if (inCart === 0) {
        return (
          <div style={itemCard_buttonBar}>
            <Button
              style={addToCartButton}
              snacksStyle="secondary"
              size="small"
              onClick={() => {
                handleAddToCart();
              }}
            >
              Add To Cart
            </Button>
          </div>
        );
      } else {
        return (
          <div style={itemCard_buttonBar}>
            <Counter
              quantity={inCart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          </div>
        );
      }

      // On desktop we use this fancy mouse hover stuff
    } else {
      return (
        <div style={itemCard_buttonBar}>
          {inCart && inCart !== 0 ? (
            <Counter
              quantity={inCart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ) : (
            <Button
              style={addToCartButton}
              snacksStyle="secondary"
              size="small"
              onClick={() => {
                handleAddToCart();
              }}
            >
              Add To Cart
            </Button>
          )}
        </div>
      );
    }
  };

  // Increases the quantity of this item in the cart
  const handleIncrease = () => {
    updateQuantity(item, 1);
  };

  // Decreases teh quantity of this item by 1 in the cart.
  const handleDecrease = () => {
    updateQuantity(item, -1);
  };

  // Remove the item from the cart
  const handleRemove = () => {
    removeFromCart(item);
  };

  // Redirect to the item's product page.
  const handleItemClicked = () => {
    history.push({
      pathname: "/item",
      search: "?id=" + itemid
    });
  };

  const handleAddToCart = () => {
    console.log("item added to cart :", item);
    addToCart(item, 1);
  };

  if (name) {
    return (
      <div style={itemCard}>
        <div style={itemCard_cardContents} onClick={handleItemClicked}>
          {renderBadge()}
          <div style={itemCard_media}>
            <img src={image} alt={name} style={itemCard_media_image} />
          </div>
          <div style={itemCard_itemInfo}>
            <div style={itemCard_fullItemName}>
              <span>{name}</span>
            </div>
            {renderPrice()}
            <p style={itemCard_itemInfo_weight}>{quantity}</p>
          </div>
        </div>
        {renderButtonBar()}
      </div>
    );
  } else {
    // No attributes to the props. Render the loading box from IC Snacks
    return (
      <div style={itemCard}>
        <div
          style={{
            margin: "0 auto 1rem auto",
            width: "15.8rem",
            paddingTop: "1rem"
          }}
        >
          <StyleRoot>
            <div>
              <LoadingBox
                shape="square"
                background="light"
                size="15.8rem"
                style={{ marginBottom: "1rem" }}
              />
            </div>
            <div>
              <LoadingBox
                shape="line"
                size="100%"
                style={{
                  height: "1.6rem",
                  marginTop: ".4rem",
                  marginBottom: "0"
                }}
              />
              <LoadingBox
                shape="line"
                size="100%"
                style={{
                  height: "1.6rem",
                  marginTop: ".4rem",
                  marginBottom: "0"
                }}
              />
              <LoadingBox
                shape="line"
                size="100%"
                background="dark"
                style={{
                  height: "2.8rem",
                  marginTop: ".4rem",
                  marginBottom: "0"
                }}
              />
              <LoadingBox
                shape="line"
                size="30%"
                style={{
                  height: "1.0rem",
                  marginTop: ".4rem",
                  marginBottom: "0"
                }}
              />
            </div>
            <LoadingBox
              shape="line"
              size="100%"
              background="dark"
              style={{ height: "3.2rem" }}
            />
          </StyleRoot>
        </div>
      </div>
    );
  }
};
export default connect(
  (state, ownProps) => ({
    inCart: getQuantityInCartById(state, ownProps.item.itemid)
  }),
  { addToCart, removeFromCart, updateQuantity }
)(withRouter(ItemCard));

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  inCart: PropTypes.number,
  onItemClicked: PropTypes.func,
  onAddToCart: PropTypes.func,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
  onRemoveFromCart: PropTypes.func
};
