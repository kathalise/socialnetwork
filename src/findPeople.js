import axios from "axios";
import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [userSearch, setUserSearch] = useState([]);

    // console.log("users: ", users);
    useEffect(() => {
        // console.log("EFFECT IS WORKING");
        (async () => {
            try {
                const { data } = await axios.get("/mostrecent/users");
                // console.log("data: ", data);
                setUsers(data);
            } catch (err) {
                console.log("err: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        // console.log("EFFECT SEARCH IS WORKING");
        let ignore = false;
        (async () => {
            // console.log("INSIDE async iife");
            if (userInput) {
                try {
                    const { data } = await axios.get(
                        `/mostrecent/users/${userInput}`
                    );
                    // console.log("data from db: ", data);
                    if (!ignore) {
                        setUserSearch(data);
                    } else {
                        console.log("ignored!");
                    }
                } catch (err) {
                    console.log("err: ", err);
                }
            } else {
                console.log("EMPTY ELSE");
                setUserSearch([]);
            }
        })();
        return () => {
            console.log("Clean up order of api request");
            ignore = true;
        };
    }, [userInput]);
    // console.log("users: ", userInput);

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="find-people">
            <h1 className="center-headline">Find People</h1>
            <div className="search-container">
                {/* <h2 className="center-headline">Search The Network</h2> */}
                <input
                    className="search"
                    onChange={handleChange}
                    placeholder={"Search Social Network 🔎"}
                />
                {userSearch.map((user, i) => {
                    return (
                        <div className="search-results" key={i}>
                            <Link key={i} to={`/user/${user.id}`}>
                                <img
                                    className="medium"
                                    src={user.imgurl || "/default.png"}
                                />
                            </Link>

                            <h2>
                                {user.firstname} {user.lastname}
                            </h2>
                        </div>
                    );
                })}
            </div>

            <h2 style={{ marginTop: "50px" }} className="center-headline">
                Has recently joined
            </h2>
            <div className="newbies-container">
                {users.map((user, i) => {
                    return (
                        <div className="newbies" key={i}>
                            <Link key={i} to={`/user/${user.id}`}>
                                <img
                                    className="medium"
                                    src={user.imgurl || "/default.png"}
                                />
                            </Link>

                            <h2>
                                {user.firstname} {user.lastname}
                            </h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
