import React from "react";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bio.js";

export default function Profile({
    firstname,
    lastname,
    imgUrl,
    toggleUploader,
    bio,
    updateBio,
}) {
    return (
        <div className="bio-container">
            <ProfilePic
                imgUrl={imgUrl}
                toggleUploader={toggleUploader}
                imgClassName="large"
            />
            <div className="bio-frame">
                <h1>
                    {firstname} {lastname}
                </h1>
                <BioEditor bio={bio} updateBio={updateBio} />
            </div>
        </div>
    );
}
