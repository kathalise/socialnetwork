import React from "react";

export default function Nav() {
    return (
        <>
            <a href={"/logout"}>
                <button className="logout submit-button">Log out</button>
            </a>
            <a href={"/buddies"}>
                <button className="submit-button">My Buddies</button>
            </a>
            <a href={"/users"}>
                <button className="submit-button">Find People</button>
            </a>

            <a href={"/"}>
                <button className="submit-button">My Profile</button>
            </a>
        </>
    );
}
