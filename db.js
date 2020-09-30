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

// ------------------- password_reset_codes table ------------------- //

module.exports.addResetCode = (email, code) => {
    const q = `INSERT INTO password_reset_codes (email, code) 
    VALUES ($1, $2) RETURNING id`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.compareCode = (email) => {
    const q = `SELECT code FROM password_reset_codes 
    WHERE 
    email = $1 
    AND 
    CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' 
    ORDER BY id DESC
    LIMIT 1`;
    const params = [email];
    return db.query(q, params);
};
