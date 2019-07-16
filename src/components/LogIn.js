import React, {Component} from "react";
import {Form, TextField} from "ic-snacks";
import background from "../images/background.svg";
import "../App.css";
import {withRouter} from "react-router-dom";
import wemartLogo from "../images/logo.png";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {poolData} from "../services/api";

const logo = { maxWidth: "20rem" };
const greeting = { margin: "2.5rem auto", textAlign: "center" };
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

class LogIn extends Component {
  state = {
    serverErrors: null
  };

  handleFormSubmit = model => {
    var authenticationData = {
      Username: model.email,
      Password: model.password
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: model.email,
      Pool: userPool
    };

    // Necessary becuase the closure has no access to this.props
    let nestedProp = this.props;

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        console.log("access token + " + result.getAccessToken().getJwtToken());

        // Should be home page which then checks if user is logged in
        nestedProp.history.push("/home");

        // If we want to delete users use this snippet
        // cognitoUser.deleteUser(function(err, result) {
        //     if (err) {
        //         alert(err.message);
        //         return;
        //     }

        //     alert("Deleted User")
        // });
      },

      onFailure: function(err) {
        toast.warn(err.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    });
  };

  handlePasswordReset = e => {
    e.preventDefault();

    var email = prompt("Please enter your email ", "");

    if (email == null) {
      return;
    }

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: email,
      Pool: userPool
    };

    // Necessary becuase the closure has no access to this.props
    let nestedProp = this.props;

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function(data) {
        // successfully initiated reset password request
        console.log("CodeDeliveryData from forgotPassword: " + data);

        nestedProp.history.push({
          pathname: "/passwordreset",
          search: "?email=" + email
        });
      },

      onFailure: function(err) {
        toast.warn(err.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    });
  };

  render() {
    const txtStyle = {
      margin: "6% 6% 0% 6%",
      width: "88%"
    };

    return (
      <div
        style={{
          height: window.innerHeight + "px",
          overflow: "auto",
          backgroundImage: `url(${background})`,
          backgroundRepeat: "repeat",
          backgroundColor: "red",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            maxWidth: `${0.5 * window.innerWidth}px`,
            minWidth: "250px"
          }}
        >
          <div style={greeting}>
            <img src={wemartLogo} style={logo} alt={"logo"} />
            <h3 style={{ margin: "1rem 2rem" }}>Welcome Back</h3>
            <h5>Log in with your email address and password</h5>
          </div>
          <Form
            onSubmit={this.handleFormSubmit}
            serverErrors={this.state.serverErrors}
            formProps={{}}
          >
            <TextField
              floatingLabelText="Email"
              name="email"
              type="email"
              hintText="johnappleseed@me.com"
              validations={{ isEmail: null, isLength: { min: 3, max: 30 } }}
              validationErrorText="Sorry, please enter a valid email."
              required
              style={txtStyle}
            />
            <TextField
              floatingLabelText="Password"
              name="password"
              type="password"
              hintText="min. 8 characters"
              validations={{ isLength: { min: 8, max: 64 } }}
              validationErrorText="Sorry, password must be min. 8 characters."
              required
              style={txtStyle}
            />
            <button
              class="primary"
              type="submit"
              style={{ margin: "6% 15% 3% 15%", width: "70%", height: "2.2em" }}
            >
              Log In
            </button>
          </Form>
          <p
            style={{
              fontSize: "0.7em",
              textAlign: "center",
              width: "100%",
              color: "#696969"
            }}
          >
            Don't have an Account? <a href="/signup">Sign Up</a> <br />
            <br />
            Forgot your password?{" "}
            <a onClick={this.handlePasswordReset}>Reset It</a>
          </p>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(LogIn);
