const express = require("express");
const app = express();
const compression = require("compression");
const { compare, hash } = require("./bcrypt.js");
// const cookieParser = require("cookie-parser");
// const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db.js");
// const secrets = require("./secrets");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const config = require("./config.json");
// const { socket } = require(".socket.js");
// const { IdentityStore } = require("aws-sdk");
// const { Server } = require("tls");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);
// cookie session
// let secrets;
// process.env.NODE_ENV === "production"
//     ? (secrets = process.env)
//     : (secrets = require("./secrets"));
// app.use(
//     cookieSession({
//         secret: `${secrets.sessionSecret}`,
//         maxAge: 1000 * 60 * 60 * 24,
//     })
// );

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

const secrets = require("./secrets.json");
// console.log("My secrets", secrets);
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// cookie Session token protection
app.use(csurf());

app.use(function (req, res, next) {
    console.log("token");
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function (req, res, next) {
    res.set("x-frame-options", "DENY");
    console.log(req.method, req.url);
    next();
});

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

////////////////////////////////////////////////
/* ----------------  WELCOME  --------------- */
////////////////////////////////////////////////

app.get("/welcome", function (req, res) {
    // console.log("in get /welcome: ", req.session);
    //if user is logged in
    if (req.session.userId) {
        console.log("Hallo MerleMerle");
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
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
        res.json({ success: false });
    } else {
        hash(plainPassword).then((password) => {
            console.log("plainPassword got hashed -> : ", password);
            db.addUser(firstname, lastname, email, password)
                .then((result) => {
                    console.log("userId from DB: ", result.rows[0].id);
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error in POST / register addUser", err);
                    res.json({ success: false });
                });
        });
    }
});

////////////////////////////////////////////////
/* -----------------  LOGIN ----------------- */
////////////////////////////////////////////////

app.post("/login", (req, res) => {
    console.log("user info login, req.body: ", req.body);
    const email = req.body.email;
    const plainPassword = req.body.password;

    db.loginUser(email)
        .then((hashedPassword) => {
            const password = hashedPassword.rows[0].password;
            // console.log("password ", password);
            // console.log(
            //     "hashedPassword.rows[0].id ",
            //     hashedPassword.rows[0].id
            // );
            compare(plainPassword, password)
                .then((userExists) => {
                    console.log("userExists: ", userExists);
                    if (userExists) {
                        // console.log("user Exists GO ON!");
                        req.session.userId = hashedPassword.rows[0].id;
                        res.json({ success: true });
                    } else {
                        console.log("Wrong email pw combination!");
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in catch block compare", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err in catch block loginUser", err);
            res.json({ success: false });
        });
});

////////////////////////////////////////////////
/* ------------- RESET PASSWORD ------------- */
////////////////////////////////////////////////

///////////// STEP ONE - post-email ///////////

app.post("/reset-email", (req, res) => {
    console.log("Email for pw reset submitted", req.body);
    const { email } = req.body;
    console.log("email: ", email);
    if (!email) {
        console.log("Wrong E-Mail");
        res.json({ success: false });
    } else {
        console.log("EMAIL IS CORRECT!");
        const resetCode = cryptoRandomString({
            length: 6,
        });
        console.log("resetCode: ", resetCode);

        db.addResetCode(email, resetCode)
            .then(() => {
                console.log("inside addResetCode");
                ses.sendEmail(
                    email,
                    resetCode,
                    "Here's the Code to reset Your Password"
                )
                    .then(() => {
                        console.log("inside send Email");
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("Err in sendEmail", err);
                        res.json({ success: false });
                    });
            })
            .catch((err) => {
                console.log("error in addResetCode", err);
                res.json({ success: false });
            });
    }
});

///////////// STEP TWO - post code + new pw ///////////

app.post("/reset-code", (req, res) => {
    // console.log("inside POST /reset-code: ", req.body);
    const email = req.body.email;
    const code = req.body.code;
    const plainPassword = req.body.password;
    if (!code || !plainPassword) {
        console.log("missing / false input values!");
        res.json({ success: false });
    } else {
        // console.log("ELSE, code pw: ", code, plainPassword);
        db.getCode(email)
            .then((result) => {
                console.log(
                    "Result from DB / get code, result.rows[0].code: ",
                    result.rows[0].code
                );
                if (code == result.rows[0].code) {
                    console.log("Code matches! off to hashing new pw");
                    hash(plainPassword)
                        .then((password) => {
                            db.addNewPassword(email, password)
                                .then(() => {
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log("err", err);
                                });
                        })
                        .catch((err) => {
                            console.log("err in hashing new pw", err);
                        });
                } else {
                    console.log("FAILED CHANGING PW");
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("err in getCode", err);
                res.json({ success: false });
            });
    }
});

////////////////////////////////////////////////
/* --------------   USER PAGE   ------------- */
////////////////////////////////////////////////

app.get("/user", function (req, res) {
    console.log("HELLO USER PAGE! userId: ", req.session.userId);
    const userId = req.session.userId;
    db.getUserInfo(userId)
        .then((result) => {
            // console.log("result: ", result.rows[0]);
            const userInfo = result.rows[0];
            // console.log("UserInfo", userInfo);
            res.json(userInfo);
        })
        .catch((err) => {
            console.log("err in GET /user", err);
        });
});

app.post(
    "/uploadProfilepic",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("INSIDE POST uploadProfilePic: ", req.session);
        const userId = req.session.userId;

        console.log(
            "userId, imgLink: ",
            userId,
            config.s3Url + req.file.filename
        );
        db.uploadProfilePic(config.s3Url + req.file.filename, userId)
            .then((result) => {
                console.log(
                    "Inside uploadProfilePic, result: ",
                    result.rows[0].imgurl
                );
                res.json(result.rows[0].imgurl);
            })
            .catch((err) => {
                console.log("err in uploadProfilePic", err);
            });
    }
);

////////////////////////////////////////////////
/* --------------  EDIT BIO     ------------- */
////////////////////////////////////////////////

app.post("/updatebio", (req, res) => {
    console.log("Inside POST /updatebio", req.body.bio, req.session.userId);
    const myBio = req.body.bio;
    const userId = req.session.userId;

    console.log("myBio, id:", myBio, userId);

    db.addBio(myBio, userId)
        .then((result) => {
            // console.log("inside addBio", result.rows[0].bio);
            res.json(result.rows[0].bio);
        })
        .catch((err) => {
            console.log("err in catch addBio", err);
        });
});

////////////////////////////////////////////////
/* -----------  VISIT OTHER USER  ----------- */
////////////////////////////////////////////////

app.get("/visit/user/:otherId", (req, res) => {
    // console.log(
    //     "INSIDE GET /user/:otherId, Logged in userId:",
    //     req.session.userId
    // );
    // console.log("otherId :", req.params.otherId);
    const userId = req.session.userId;
    const otherId = req.params.otherId;
    if (userId == otherId) {
        // console.log("THE SAME!");
        res.json({ same: true });
    } else {
        db.getUserInfo(otherId)
            .then((result) => {
                if (result.rows[0]) {
                    // console.log("RESULT: ", result.rows[0]);
                    res.json(result.rows[0]);
                } else if (result.rows[0] == undefined) {
                    res.json({ noUserId: true });
                }
            })
            .catch((err) => {
                console.log("Err in getUserInfo(otherId)", err);
            });
    }
});

////////////////////////////////////////////////
/* ---------  MOST RECENT REG   ------------- */
////////////////////////////////////////////////

app.get("/mostrecent/users", async (req, res) => {
    console.log("GETTING RECENT USERS");
    try {
        let { rows } = await db.getMostRecent();
        // console.log("rows: ", rows);
        res.json(rows);
    } catch (err) {
        console.log("err in getMostRecent", err);
    }
});

////////////////////////////////////////////////
/* ----------  SEARCH FOR USER  ------------- */
////////////////////////////////////////////////
app.get("/mostrecent/users/:userInput", async (req, res) => {
    console.log("SEARCHING FOR A USER", req.params.userInput);
    let userInput = req.params.userInput;
    try {
        let { rows } = await db.getUserSearch(userInput);
        // console.log("rows: ", rows);
        res.json(rows);
    } catch (err) {
        console.log("err in getUserSearch", err);
    }
});

////////////////////////////////////////////////
/* ---------  FRIENDSHIP STATUS  ------------ */
////////////////////////////////////////////////

app.get("/friendstatus/:otherId", async (req, res) => {
    console.log("Logged in as: ", req.session.userId);
    console.log("Visiting Profile Id: ", req.params.otherId);
    const otherId = req.params.otherId;
    const userId = req.session.userId;
    try {
        let { rows } = await db.getFriendshipStatus(otherId, userId);
        console.log("in getFriendshipStatus", rows);
        if (rows.length == 0) {
            console.log("NO BUDDIES (anymore / yet)");
            res.json({ textButton: "Add Buddy" });
        } else if (rows[0].accepted == false) {
            if (userId == rows[0].sender_id) {
                res.json({ textButton: "Cancel Your Request" });
            } else {
                res.json({ textButton: "Accept Buddy's Request" });
            }
        } else {
            //meaning: rows[0].accepted == true
            res.json({ textButton: "Remove Buddy" });
        }
    } catch (err) {
        console.log("err", err);
    }
});

app.post("/update-friendstatus", async (req, res) => {
    console.log("req body: ", req.body);
    const otherId = req.body.otherId;
    const userId = req.session.userId;
    const textButton = req.body.textButton;
    try {
        if (textButton == "Add Buddy") {
            await db.addFriend(userId, otherId);
            console.log("inside addFriend");
            res.json({ textButton: "Cancel Your Request" });
        } else if (textButton == "Accept Buddy's Request") {
            await db.acceptFriendRequest(otherId, userId);
            console.log("inside acceptFriendRequest");
            res.json({ textButton: "Remove Buddy" });
        } else if (
            textButton == "Remove Buddy" ||
            textButton == "Cancel Your Request"
        ) {
            await db.endFriendship(otherId, userId);
            console.log("inside endFriendship");
            res.json({ textButton: "Add Buddy" });
        }
    } catch (err) {
        console.log("err in POST /update-friendstatus", err);
    }
});

////////////////////////////////////////////////
/* ---------  FRIENDS & WANNABES ------------ */
////////////////////////////////////////////////

app.get("/get-buddies", async (req, res) => {
    console.log("INSIDE GET /get-buddies: ", req.session.userId);
    const recipientId = req.session.userId;
    try {
        // console.log("in TRY");
        let { rows } = await db.getFriends(recipientId);
        console.log("friends / wannabes : ", rows);
        res.json(rows);
    } catch (err) {
        console.log("err", err);
    }
});

////////////////////////////////////////////////
/* --------------    LOG OUT    ------------- */
////////////////////////////////////////////////

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

////////////////////////////////////////////////
/* --------------- LAST ROUTE --------------- */
/* -------- EVERYTHING ELSE GOES ABOVE------- */
////////////////////////////////////////////////

app.get("*", function (req, res) {
    // if user is logged out redirect to welcome
    if (!req.session.userId) {
        console.log("Hallo Merle");
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening on 8080.");
});

////////////////////////////////////////////////
/* --------------    SOCKET     ------------- */
////////////////////////////////////////////////
io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    console.log(`socket with the id ${socket.id} is now connected`);
    const userId = socket.request.session.userId;

    // now is the time to get the last 10 chat messages
    db.getLastTenChatMessages()
        .then((data) => {
            console.log("data.rows", data.rows[0].firstname);
            // this is the moment we want to emit them to everyone!
            // data or data.rows --- check it out!
            io.sockets.emit("getChatMessages", data.rows);
        })
        .catch((err) => {
            console.log("Error", err);
        });

    socket.on("newChatMessage", (newMessage) => {
        console.log("newMessage", newMessage);
        // send the message out to everyone...
        db.addMessages(userId, newMessage)
            .then((data) => {
                console.log("Data in add Msg: ", data.rows[0]);

                db.getUserChatMessage(userId)
                    .then((userInfo) => {
                        console.log(
                            "inside getUserChat, result: ",
                            userInfo.rows[0]
                        );
                        const brandNewMsg = {
                            ...data.rows[0],
                            ...userInfo.rows[0],
                        };
                        io.sockets.emit("newChatMessage", brandNewMsg);
                    })
                    .catch((err) => {
                        console.log(
                            "Inside Catch block getUserChatMessage",
                            err
                        );
                    });
            })
            .catch((err) => {
                console.log("Error in add Message", err);
            });
    });
});
