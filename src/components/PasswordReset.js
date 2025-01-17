import React, {Component} from "react";
import {Form, TextField} from "ic-snacks";
import background from "../images/background.svg";
import "../App.css";
import {withRouter} from "react-router-dom";
import {poolData} from "../services/api";

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

class PasswordReset extends Component {
  state = {
    serverErrors: null
  };

  handleFormSubmit = model => {
    const queryParams = new URLSearchParams(this.props.location.search);
    let email = queryParams.get("email");

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: email,
      Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // Necessary because the closure has no access to this.props
    let nestedProp = this.props;

    cognitoUser.confirmPassword(model.verificationCode, model.password, {
      onSuccess() {
        alert("Password confirmed!");

        nestedProp.history.push({
          pathname: "/login"
        });
      },
      onFailure(err) {
        alert("Password not confirmed! " + err.message);
      }
    });
  };

  render() {
    const txtStyle = {
      margin: "6%",
      marginBottom: "0%",
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
            borderRadius: "15px",
            maxWidth: `${0.5 * window.innerWidth}px`,
            minWidth: "250px"
          }}
        >
          <Form
            onSubmit={this.handleFormSubmit}
            serverErrors={this.state.serverErrors}
            formProps={{}}
          >
            <TextField
              floatingLabelText="Verification Code"
              name="verificationCode"
              type="verificationCode"
              hintText=""
              required
              style={txtStyle}
            />
            <TextField
              floatingLabelText="New Password"
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
              Reset Password
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(PasswordReset);
