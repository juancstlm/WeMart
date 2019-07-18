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
import algoliasearch from "algoliasearch/lite";
import {InstantSearch} from "react-instantsearch-dom";

const searchClient = algoliasearch(
  "8AHZ7T8E5B",
  "c02a4755e9f85983a9daaeb4db0a16ee"
);

themer.themeConfig = wemartTheme; //IC-Snacks theme for WeMart
const stripeKey = process.env.REACT_APP_STRIPE_API_KEY;

const fonts = "https://s3-us-west-1.amazonaws.com/wemartimages/fonts";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider apiKey={stripeKey}>
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
