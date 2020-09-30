import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.submit = this.submit.bind(this);
    }

    handleChange({ target }) {
        // this[target.name] = target.value;
        this.setState({
            [target.name]: target.value,
        });
    }

    submit() {
        const { email, password } = this.state;
        axios
            .post("/login", {
                email,
                password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error in axios POST / login", err);
            });
    }

    render() {
        return (
            <div className="registration-form">
                <h3>Login here</h3>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Try again.
                    </div>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button className="submit-button" onClick={() => this.submit()}>
                    Login
                </button>
                <div className="redirect">
                    <Link to="/">Not yet a member? Register here.</Link>
                    <Link to="/reset">Forgot Your password?</Link>
                </div>
            </div>
        );
    }
}
