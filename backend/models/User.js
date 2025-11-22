
// backend/models/user.js
const connection = require("../db");
const bcrypt = require("bcrypt");

// Register user
const registerUser = async (userData, callback) => {
    const { email, password, name } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)";
    connection.query(sql, [email, hashedPassword, name || null], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Login user
const loginUser = (email, password, callback) => {
    connection.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(new Error("User not found"), null);

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return callback(new Error("Invalid password"), null);

        callback(null, { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin });
    });
};

// Get all users
const getAllUsers = (callback) => {
    connection.query("SELECT id, email, name, isAdmin FROM users", (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

module.exports = { registerUser, loginUser, getAllUsers };
