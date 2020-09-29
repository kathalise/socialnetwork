import React from "react";

export default function Greetee(props) {
    console.log("props: ", props);
    return <span>{props.name || "Intruder"}</span>;
}
