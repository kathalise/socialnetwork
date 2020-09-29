import React from "react";

export default class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 0,
        };
        // this.incrementCount = this.incrementCount.bind(this);
    }

    incrementCount() {
        console.log("clicking");
        this.setState({
            count: this.state.count + 1,
        });
    }

    render() {
        return (
            <div>
                <h1>I am the counter {this.state.count}!</h1>
                <button onClick={() => this.incrementCount()}>Click me</button>
            </div>
        );
    }
}
