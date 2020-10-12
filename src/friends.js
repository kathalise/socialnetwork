import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getListOfFriends, acceptFriend, unfriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const myBuddies = useSelector(
        (state) =>
            state &&
            state.listOfFriends &&
            state.listOfFriends.filter((person) => person.accepted == true)
    );
    console.log("myBuddies: ", myBuddies);

    const myWannaBuddies = useSelector(
        (state) =>
            state &&
            state.listOfFriends &&
            state.listOfFriends.filter((person) => person.accepted == false)
    );
    console.log("myWannaBuddies: ", myWannaBuddies);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            dispatch(getListOfFriends());
        } catch (err) {
            console.log("err", err);
        }
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Your Buddies</h1>
            <div className="my-buddies">
                {myBuddies &&
                    myBuddies.map((buddy, i) => {
                        return (
                            <div className="buddie-results" key={i}>
                                <Link to={`/user/${buddy.id}`} key={buddy.id}>
                                    <img
                                        key={i}
                                        className="medium"
                                        src={buddy.imgurl || "/default.png"}
                                    />
                                </Link>
                                <h2>
                                    {buddy.firstname} {buddy.lastname}
                                </h2>
                                <button
                                    onClick={() => dispatch(unfriend(buddy.id))}
                                    className="submit-button"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
            </div>

            {myWannaBuddies &&
                myWannaBuddies.map((user, i) => {
                    return (
                        <div key={i}>
                            <h1 style={{ textAlign: "center" }}>Pending</h1>
                            <div className="my-buddies">
                                <div className="buddie-results" key={user}>
                                    <Link to={`/user/${user.id}`} key={user.id}>
                                        <img
                                            key={user}
                                            className="medium"
                                            src={user.imgurl || "/default.png"}
                                        />
                                    </Link>
                                    <h2>
                                        {user.firstname} {user.lastname}
                                    </h2>
                                    <button
                                        onClick={() =>
                                            dispatch(acceptFriend(user.id))
                                        }
                                        className="submit-button"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
