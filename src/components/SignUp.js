import React, { Component } from "react";
import { Form, TextField } from "ic-snacks";
import background from "../images/background.svg";
import "../App.css";
import { withRouter } from "react-router-dom";
import wemartLogo from "../images/logo.png";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../services/api";

const logo = { maxWidth: "200px", padding: "1.5rem" };
const greeting = { margin: "2.5rem auto", textAlign: "center" };

class SignUp extends Component {
  state = {
    serverErrors: null
  };

  handleFormSubmit = ({ firstName, lastName, email, password }) => {
    createUser(email, password, firstName, lastName).then((result)=>{
      this.props.history.push({
        pathname: "/confirm",
        search: "?email=" + email,
        state: { password: password }
      });
    }, ()=>{
      alert("Error Creating User")
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
            <h3 style={{ margin: "1rem 2rem" }}>
              We're available in your area
            </h3>
            <h5>Sign up to get started</h5>
          </div>
          <Form
            onSubmit={this.handleFormSubmit}
            serverErrors={this.state.serverErrors}
            formProps={{}}
          >
            <TextField
              floatingLabelText="First Name"
              name="firstName"
              type="firstName"
              hintText=""
              required
              style={txtStyle}
            />
            <TextField
              floatingLabelText="Last Name"
              name="lastName"
              type="lastName"
              hintText=""
              required
              style={txtStyle}
            />
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
              Sign Up
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
            {" "}
            Already have an Account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);
