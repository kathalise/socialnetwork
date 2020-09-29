import React from "react";

export default class Changer extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    handleChange(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        console.log("this.state: ", this.state);
        return (
            <div>
                <h1>I am the changer!</h1>
                <input onChange={(e) => this.handleChange(e)}></input>
                <div>{this.state.name}</div>
            </div>
        );
    }
}
