import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger/src";
import thunk from "redux-thunk";
import freeze from "redux-freeze";
import rootReducer from "./rootreducer";
import _ from "lodash";
import {persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer)


const logger = createLogger();
const middleWares = _.compact([thunk, freeze, logger, ]);
const createStoreWithMiddleWare = applyMiddleware(...middleWares)(createStore);
const store = createStoreWithMiddleWare(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


export const persistor = persistStore(store);
export default store;
