import React, { Component } from 'react';
import { Button, Form, TextField } from 'ic-snacks';
import background from './background.svg';

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

class SignUp extends Component {
  state = {
    serverErrors: null
  }

  handleFormSubmit = (model) => {
    //alert(model.firstName+' '+model.lastName+' '+model.email+' '+model.password)

    var poolData = {
        UserPoolId : 'us-west-2_e6QP6fklc',
        ClientId : '2eoha404fgulrmtqc0ac4pmde5'
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : model.email
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(model.email, model.password, attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        // redirect to page to enter verification code
    });
  }

  render() {
    const formProps = {}

    return (
      <div style={{ height: window.innerHeight+'px', overflow: 'auto', margin: '0px', backgroundImage: `url(${background})`, backgroundRepeat: 'repeate-y', backgroundColor: 'red' }} >
        <div style={{
          margin: `${0.25*window.innerHeight}px ${0.25*window.innerWidth}px ${0.25*window.innerHeight}px ${0.25*window.innerWidth}px`, 
          backgroundColor: '#cdcdcd', 
          borderRadius: '10px',
          maxHeight: `${0.5*window.innerHeight}px`,
          maxWidth: `${0.5*window.innerWidth}px`
          }} >
          <Form
            onSubmit={this.handleFormSubmit}
            serverErrors={this.state.serverErrors}
            formProps={formProps}
          >
            <TextField
              floatingLabelText="First Name"
              name="firstName"
              type="firstName"
              hintText=""
              required
              style={{margin: '4%', marginBottom: '0%', width: '92%', height: '5%'}}
            />
            <TextField
              floatingLabelText="Last Name"
              name="lastName"
              type="lastName"
              hintText=""
              required
              style={{margin: '4%', marginBottom: '0%', width: '92%', height: '5%'}}
            />
            <TextField
              floatingLabelText="Email"
              name="email"
              type="email"
              hintText="jonnyappleseed@example.com"
              validations={{isEmail: null, isLength: {min: 3, max: 30}}}
              validationErrorText="Sorry, please enter a valid email."
              required
              style={{margin: '4%', marginBottom: '0%', width: '92%', height: '5%'}}
            />
            <TextField
              floatingLabelText="Password"
              name="password"
              type="password"
              validations={{isLength: {min: 8, max: 64}}}
              validationErrorText="Sorry, password must be min. 8 characters."
              required
              style={{margin: '4%', marginBottom: '0%', width: '92%', maxHeight: '5%'}}
            />
            <Button type="submit" snackStyle="primary" style={{margin: '4%', width: '92%', height: '5%'}} > 
              Submit 
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default SignUp;
