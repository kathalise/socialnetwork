import React from "react";
import Logo from "./logo.js";
import Uploader from "./uploader.js";
import axios from "./axios.js";
import ProfilePic from "./profilepic.js";
import BackgroundImagePage from "./background.js";
import Profile from "./profile.js";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile.js";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Nav from "./nav";

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            imgUrl: null,
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.updateBio = this.updateBio.bind(this);
        console.log("this: ", this);
    }

    componentDidMount() {
        // console.log("App just mounted");
        // this is a good place fot axios
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("{ data }: ", { data });
                // console.log(" data: ", data);

                this.setState({
                    id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    imgUrl: data.imgurl,
                    bio: data.bio,
                });
            })
            .catch((err) => {
                console.log("Err in axios GET / user", err);
                this.setState({
                    error: "Oops! There was an error.",
                });
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    // Image upload without refresh + uploader closes by itself
    uploadImage(argument) {
        this.setState({ imgUrl: argument });
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    closeUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateBio(updateMyBio) {
        this.setState({
            bio: updateMyBio,
        });
    }

    render() {
        // Loading .... time for some spinner
        if (!this.state.id) {
            console.log("Pending.....");
            return null;
        }
        return (
            <BrowserRouter>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong.<br></br>
                        Please try again.
                    </div>
                )}

                <header>
                    <div>
                        <div className="nav">
                            <Nav />
                        </div>
                    </div>
                    <div className="icons">
                        <Logo />

                        <h2>Hey {this.state.firstname}, welcome home!</h2>

                        <ProfilePic
                            firstname={this.state.firstname}
                            lastname={this.state.lastname}
                            imgUrl={this.state.imgUrl || "/default.png"}
                            toggleUploader={this.toggleUploader}
                            imgClassName="small"
                        />
                    </div>
                </header>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Profile
                            id={this.state.id}
                            firstname={this.state.firstname}
                            lastname={this.state.lastname}
                            imgUrl={this.state.imgUrl || "/default.png"}
                            toggleUploader={this.toggleUploader}
                            bio={this.state.bio}
                            updateBio={this.updateBio}
                        />
                    )}
                />
                <Route
                    path="/user/:otherId"
                    render={(props) => (
                        <OtherProfile
                            key={props.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
                <Route path="/users" render={() => <FindPeople />} />
                <Route path="/buddies" render={() => <Friends />} />
                {/* <BackgroundImagePage /> */}
                {this.state.uploaderIsVisible && (
                    <Uploader
                        uploadImage={this.uploadImage}
                        closeUploader={this.closeUploader}
                    />
                )}
                {/* <footer>
                    <p> ++++~~~~~~~~+++++ Footer ++++~~~~~~~~+++++ </p>
                </footer> */}
            </BrowserRouter>
        );
    }
}

////////////////////////////////////////////////
//////////// check THIS function ↓ /////////////
////////////////////////////////////////////////
