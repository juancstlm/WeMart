import { combineReducers } from "redux";

//Reducers go here
import cart from "./reducers/cart";

const rootReducer = combineReducers({ cart: cart });

export default rootReducer;
