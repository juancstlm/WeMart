import React, {Component} from "react";
import logo from "../images/logo.png";
import {withRouter} from "react-router-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group"; // ES6
import "./header.css";
import Cart from "./Cart/Cart";
import {Icon} from "ic-snacks";
import {poolData} from "../services/api";
import Autocomplete from "./common/Autocomplete";
import {connect} from "react-redux";
import {getZipCode} from "../redux/selectors";
import {Overlay} from "./common/overlay/overlay";

//Styles
const astext = {
  background: "none",
  border: "none",
  margin: "0",
  padding: "0",
  marginTop: "14px",
  fontSize: "1.25em",
  textAlign: "center"
};

const dropdownButton = {
  background: "none",
  border: "none",
  margin: "7.5px 0px",
  padding: "0",
  fontSize: "1.15em",
  textAlign: "center",
  fontWeight: "200"
};

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const pillsLi = {
  margin: "auto 44px",
  fontSize: "1em",
  marginBottom: "8px",
  textAlign: "center"
};

const mobileNav = {
  margin: "0 auto",
  padding: "0",
  display: "block",
  listStyleType: "disc",
  fontSize: "11px"
};

const mobileNavItems = {
  display: "inline-block",
  height: "100%",
  textAlign: "center",
  float: "left",
  margin: "0",
  width: "33%"
};

//TODO redo the header mobile links
//
// const links = {
//   color: "#D30707",
//   fontSize: "1.25em",
//   textAlign: "center"
// };

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

