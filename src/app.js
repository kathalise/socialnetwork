import React from "react";
import Logo from "./logo.js";
import Uploader from "./uploader.js";
import axios from "./axios.js";
import ProfilePic from "./profilepic.js";

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
    }

    componentDidMount() {
        console.log("App just mounted");
        // this is a good place fot axios
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data: ", data);
                this.setState({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    imgUrl: data.imgurl,
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
        console.log("profilepic was hit");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    uploadImage(imgUrl) {
        this.setState({
            imgUrl: imgUrl,
        });
        // this.setState({
        //     uploaderIsVisible: !this.state.uploaderIsVisible,
        // });
    }

    closeUploader() {
        console.log("Uploader Gone");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    render() {
        return (
            <div>
                <header>
                    <Logo />
                    <ProfilePic
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        imgUrl={this.state.imgUrl || "./default.png"}
                        toggleUploader={this.toggleUploader}
                    />
                </header>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        uploadImage={() => this.uploadImage()}
                        closeUploader={() => this.closeUploader()}
                    />
                )}
            </div>
        );
    }
}
