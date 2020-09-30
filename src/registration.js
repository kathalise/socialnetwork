import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
        const { firstname, lastname, email, password } = this.state;
        axios
            .post("/register", {
                firstname,
                lastname,
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
                console.log("Error in axios POST / register", err);
            });
    }

    render() {
        return (
            <div className="registration-form">
                <h3>Join the social network!</h3>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Try again.
                    </div>
                )}
                <input
                    name="firstname"
                    placeholder="First Name"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="lastname"
                    placeholder="Last Name"
                    onChange={(e) => this.handleChange(e)}
                />
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
                    Submit
                </button>
                <div className="redirect">
                    <Link to="/login">Already a member? Login here.</Link>
                </div>
            </div>
        );
    }
}
