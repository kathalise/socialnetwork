import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome.js";

let elem = <img className="logo" src="/logo.png" alt="logo" />;

// if user is logged out, show WELCOME registration page /welcome
if (location.pathname == "/welcome") {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
