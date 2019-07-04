import React, { Component } from "react";
import { StyleRoot } from "radium";
import Fonts from "./components/Fonts";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/Router";
import { StripeProvider } from "react-stripe-elements";
import { themer } from "ic-snacks";
import { wemartTheme } from "./wemartTheme";
import {Provider} from 'react-redux'
import store from './redux/store'
import "./App.css";


themer.themeConfig = wemartTheme; //IC-Snacks theme for WeMart
const stripeKey = process.env.REACT_APP_STRIPE_API_KEY;

const fonts = "https://s3-us-west-1.amazonaws.com/wemartimages/fonts";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StripeProvider apiKey={stripeKey}>
          <StyleRoot>
            <Fonts assetsUrl={fonts} />
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </StyleRoot>
        </StripeProvider>
      </Provider>
    );
  }
}

export default App;
