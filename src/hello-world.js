import React from "react";
import Greetee from "./greetee.js";
import Counter from "./counter.js";
import Changer from "./changer.js";

export default function HelloWorld() {
    const name = "kathi";
    return (
        <div>
            <Changer />
            <Counter />
            <div>
                Hello, <Greetee muffin="yummy" name="mephistopheles" />!
            </div>
            <div>
                Hello, <Greetee muffin="yummy" name="{ name }" />!
            </div>
            <div>
                Hello, <Greetee muffin="yummy" name="" />!
            </div>
        </div>
    );
}
