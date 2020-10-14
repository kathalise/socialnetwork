import * as io from "socket.io-client";
import { getChatMessages, newChatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("getChatMessages", (chatMessages) => {
            console.log("HELLO FROM SOCKET.JS // messages : ", chatMessages);
            store.dispatch(getChatMessages(chatMessages));
        });

        socket.on("newChatMessage", (newMessage) => {
            console.log("HELLO FROM SOCKET.JS // new message : ", newMessage);
            store.dispatch(newChatMessage(newMessage));
        });
    }
};
