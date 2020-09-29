import React from "react";
import ReactDOM from "react-dom";
// import HelloWorld from "./hello-world.js";
import Welcome from "./welcome.js";

let elem = <img src="/logo.png" alt="logo" />;

// if user is logged out, show WELCOME registration page aka url has /welcome
if (location.pathname == "/welcome") {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
