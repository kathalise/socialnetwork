import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("Uploader mounted");
    }

    uploadingFile() {
        const profilePic = this.state.file;
        let formData = new FormData();
        console.log("formData: ", formData);
        formData.append("file", profilePic);

        axios
            .post("/uploadProfilepic", formData)
            .then(({ data }) => {
                console.log("data: ", data);
                const imgUrl = data;
                // console.log("WHAT IS imgUrl?: ", imgUrl);
                this.props.uploadImage(imgUrl);
                // console.log("this ", this);
            })
            .catch((err) => {
                console.log("err in POST /uploadProfilepic", err);
            });
    }
    handleChange(e) {
        console.log("file: ", e.target.files[0]);
        this.setState({
            file: e.target.files[0],
        });
    }

    closeMe() {
        console.log("x clicked");
        this.props.closeUploader();
    }

    render() {
        return (
            <>
                <div className="uploader">
                    <h2 className="closeX" onClick={() => this.closeMe()}>
                        x
                    </h2>
                    <h2>Update Profile Picture</h2>

                    <input
                        onChange={(e) => this.handleChange(e)}
                        className="ugly-input"
                        type="file"
                        name="file"
                        accept="image/*"
                    ></input>
                    <button
                        className="submit-button"
                        onClick={() => this.uploadingFile()}
                    >
                        Save
                    </button>
                </div>
                <div className="overlay"></div>
            </>
        );
    }
}
