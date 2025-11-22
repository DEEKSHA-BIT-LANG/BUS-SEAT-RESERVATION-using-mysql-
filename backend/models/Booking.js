
// backend/models/booking.js
const connection = require("../db");

// Get all bookings
const getAllBookings = (callback) => {
    connection.query("SELECT * FROM bookings", (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// Add booking
const addBooking = (bookingData, callback) => {
    const { busId, userName, seatsBooked, date } = bookingData;
    const sql = "INSERT INTO bookings (busId, userName, seatsBooked, date) VALUES (?, ?, ?, ?)";
    connection.query(sql, [busId, userName, seatsBooked, date], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Update booking
const updateBooking = (id, bookingData, callback) => {
    const { busId, userName, seatsBooked, date } = bookingData;
    const sql = "UPDATE bookings SET busId=?, userName=?, seatsBooked=?, date=? WHERE id=?";
    connection.query(sql, [busId, userName, seatsBooked, date, id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Delete booking
const deleteBooking = (id, callback) => {
    connection.query("DELETE FROM bookings WHERE id=?", [id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

module.exports = { getAllBookings, addBooking, updateBooking, deleteBooking };
