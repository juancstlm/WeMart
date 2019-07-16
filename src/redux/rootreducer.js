import {combineReducers} from "redux";
//Reducers go here
import cart from "./reducers/cart";
import user from './reducers/user'

const rootReducer = combineReducers({ cart: cart, user: user });

export default rootReducer;
