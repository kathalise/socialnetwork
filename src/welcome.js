import React from "react";
import Registration from "./registration.js";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to this</h1>
            <img src="/logo.png" alt="logo" />
            <h2>Join the social network!</h2>
            <div>
                <Registration />
            </div>
            <p>Already a member? Login here.</p>
        </div>
    );
}
