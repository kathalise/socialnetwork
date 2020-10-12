import React from "react";
import axios from "./axios";

export async function getListOfFriends() {
    try {
        const { data } = await axios.get("/get-buddies");
        console.log("data from DB: ", data);
        return {
            type: "LOAD_FRIENDLIST",
            listOfFriends: data,
        };
    } catch (err) {
        console.log("err", err);
    }
}

export async function acceptFriend(otherId) {
    try {
        console.log("INSIDE acceptFriend");
        const textButton = "Accept Buddy's Request";
        const { data } = await axios.post("/update-friendstatus", {
            otherId,
            textButton,
        });
        console.log("Updating Friend Status", data);
        return {
            type: "ACCEPT_REQUEST",
            wannabe: otherId,
        };
    } catch (err) {
        console.log("err", err);
    }
}

export async function unfriend(otherId) {
    try {
        console.log("INSIDE unfriend");
        const textButton = "Remove Buddy";
        const { data } = await axios.post("/update-friendstatus", {
            otherId,
            textButton,
        });

        console.log("Updating Friend Status", data);
        return {
            type: "REMOVE_BUDDY",
            buddy: otherId,
        };
    } catch (err) {
        console.log("err", err);
    }
}
