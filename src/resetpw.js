import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
        };
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    submitEmail() {
        const { email } = this.state;
        console.log("email submitted for reset", email);
        axios
            .post("/reset-email", {
                email,
            })
            .then(({ data }) => {
                // console.log("data from server: ", data);
                if (data.success) {
                    this.setState({
                        current: 2,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error in axios POST / reset-email", err);
                this.setState({
                    error: true,
                });
            });
    }

    submitCode() {
        const { email, code, password } = this.state;
        console.log("code new-password in reset: ", email, code, password);
        axios
            .post("/reset-code", {
                email,
                code,
                password,
            })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        current: 3,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        let elem;
        if (this.state.current == 1) {
            elem = (
                <div className="registration-form">
                    <h3 style={{ alignSelf: "center" }}>Reset Your Password</h3>
                    {/* <p>Please enter Your email address:</p> */}
                    {/* <p>Please enter Your email address</p> */}
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter Your Email"
                        key={0} // what ever this is?
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="submit-button"
                        onClick={() => this.submitEmail()}
                    >
                        Next Step
                    </button>
                    <div className="redirect">
                        <Link to="/" style={{ color: "black" }}>
                            Not yet a member? Register here.
                        </Link>
                        <br></br>
                        <br></br>
                        <Link to="/login" style={{ color: "black" }}>
                            Found password? Login here.
                        </Link>
                    </div>
                </div>
            );
        } else if (this.state.current == 2) {
            elem = (
                <div className="registration-form">
                    <h3 style={{ alignSelf: "center" }}>Reset Your Password</h3>
                    <p>Please enter the code you received:</p>
                    <input
                        name="code"
                        type="text"
                        placeholder="Code"
                        key={1} // what ever this is?
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter New Password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="submit-button"
                        onClick={() => this.submitCode()}
                    >
                        Save New Password
                    </button>
                </div>
            );
        } else {
            // console.log("SOMETHING SOMETHING");
            elem = (
                <div className="reset-final">
                    <h3 style={{ alignSelf: "center" }}>
                        Your password has been reset successfully!
                    </h3>
                    <div className="redirect">
                        <Link to="/login" style={{ color: "black" }}>
                            Log in with new Password.
                        </Link>
                    </div>
                </div>
            );
        }
        return (
            <div>
                {this.state.error && (
                    <div className="error" style={{ marginTop: "20px" }}>
                        Oops! Something went wrong.
                        <br></br>Try again.
                    </div>
                )}
                {elem}
            </div>
        );
    }
}
////////////////////////////////////////////////////////////
////////////////// ALTERNATIVE TO ABOVE  ///////////////////
////////////////////////////////////////////////////////////
