import axios from "axios";

var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token", //the csurf middleware checks for this header to validate token information
});

export default instance;
