import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import moment from "moment";

export default function Chat() {
    const elemRef = useRef();

    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("HELLO FROM CHAT.js / chatMessages :", chatMessages);

    // only scrolls down when page loads
    // add sth to update (scroll down) when new message was uploaded
    useEffect(() => {
        // console.log("useEffect running....");
        // console.log("elemRef.current: ", elemRef.current);
        // console.log("elemRef.current.scrollTop:", elemRef.current.scrollTop);
        // console.log("scrollHeight:", elemRef.current.scrollHeight);
        // console.log("clientHeight:", elemRef.current.clientHeight);
        // client height = BOX HEIGHT (300px)

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    });

    function keyCheck(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value: ", e.target.value);
            socket.emit("newChatMessage", e.target.value);
            e.target.value = "";
        }
    }

    return (
        <>
            <h1 className="center-headline">Chatroom</h1>
            <div className="chat-room">
                <div className="chat-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message, i) => {
                            console.log("somethin");
                            return (
                                <div className="message" key={i}>
                                    <div className="img-chat">
                                        <img
                                            style={{
                                                height: "70px",
                                                width: "70px",
                                            }}
                                            src={message.imgurl}
                                        />
                                    </div>
                                    <div className="name-msg-chat">
                                        <p>
                                            <strong>
                                                {message.firstname}{" "}
                                                {message.lastname}{" "}
                                            </strong>
                                            {moment(
                                                message.created_at
                                            ).fromNow()}
                                            :
                                        </p>

                                        <p style={{ fontStyle: "italic" }}>
                                            {message.message_text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <textarea
                    className="chat-textarea"
                    onKeyDown={keyCheck}
                    placeholder="Add your message here..."
                ></textarea>
            </div>
        </>
    );
}
