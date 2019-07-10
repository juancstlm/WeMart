import Header from "./header";
import Footer from "./Footer";
import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCogtnioUser,
  getShoppingListItemsIds,
  getItems, updateShoppingList
} from "../services/api";
import { addToCart } from "../redux/actions";
import { connect } from "react-redux";

const ShoppingList = ({ addToCart, history }) => {
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [userid, setUserid] = useState("");

  useEffect(() => {
    getCogtnioUser().then(userid => {
      setUserid(userid);
      getShoppingListItemsIds(userid).then(result => {
        let itemids = Array.from(result);
        getItems(itemids).then(result => {
          setItems(result);
        });
      });
    });
  }, []);

  const deleteItem = item => {
    // remove item from state
    let array = items.filter(i => i.itemid !== item.itemid);
    setItems(array);

    console.log('array using splice', array)

    // Get updated array of itemIds
    let itemIds  = array.map(item => String(item.itemid));
    updateShoppingList(itemIds, userid)
  };

  const handleItemClick = item => {
    history.push({
      pathname: "item",
      search: "?id=" + item.itemid
    });
  };

  const renderShoppingList = () => {
    const placeHolder = {
      textAlign: "center",
      marginTop: "20vh",
      color: "gray"
    };

    if (userid == null) {
      return (
        <div style={placeHolder}>
          <h2>You must be logged in to view your list.</h2>
          <h4>
            Please <Link to="/login">Log In</Link> or{" "}
            <Link to="/signup">Sign Up</Link>
          </h4>
        </div>
      );
    } else if (items.length !== 0) {
      // Mobile
      if (window.innerWidth < 550) {
        const webkitEllipsis = {
          display: "-webkit-box",
          webkitLineClamp: "2",
          webkitBoxOrient: "vertical",
          overflow: "hidden"
        };

        return items.map(item => (
          <div key={item.itemid}>
            <hr />
            <p
              style={{ cursor: "pointer", float: "right" }}
              className="primaryRedWithHover"
              onClick={() => deleteItem(item)}
            >
              <i className="fa fa-trash" />
            </p>
            <div style={{ height: "100px", width: "100px" }}>
              <img
                className="img-responsive"
                src={item.image}
                onClick={() => handleItemClick(item)}
              />
            </div>
            <div style={{ marginLeft: "120px", marginTop: "-120px" }}>
              <h3 style={webkitEllipsis}>{item.name} </h3>
              <p style={{ color: "grey", fontSize: "1.1em" }}>
                {item.quantity}
              </p>
              {renderPrice(item)}
            </div>
            <button
              className="primary"
              onClick={() => addToCart(item)}
              style={{ marginTop: "3%", width: "100%", height: "40px" }}
            >
              {" "}
              Add to Cart{" "}
            </button>
          </div>
        ));
      } else {
        return items.map(item => (
          <div key={item.itemid}>
            <hr />
            <div
              style={{
                float: "right",
                width: "min(40%, 300px)",
                textAlign: "right"
              }}
            >
              <p
                style={{ cursor: "pointer" }}
                className="primaryRedWithHover"
                onClick={() => deleteItem(item)}
              >
                <i className="fa fa-trash" />
              </p>
            </div>
            <div style={{ height: "150px", width: "150px" }}>
              <img
                className="img-responsive"
                src={item.image}
                onClick={() => handleItemClick(item)}
              />
            </div>
            <div style={{ marginLeft: "170px", marginTop: "-170px" }}>
              <h3>{item.name}</h3>
              <p style={{ color: "grey", fontSize: "1.1em" }}>
                {item.quantity}
              </p>
              {renderPrice(item)}
              <button
                className="primary"
                onClick={() => addToCart(item)}
                style={{ width: "40%", maxWidth: "250px", height: "40px" }}
              >
                {" "}
                Add to Cart{" "}
              </button>
            </div>
          </div>
        ));
      }
    } else if (finishedLoading) {
      return <h2 style={placeHolder}>No Items in List</h2>;
    }
  };

  const renderPrice = item => {
    if (item.sale != 0) {
      return (
        <p style={{ color: "#D30707", fontSize: "1.2em" }}>
          ${Number(item.sale).toFixed(2)} &nbsp;&nbsp;
          <span style={{ color: "#808080", textDecoration: "line-through" }}>
            ${Number(item.price).toFixed(2)}
          </span>
        </p>
      );
    } else {
      return (
        <p style={{ fontSize: "1.2em" }}>${Number(item.price).toFixed(2)}</p>
      );
    }
  };

  return (
    <div>
      <Header />
      <div
        id="pageBody"
        style={{ minHeight: window.innerHeight - 245, marginBottom: "36px" }}
      >
        <h2 style={{ marginLeft: "10%" }}>Shopping List</h2>
        <div style={{ margin: "2% 10% 2% 10%" }}>{renderShoppingList()}</div>
        <ToastContainer hideProgressBar={true} autoClose={2000} />
      </div>
      <Footer />
    </div>
  );
};
export default connect(
  null,
  { addToCart }
)(withRouter(ShoppingList));
