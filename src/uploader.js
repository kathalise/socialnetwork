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

    uploadingFile({ target }) {
        console.log("uploadingFile target: ", { target });
        console.log("uploadingFile target: ", target.files[0]);
        const profilePic = target.files[0];
        let formData = new FormData();
        console.log("formData: ", formData);
        formData.append("file", profilePic);

        ////////////////////////////////////////////////
        ////////////////////////////////////////////////
        // WHY IS IMAGE NOT SHOWING WITHOUT REFRESH ? //
        ////////////////////////////////////////////////
        ////////////////////////////////////////////////

        axios
            .post("/uploadProfilepic", formData)
            .then(({ data }) => {
                console.log("data: ", data);
                const imgUrl = data;
                this.getImageWithoutRefresh(imgUrl);
                this.closeMe();
            })
            .catch((err) => {
                console.log("err in POST /uploadProfilepic", err);
            });
    }

    closeMe() {
        console.log("x clicked");
        this.props.closeUploader();
    }

    ////////////////////////////////////////////////
    ////////////////////////////////////////////////
    //////////// check THIS function  //////////////
    ////////////////////////////////////////////////
    ////////////////////////////////////////////////

    getImageWithoutRefresh(imgUrl) {
        console.log("Image went through", imgUrl);
        this.props.uploadImage(imgUrl);
    }

    render() {
        return (
            <div className="uploader-container">
                <h2 className="closeX" onClick={() => this.closeMe()}>
                    x
                </h2>
                <h2>Select A Profile Picture</h2>

                <input
                    onChange={(e) => this.uploadingFile(e)}
                    className="ugly-input"
                    type="file"
                    name="file"
                    accept="image/*"
                ></input>
            </div>
        );
    }
}
