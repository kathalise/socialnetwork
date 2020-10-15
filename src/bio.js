import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditingMode: false,
            bio: this.props.bio,
        };
    }

    componentDidMount() {
        console.log("Bio Editor mounted");
    }

    handleChange(e) {
        console.log("this.state: ", this.state);
        console.log("e.target.value: ", e.target.value);
        this.setState({
            bio: e.target.value,
        });
    }

    submitChanges() {
        console.log("SAVE clicked", this.state);
        const bio = this.state.bio;
        axios
            .post("/updatebio", { bio })
            .then(({ data }) => {
                const bio = data;
                console.log("inside THEN / updatebio");
                this.props.updateBio(bio);
                this.setState({
                    bioEditingMode: !this.state.bioEditingMode,
                });
            })
            .catch((err) => {
                console.log("Err in submitChanges / POST bio", err);
            });
    }

    // enable Editing mode of Bio
    bioEditingModeOn() {
        console.log("bioEditingMode is On");
        this.setState({ bioEditingMode: !this.state.bioEditingMode });
    }

    render() {
        let elem;
        if (this.state.bioEditingMode) {
            elem = (
                <>
                    <textarea
                        cols="38"
                        rows="4"
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                        placeholder="Add a bio ✍️"
                    ></textarea>
                    <div className="bio-buttons">
                        <button
                            onClick={() => this.bioEditingModeOn()}
                            className="submit-button"
                        >
                            Cancel
                        </button>
                        <button
                            className="submit-button"
                            onClick={() => this.submitChanges()}
                        >
                            Save
                        </button>
                    </div>
                </>
            );
        } else if (!this.state.bioEditingMode) {
            if (this.props.bio) {
                elem = (
                    <div className="add-bio">
                        <p>{this.props.bio}</p>
                        <button
                            onClick={() => this.bioEditingModeOn()}
                            className="submit-button bio"
                            style={{ width: "150px" }}
                        >
                            Edit Bio
                        </button>
                    </div>
                );
            } else {
                //no bio
                elem = (
                    <div className="add-bio">
                        {/* <p>There is no bio...</p> */}
                        <button
                            onClick={() => this.bioEditingModeOn()}
                            className="submit-button"
                            style={{ width: "150px" }}
                        >
                            Add bio
                        </button>
                    </div>
                );
            }
        }

        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Please try again.
                    </div>
                )}
                {elem}
            </div>
        );
    }
}
