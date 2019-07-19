import React from "react";
import {Form, TextField} from "ic-snacks";
import background from "../images/background.svg";
import "../App.css";
import {withRouter} from "react-router-dom";
import wemartLogo from "../images/logo.png";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {connect} from "react-redux";
import {setZipCode} from "../redux/actions";

const logo = { maxWidth: "20rem" };
const greeting = { margin: "2.5rem auto", textAlign: "center" };

const ZipCodeCheck = ({ setZipCode, history }) => {

  const handleFormSubmit = model => {
    if (model.zip > 90000 && model.zip < 96163) {
      setZipCode(model.zip);
      localStorage.setItem("zip", model.zip);
      history.push("/home");
    } else {
      toast.info(<h5>Sorry, we are only in California as of now.</h5>, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      // alert('Sorry, we are only in California as of now.')
    }
  };

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
          <img alt="logo" src={wemartLogo} style={logo} />
          <h3 style={{ margin: "1rem 2rem" }}>
            Groceries delivered to your door
          </h3>
          <h5>Enter your zip code below to continue</h5>
        </div>
        <Form
          onSubmit={handleFormSubmit}
          formProps={{}}
        >
          <TextField
            floatingLabelText="ZIP Code"
            name="zip"
            type="zip"
            hintText=""
            validations={{ isLength: { min: 5, max: 5 } }}
            validationErrorText="Sorry, please enter a valid ZIP code."
            required
            style={txtStyle}
          />
          <button
            className="primary"
            type="submit"
            style={{ margin: "6% 15% 3% 15%", width: "70%", height: "2.2em" }}
          >
            Submit
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
          Already have an Account? <a href="/login">Log In</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default connect(
  null,
  { setZipCode }
)(withRouter(ZipCodeCheck));