var cognitoUser;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      value: "",
      cartClicked: false,
      isLoggedIn: false
    };
    this.getCurrentUser();
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut() {
    if (window.confirm("Are you sure you want to log out?")) {
      cognitoUser.signOut();
      console.log(this.props);
    } else {
      console.log("cancels");
    }
  }

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };


  getCurrentUser() {
    // Get poolData
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    cognitoUser = userPool.getCurrentUser();
  }

  showCart = () => {
    const bool = !this.state.cartClicked;
    this.setState({ cartClicked: bool });
  };

  closeCart = () => {
    this.setState({ cartClicked: false });
  };

  handleDepartments = e => {
    e.preventDefault();
    this.props.history.push("/departments");
  };

  handleHistoryClick = e => {
    e.preventDefault();
    this.props.history.push("/history");
  };

  handleZipClick = e => {
    e.preventDefault();
    this.props.history.push("/");
  };

  handleSavingsClick = e => {
    e.preventDefault();
    this.props.history.push({
      pathname: "search",
      search: "?query=savings&special=true"
    });
  };

  renderAccountButton() {
    if (cognitoUser !== null) {
      return (
        <div className="dropdown">
          <button
            className="dropdown-toggle primaryRedWithHover"
            style={astext}
            type="button"
            id="dropdownMenuHeader"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
          >
            Account
            <span className="cart" />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li>
              <a href="/accountsettings">
                <button className="primaryRedWithHover" style={dropdownButton}>
                  Account Settings
                </button>
              </a>
            </li>
            <li>
              <a href="/shoppinglist">
                <button className="primaryRedWithHover" style={dropdownButton}>
                  Shopping List
                </button>
              </a>
            </li>
            <li>
              <a href="/login">
                <button
                  className="primaryRedWithHover"
                  style={dropdownButton}
                  onClick={this.handleSignOut}
                >
                  Sign Out
                </button>
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <button
          className="primaryRedWithHover"
          style={astext}
          onClick={() => this.props.history.push("/login")}
        >
          Log In
        </button>
      );
    }
  }

  renderMobileAccountButton() {
    if (cognitoUser !== null) {
      return (
        <div className="dropdown">
          <button
            className="btn btn-danger btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuHeader"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            style={{ backgroundColor: "#D30707" }}
          >
            <i className="fas fa-user" />
            <span className="caret" />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li>
              <a href="/accountsettings">
                <button className="primaryRedWithHover" style={dropdownButton}>
                  Account Settings
                </button>
              </a>
            </li>
            <li>
              <a href="/shoppinglist">
                <button className="primaryRedWithHover" style={dropdownButton}>
                  Shopping List
                </button>
              </a>
            </li>
            <li>
              <a href="/login">
                <button
                  className="primaryRedWithHover"
                  style={dropdownButton}
                  onClick={this.handleSignOut}
                >
                  Sign Out
                </button>
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <button
          onClick={() => this.props.history.push("/login")}
          className="btn btn-danger btn-sm"
          style={{ backgroundColor: "#D30707" }}
        >
          <i class="fas fa-sign-in-alt" />
        </button>
      );
    }
  }

  render() {
    const { width } = this.state;

    // At this value the header would be unusable anyway so better to switch to the mobile header
    const isMobile = width <= 904;
    if (isMobile) {
      return (
        <div style={{ paddingBottom: "200px" }}>
          <div
            className="container"
            style={{
              width: "100%",
              backgroundColor: "#F5F5F5",
              position: "fixed",
              zIndex: "10"
            }}
          >
            <Overlay active={this.state.cartClicked} onClick={this.closeCart}/>
            <div className="row" style={{ marginTop: "3%" }}>
              <div className="container-fluid" style={center}>
                <div style={{ paddingLeft: "0" }} className="col-xs-2">
                  {this.renderMobileAccountButton()}
                </div>

                <div
                  className="col-xs-8"
                  style={{ textAlign: "center", color: "#E6003D" }}
                >
                  <a href="/home">
                    <img
                      alt={'logo'}
                      src={logo}
                      style={{ height: "35px", backgroundColor: "clear" }}
                    />
                  </a>
                </div>

                <div style={{ paddingRight: "0" }} className="col-xs-2">
                  <button
                    onClick={this.showCart}
                    style={{ float: "right", backgroundColor: "#D30707" }}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-shopping-cart" />
                  </button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="container-fluid">
                <div
                  className="form-group"
                  style={{ position: "relative", margin: "15px 0 0 0" }}
                >
                  <Autocomplete />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="container">
                <ul className="nav nav-tabs" style={mobileNav}>
                  <li style={mobileNavItems}>
                      <button style={astext} onClick={this.handleDepartments}>
                        <i className="fas fa-th-large" />
                        <br />
                        <span>Aisles</span>
                      </button>
                  </li>

                  <li style={mobileNavItems}>
                    {" "}
                      <button style={astext} onClick={this.handleSavingsClick}>
                        <i className="fas fa-tag" />
                        <br />
                        <span>Savings</span>
                      </button>
                  </li>

                  <li style={mobileNavItems}>
                      <button style={astext} onClick={this.handleHistoryClick}>
                        <i className="fas fa-history" />
                        <br />
                        <span>History</span>
                      </button>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <ReactCSSTransitionGroup
                transitionName="slide"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.cartClicked ? (
                  <Cart
                    onCloseClick={cartClicked => this.closeCart(cartClicked)}
                  />
                ) : null}
              </ReactCSSTransitionGroup>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ paddingBottom: "115px" }}>
          <nav
            className="navbar navbar-light"
            style={{
              width: "100%",
              backgroundColor: "#F5F5F5",
              position: "fixed",
              zIndex: "10",
              marginBottom: "115px",
              borderRadius: "0"
            }}
          >
            <Overlay active={this.state.cartClicked} onClick={this.closeCart}/>
            <div className="container-fluid" style={center}>
              <div
                className="navbar-header"
                style={{ width: "15%", paddingTop: "3px", marginLeft: "2.5vw" }}
              >
                <a className="navbar-brand" style={center} href="/home">
                  <img
                    alt={"logo"}
                    src={logo}
                    style={{ height: "35px", backgroundColor: "clear" }}
                  />
                </a>
              </div>

              <ul
                className="nav navbar-nav"
                style={{ width: "55%", marginLeft: "25px" }}
              >
                <Autocomplete />
              </ul>

              <ul
                className="nav navbar-nav navbar-right"
                style={(center, { width: "30%" })}
              >
                <li style={{ width: "36%" }}>
                  <button
                    className="primaryRedWithHover"
                    style={astext}
                    onClick={this.handleZipClick}
                  >
                    <Icon name="locationMarkerFilled" /> &nbsp;
                    {this.props.zipCode}
                  </button>
                </li>

                <li style={{ width: "32%" }}>{this.renderAccountButton()}</li>

                <li style={{ width: "32%" }}>
                  <button
                    type="button"
                    className="primary"
                    onClick={this.showCart}
                    style={{ marginTop: "4px", height: "44px", width: "90px" }}
                  >
                    <i className="fas fa-shopping-cart" />
                    <span style={{ marginRight: "8px" }} />
                    Cart
                  </button>
                </li>
              </ul>
            </div>
            <ul id="pills" className="nav nav-pills" style={center}>
              <li role="navigation" style={pillsLi}>
                <button
                  className="primaryRedWithHover"
                  style={astext}
                  onClick={this.handleDepartments}
                >
                  Departments
                </button>
              </li>
              <li role="navigation" style={pillsLi}>
                <button
                  className="primaryRedWithHover"
                  style={astext}
                  onClick={this.handleSavingsClick}
                >
                  Savings
                </button>
              </li>
              <li role="navigation" style={pillsLi}>
                <button
                  className="primaryRedWithHover"
                  style={astext}
                  onClick={this.handleHistoryClick}
                >
                  History
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <ReactCSSTransitionGroup
              transitionName="slide"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.state.cartClicked ? (
                <Cart
                  onCloseClick={cartClicked => this.closeCart(cartClicked)}
                />
              ) : null}
            </ReactCSSTransitionGroup>
          </div>
        </div>
      );
    }
  }
}
export default connect(state => ({
  zipCode: getZipCode(state)
}))(withRouter(Header));
