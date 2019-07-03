import Header from "./header";
import Footer from "./Footer";
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { DynamoDB } from "aws-sdk/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { poolData } from "../services/api";

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

var itemIds = [];
var cognitoUser;
var email;
var dynamodb;

class ShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finishedLoading: false,
      items: []
    };

    this.getCurrentUser();
    this.initializeDB();
  }

  getCurrentUser() {
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    cognitoUser = userPool.getCurrentUser();

    let nested = this;

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log("session validity: " + session.isValid());

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            console.log(err);
          } else {
            attributes.forEach(function(att) {
              if (att.Name == "email") {
                email = att.Value;
                nested.getItemIds();
              }
            });
          }
        });
      });
    }
  }

  initializeDB() {
    if (process.env.NODE_ENV === "development") {
      dynamodb = require("../db").db;
    } else {
      dynamodb = new DynamoDB({
        region: "us-west-1",
        credentials: {
          accessKeyId: process.env.REACT_APP_DB_accessKeyId,
          secretAccessKey: process.env.REACT_APP_DB_secretAccessKey
        }
      });
    }
  }

  getItemIds() {
    var params = {
      Key: {
        userid: {
          S: email
        }
      },
      TableName: "user"
    };

    dynamodb.getItem(
      params,
      function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          try {
            itemIds = data.Item.lists.M.shoppingList.SS;
          } catch (error) {
            console.log("shoppingList not yet created  " + error.message);
          } finally {
            this.getItems();
          }
        }
      }.bind(this)
    );
  }

  getItems() {
    var keys = [];
    itemIds.map(itemId => {
      keys.push({ itemid: { S: itemId } });
    });

    if (keys.length !== 0) {
      var params = {
        RequestItems: {
          item: {
            Keys: keys
          }
        }
      };

      dynamodb.batchGetItem(
        params,
        function(err, data) {
          if (err) {
            alert(err.message);
          } else {
            var items = [];
            data.Responses.item.forEach(item => {
              items.push({
                itemid: item.itemid.S,
                name: item.name.S,
                quantity: item.quantity.S,
                department: item.department.S,
                image: item.image.S,
                sale: item.sale.N,
                price: item.price.N
              });
            });
            this.setState({ finishedLoading: true, items: items });
          }
        }.bind(this)
      );
    } else {
      this.setState({ finishedLoading: true, items: [] });
    }
  }

  deleteItem(item) {
    if (window.confirm("Are you sure you want to delte this item?")) {
      // First remove from state
      var array = this.state.items;
      var index = array.indexOf(item);
      array.splice(index, 1);
      this.setState({ items: array });

      // Get updated array of itemIds
      var itemIds = [];
      array.forEach(item => itemIds.push(item.itemid));

      var params = {};
      if (itemIds.length == 0) {
        params = {
          TableName: "user",
          Key: {
            userid: {
              S: email
            }
          },
          UpdateExpression: "REMOVE lists.shoppingList",
          ReturnValues: "UPDATED_NEW"
        };
      } else {
        params = {
          TableName: "user",
          Key: {
            userid: {
              S: email
            }
          },
          UpdateExpression: "SET lists = :lists",
          ExpressionAttributeValues: {
            ":lists": {
              M: {
                shoppingList: {
                  SS: itemIds
                }
              }
            }
          },
          ReturnValues: "UPDATED_NEW"
        };
      }

      dynamodb.updateItem(params, function(err, data) {
        if (err) {
          alert(JSON.stringify(err));
        } else {
          console.log("Removed from Shopping List: " + data);
        }
      });
    }
  }

  addToCart(item) {
    if (localStorage.getItem("cart") != null) {
      var cartString = localStorage.getItem("cart");
      var cart = JSON.parse(cartString);

      var quantity = 0;
      if (cart.hasOwnProperty(item.itemid)) {
        quantity = cart[item.itemid];
      }
      item.quantityInCart = quantity + 1;
      cart[item.itemid] = item;
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.error("Added to cart");
    } else {
      var cart = {};
      item.quantityInCart = 1;
      cart[item.itemid] = item;
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.error("Added to cart");
    }
  }

  handleItemClick(item) {
    this.props.history.push({
      pathname: "item",
      search: "?id=" + item.itemid
    });
  }

  renderShoppingList() {
    const placeHolder = {
      textAlign: "center",
      marginTop: "20vh",
      color: "gray"
    };

    if (cognitoUser == null) {
      return (
        <div style={placeHolder}>
          <h2>You must be logged in to view your list.</h2>
          <h4>
            Please <Link to="/login">Log In</Link> or{" "}
            <Link to="/signup">Sign Up</Link>
          </h4>
        </div>
      );
    } else if (this.state.items.length !== 0) {
      // Mobile
      if (window.innerWidth < 550) {
        const webkitEllipsis = {
          display: "-webkit-box",
          webkitLineClamp: "2",
          webkitBoxOrient: "vertical",
          overflow: "hidden"
        };

        return this.state.items.map(item => (
          <div>
            <hr />
            <p
              style={{ cursor: "pointer", float: "right" }}
              class="primaryRedWithHover"
              onClick={() => this.deleteItem(item)}
            >
              <i class="fa fa-trash" />
            </p>
            <div style={{ height: "100px", width: "100px" }}>
              <img
                className="img-responsive"
                src={item.image}
                onClick={() => this.handleItemClick(item)}
              />
            </div>
            <div style={{ marginLeft: "120px", marginTop: "-120px" }}>
              <h3 style={webkitEllipsis}>{item.name} </h3>
              <p style={{ color: "grey", fontSize: "1.1em" }}>
                {item.quantity}
              </p>
              {this.renderPrice(item)}
            </div>
            <button
              class="primary"
              onClick={() => this.addToCart(item)}
              style={{ marginTop: "3%", width: "100%", height: "40px" }}
            >
              {" "}
              Add to Cart{" "}
            </button>
          </div>
        ));
      } else {
        return this.state.items.map(item => (
          <div>
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
                class="primaryRedWithHover"
                onClick={() => this.deleteItem(item)}
              >
                <i class="fa fa-trash" />
              </p>
            </div>
            <div style={{ height: "150px", width: "150px" }}>
              <img
                className="img-responsive"
                src={item.image}
                onClick={() => this.handleItemClick(item)}
              />
            </div>
            <div style={{ marginLeft: "170px", marginTop: "-170px" }}>
              <h3>{item.name}</h3>
              <p style={{ color: "grey", fontSize: "1.1em" }}>
                {item.quantity}
              </p>
              {this.renderPrice(item)}
              <button
                class="primary"
                onClick={() => this.addToCart(item)}
                style={{ width: "40%", maxWidth: "250px", height: "40px" }}
              >
                {" "}
                Add to Cart{" "}
              </button>
            </div>
          </div>
        ));
      }
    } else if (this.state.finishedLoading) {
      return <h2 style={placeHolder}>No Items in List</h2>;
    }
  }

  renderPrice(item) {
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
  }

  render() {
    return (
      <div>
        <Header />
        <div
          id="pageBody"
          style={{ minHeight: window.innerHeight - 245, marginBottom: "36px" }}
        >
          <h2 style={{ marginLeft: "10%" }}>Shopping List</h2>
          <div style={{ margin: "2% 10% 2% 10%" }}>
            {this.renderShoppingList()}
          </div>
          <ToastContainer hideProgressBar={true} autoClose={2000} />
        </div>
        <Footer />
      </div>
    );
  }
}
export default withRouter(ShoppingList);
