
// backend/models/bus.js
const connection = require("../db");

// Get all buses
const getAllBuses = (callback) => {
    connection.query("SELECT * FROM buses", (err, results) => {
        if (err) return callback(err, null);
        results = results.map(bus => ({ ...bus, bookedSeats: JSON.parse(bus.bookedSeats) }));
        callback(null, results);
    });
};

// Add a bus
const addBus = (busData, callback) => {
    const { name, from_city, to_city, price, date, seats, bookedSeats } = busData;
    const sql = "INSERT INTO buses (name, from_city, to_city, price, date, seats, bookedSeats) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [name, from_city, to_city, price, date, seats || 40, JSON.stringify(bookedSeats || [])];
    connection.query(sql, values, (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// Update booked seats
const updateBookedSeats = (id, bookedSeats, callback) => {
    const sql = "UPDATE buses SET bookedSeats=? WHERE id=?";
    connection.query(sql, [JSON.stringify(bookedSeats), id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

module.exports = { getAllBuses, addBus, updateBookedSeats };
