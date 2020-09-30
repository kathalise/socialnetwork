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
                console.log("data from server: ", data);
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
        const { code, password } = this.state;
        console.log("???? code password in reset", code, password);
    }

    render() {
        let elem;
        if (this.state.current == 1) {
            elem = (
                <div className="registration-form">
                    <h3>You are about to reset Your password</h3>
                    <p>Please enter Your email address</p>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="submit-button"
                        onClick={() => this.submitEmail()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (this.state.current == 2) {
            elem = (
                <div>
                    <h3>Enter Code</h3>
                    <p>Please enter the code you received</p>
                    <input
                        name="code"
                        type="text"
                        placeholder="Code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="submit-button"
                        onClick={() => this.submitCode()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else {
            elem = (
                <div className="redirect">
                    <Link to="/login">Login with new Password.</Link>
                </div>
            );
        }
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Try again.
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

//         return (
//             <div>
//                 {this.state.current == 1 && (
//                     <div>
//                         <input name="email" />
//                     </div>
//                 )}

//                 {this.state.current == 2 && (
//                     <div>
//                         <input name="code" />
//                         <input name="password" />
//                     </div>
//                 )}
//             </div>
//         );
//     }
