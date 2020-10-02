import React from "react";

export default function ProfilePic({
    firstname,
    lastname,
    imgUrl,
    toggleUploader,
}) {
    return (
        <>
            <h2>Hey {firstname}, glad to see you around!</h2>
            <img
                onClick={toggleUploader}
                className="small"
                src={imgUrl}
                alt={`${firstname} ${lastname}`}
            />
        </>
    );
}
