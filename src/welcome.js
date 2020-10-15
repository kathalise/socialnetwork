import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration.js";
import Login from "./login";
import ResetPassword from "./resetpw.js";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Retro Social Network</h1>
            <img
                style={{ border: "6px white solid" }}
                src="/logo.png"
                alt="logo"
            />

            <div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={ResetPassword} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}
