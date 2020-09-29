const express = require("express");
const app = express();
const compression = require("compression");
const { compare, hash } = require("./bcrypt.js");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
// const csurf = require("csurf");
const db = require("./db.js");
const secrets = require("./secrets");

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());

app.use(
    cookieSession({
        secret: `${secrets.sessionSecret}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(
    express.urlencoded({
        extended: false,
    })
);

/////////////////////////////////////
// app.use(csurf());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

////////////////////////////////////////////////
/* ----------------  WELCOME  --------------- */
////////////////////////////////////////////////

app.get("/welcome", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

////////////////////////////////////////////////
/* ---------------  REGISTER  --------------- */
////////////////////////////////////////////////

app.post("/register", (req, res) => {
    console.log("user info, req.body: ", req.body);
    const { firstname, lastname, email } = req.body;
    const plainPassword = req.body.password;

    if (!firstname || !lastname || !email || !plainPassword) {
        console.log("Missing input!");
    } else {
        hash(plainPassword).then((password) => {
            console.log("plainPassword got hashed -> : ", password);
        });
    }
});

// app.get("/welcome", function (req, res) {
//     console.log("WELCOME", res);
//     //if user is logged in
//     if (req.session.userId) {
//         res.redirect("/");
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });

// ////////// * - ROUTE needs to be the VERY LAST ROUTE // EVERYTHING ELSE GOES ABOVE /////////
// app.get("*", function (req, res) {
//     console.log("WELCOME to *", res);
//     // if user is logged out redirect to welcome
//     if (!req.session.userId) {
//         res.redirect("/welcome");
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });

app.listen(8080, function () {
    console.log("I'm listening on 8080.");
});
