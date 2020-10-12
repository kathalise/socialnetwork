import Friends from "./friends";

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
                        ...user,
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
    return state;
}
