const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/masala-socialnetwork"
);

// ------------------- users table ------------------- //

module.exports.addUser = (firstname, lastname, email, password) => {
    const q = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) 
    RETURNING id`;

    const params = [firstname, lastname, email, password];
    return db.query(q, params);
};

module.exports.loginUser = (email) => {
    const q = `SELECT password, id FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserInfo = (id) => {
    const q = `SELECT * FROM users WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.uploadProfilePic = (imgUrl, id) => {
    const q = `UPDATE users SET imgUrl = $1 WHERE id = $2 RETURNING imgUrl`;
    const params = [imgUrl, id];
    return db.query(q, params);
};

module.exports.addNewPassword = (email, password) => {
    const q = `UPDATE users SET password=$2 WHERE email=$1 RETURNING *`;
    const params = [email, password];
    return db.query(q, params);
};

module.exports.addBio = (id, bio) => {
    const q = `UPDATE users SET bio=$2 WHERE id=$1 RETURNING bio`;
    const params = [bio, id];
    return db.query(q, params);
};

module.exports.getMostRecent = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.getUserSearch = (userInput) => {
    const q = `SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1`;
    const params = [userInput + "%"];
    return db.query(q, params);
};

// ------------------- password_reset_codes table ------------------- //

module.exports.addResetCode = (email, code) => {
    const q = `INSERT INTO password_reset_codes (email, code) 
    VALUES ($1, $2) RETURNING id`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getCode = (email) => {
    const q = `SELECT code FROM password_reset_codes WHERE email=$1 AND 
    CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' 
    ORDER BY created_at DESC
    LIMIT 1`;
    const params = [email];
    return db.query(q, params);
};

// ---------------------------- friendships ------------------------ //
module.exports.getFriendshipStatus = (otherId, id) => {
    const q = `SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [otherId, id];
    return db.query(q, params);
};

module.exports.addFriend = (id, otherId) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id) 
    VALUES ($1, $2) RETURNING *`;
    const params = [id, otherId];
    return db.query(q, params);
};

module.exports.acceptFriendRequest = (otherId, id) => {
    const q = `UPDATE friendships SET accepted = true
    WHERE recipient_id = $1 AND sender_id = $2 
    OR recipient_id = $2 AND sender_id = $1 RETURNING *`;
    const params = [otherId, id];
    return db.query(q, params);
};

module.exports.endFriendship = (otherId, id) => {
    const q = `DELETE FROM friendships
    WHERE recipient_id = $1 AND sender_id = $2 
    OR recipient_id = $2 AND sender_id = $1 RETURNING *`;
    const params = [otherId, id];
    return db.query(q, params);
};

module.exports.getFriends = (id) => {
    const q = `SELECT users.id, users.firstname, users.lastname, users.imgUrl, accepted
    FROM friendships 
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};
