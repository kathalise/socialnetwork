import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FriendsofFriends({ otherId, firstname }) {
    const [buddiesOfBuddy, setbuddiesOfBuddy] = useState();

    useEffect(() => {
        console.log("EFFECT IS RUNNING... otherId", otherId);
        console.log("FIRSTNAME: ", firstname);
        (async () => {
            try {
                const { data } = await axios.get(
                    `/show/their-friends/${otherId}`
                );
                console.log("res from db DATA: ", data);
                setbuddiesOfBuddy(data);
            } catch (err) {
                console.log("err: ", err);
            }
        })();
    }, []);

    return (
        <div>
            {buddiesOfBuddy && <h1> {firstname}'s Buddies</h1>}
            {buddiesOfBuddy &&
                buddiesOfBuddy.map((buddy, i) => {
                    return (
                        <div className="buddies-of-buddy" key={buddy.id}>
                            <a href={`/user/${buddy.id}`} key={buddy.id}>
                                <img
                                    className="small"
                                    key={i}
                                    src={buddy.imgurl || "/default.png"}
                                />
                            </a>
                            <h3>
                                {buddy.firstname} {buddy.lastname}
                            </h3>
                        </div>
                    );
                })}
        </div>
    );
}
