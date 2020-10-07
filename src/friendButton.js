import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [textButton, setTextButton] = useState("");
    useEffect(() => {
        console.log("EFFECT IS WORKING", otherId);
        (async () => {
            try {
                const { data } = await axios.get(`/friendstatus/${otherId}`);
                console.log("res from db: ", data);
                setTextButton(data.textButton);
            } catch (err) {
                console.log("err: ", err);
            }
        })();
    }, []);

    const handleClick = () => {
        console.log("Button was clicked!!!", textButton);
        (async () => {
            try {
                console.log("INSIDE TRY");
                // const friendStatus = {
                //     otherId: otherId,
                // };
                const { data } = await axios.post("/update-friendstatus", {
                    otherId,
                });
                setTextButton(data.textButton);
                console.log("Updating Friend Status", data.textButton);
            } catch (err) {
                console.log("err", err);
            }
        })();
    };

    return (
        <div>
            <button onClick={handleClick} className="friend-button">
                {textButton}
            </button>
        </div>
    );
}
