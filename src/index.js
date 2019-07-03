import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import App from "./App";
require('dotenv');

ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker();
