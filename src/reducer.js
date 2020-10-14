// import Friends from "./friends";

export default function reducer(state = {}, action) {
    if (action.type == "LOAD_FRIENDLIST") {
        state = {
            ...state,
            listOfFriends: action.listOfFriends,
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        // console.log("ACCEPT_REQUEST");
        state = {
            ...state,
            listOfFriends: state.listOfFriends.map((user) => {
                console.log("bla", user);
                if (user.id == action.wannabe) {
                    // console.log("action.wannabe: ", action.wannabe);

                    return {
                        // ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
        // console.log("new state", state);
    }

    if (action.type == "REMOVE_BUDDY") {
        console.log("DELETE");
        state = {
            ...state,
            listOfFriends: state.listOfFriends.filter(
                (user) => user.id != action.buddy
            ),
        };
    }

    if (action.type == "GET_CHAT_MESSAGES") {
        console.log("GET_CHAT_MESSAGES");
        state = {
            ...state,
            chatMessages: action.payload.reverse(),
        };
        console.log("new state in get chat msg", state);
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        console.log("NEW_CHAT_MESSAGE");

        state = {
            ...state,
            chatMessages: [...state.chatMessages.slice(1), action.payload],
        };

        console.log("state in NEW CHAT MSG: ", state);
        console.log("action payload: ", action.payload);
    }
    return state;
}
