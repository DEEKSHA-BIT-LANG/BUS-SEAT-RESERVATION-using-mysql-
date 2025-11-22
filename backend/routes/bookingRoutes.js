
const express = require("express");
const router = express.Router();
const Bus = require("../models/bus"); // MySQL model

// ======================
// GET all buses
// ======================
router.get("/", (req, res) => {
    Bus.getAllBuses((err, buses) => {
        if (err) return res.status(500).json({ message: "Server error", error: err.message });
        res.json(buses);
    });
});

// ======================
// ADD bus (admin)
// ======================
router.post("/", (req, res) => {
    Bus.addBus(req.body, (err, result) => {
        if (err) return res.status(500).json({ message: "Server error", error: err.message });
        res.json({ message: "Bus added successfully", id: result.insertId });
    });
});

// ======================
// SEARCH buses by from, to, date
// ======================
router.get("/search", (req, res) => {
    const { from, to, date } = req.query;

    let sql = "SELECT * FROM buses WHERE 1=1";
    const values = [];

    if (from) {
        sql += " AND from_city LIKE ?";
        values.push(`%${from}%`);
    }
    if (to) {
        sql += " AND to_city LIKE ?";
        values.push(`%${to}%`);
    }
    if (date) {
        sql += " AND date = ?";
        values.push(date);
    }

    const connection = require("../db");
    connection.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ message: "Server error", error: err.message });
        results = results.map(bus => ({ ...bus, bookedSeats: JSON.parse(bus.bookedSeats) }));
        res.json(results);
    });
});

module.exports = router;
