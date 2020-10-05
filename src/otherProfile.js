import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        // console.log("this.props.match: ", this.props.match);
        // console.log(
        //     "the user we want to look at has the id: ",
        //     this.props.match.params.otherId
        // );

        const otherId = this.props.match.params.otherId;
        axios
            .get(`/visit/user/${otherId}`)
            .then(({ data }) => {
                // console.log("inside axios GET", data);

                if (data.same) {
                    this.props.history.push("/");
                    console.log("Logged in user SAME as visited");
                } else if (data.noUserId) {
                    console.log("NO SUCH USER!!!");
                    this.setState({
                        noUserId: true,
                    });
                } else {
                    console.log("loggedIn visiting another user");
                    this.setState({
                        id: data.id,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        imgUrl: data.imgurl,
                        bio: data.bio,
                    });
                }
            })
            .catch((err) => {
                console.log("Err in GET /user/:otherId", err);
            });

        ////////////////////////////////////////////////
        //////////// check THIS function ↓ /////////////
        ////////////////////////////////////////////////
    }

    render() {
        if (this.state.noUserId) {
            return (
                <div className="bio-container">
                    <img
                        className="large"
                        src="/default.png"
                        alt="Default Image"
                    />
                    <h1>Oops.. seems like this user does not exist!</h1>
                </div>
            );
        } else {
            return (
                <div className="bio-container">
                    <img
                        className="large"
                        src={this.state.imgUrl || "/default.png"}
                        alt={`${this.state.firstname} ${this.state.lastname}`}
                    />

                    <div className="bio-frame">
                        <h1>
                            {this.state.firstname} {this.state.lastname}
                        </h1>
                        {this.state.bio}
                    </div>
                </div>
            );
        }
    }
}