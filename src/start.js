import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import { App } from "./app.js";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
let elem;

// if user is logged out, show WELCOME registration page /welcome
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

////////////////////////////////////////////////
//////////// check THIS function ↓ /////////////
////////////////////////////////////////////////
