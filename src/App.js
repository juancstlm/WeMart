import React, {Component} from "react";
import {StyleRoot} from "radium";
import Fonts from "./components/Fonts";
import {BrowserRouter} from "react-router-dom";
import Router from "./components/Router";
import {StripeProvider} from "react-stripe-elements";
import {themer} from "ic-snacks";
import {wemartTheme} from "./wemartTheme";
import {Provider} from "react-redux";
import store, {persistor} from "./redux/store";
import "./App.css";
import {PersistGate} from "redux-persist/integration/react";
import {InstantSearch} from "react-instantsearch-dom";
import {searchClient} from "./services/api";

themer.themeConfig = wemartTheme; //IC-Snacks theme for WeMart
const stripeKey = process.env.REACT_APP_STRIPE_API_KEY;

const fonts = "https://s3-us-west-1.amazonaws.com/wemartimages/fonts";

class App extends Component {
  constructor() {
    super();
    this.state = {stripe: null}
  }

  componentDidMount = () =>{
    let self = this;
    window.onload=function(){
      if (window.Stripe) {
        self.setState({stripe: window.Stripe(stripeKey)});
      } else {
        document.querySelector('#stripe-js').addEventListener('load', () => {
          // Create Stripe instance once Stripe.js loads
          self.setState({stripe: window.Stripe(stripeKey)});
        });
      }
    }

  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider stripe={this.state.stripe}>
            <StyleRoot>
              <InstantSearch indexName='wemart' searchClient={searchClient}>
                <Fonts assetsUrl={fonts} />
                <BrowserRouter>
                  <Router />
                </BrowserRouter>
              </InstantSearch>
            </StyleRoot>
          </StripeProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
