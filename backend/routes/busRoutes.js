
// backend/routes/busRoutes.js
const express = require("express");
const connection = require("../db");

const router = express.Router();

// GET all buses
router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM buses");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// SEARCH buses
router.post("/search", async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) return res.status(400).json({ message: "Please provide both from and to" });

  try {
    const [rows] = await connection.query(
      "SELECT * FROM buses WHERE from_city LIKE ? AND to_city LIKE ?",
      [`%${from}%`, `%${to}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET bus by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM buses WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Bus not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET booked seats for a bus
router.get("/:id/seats", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT bookedSeats FROM buses WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Bus not found" });
    const seats = rows[0].bookedSeats ? JSON.parse(rows[0].bookedSeats) : [];
    res.json({ seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// BOOK seats
router.post("/:id/book", async (req, res) => {
  const { seats } = req.body;
  const busId = req.params.id;

  if (!seats || seats.length === 0) return res.status(400).json({ message: "No seats selected" });

  try {
    // Get current booked seats and price
    const [rows] = await connection.query("SELECT bookedSeats, price FROM buses WHERE id = ?", [busId]);
    if (rows.length === 0) return res.status(404).json({ message: "Bus not found" });

    const bookedSeats = rows[0].bookedSeats ? JSON.parse(rows[0].bookedSeats) : [];
    const pricePerSeat = rows[0].price;

    // Check conflicts
    const alreadyBooked = seats.some(s => bookedSeats.includes(s));
    if (alreadyBooked) return res.status(400).json({ message: "Some seats already booked!" });

    // Update booked seats
    const newBookedSeats = [...bookedSeats, ...seats];
    await connection.query("UPDATE buses SET bookedSeats = ? WHERE id = ?", [JSON.stringify(newBookedSeats), busId]);

    // Insert into bookings table
    const totalPrice = seats.length * pricePerSeat;
    await connection.query("INSERT INTO bookings (bus_id, seats, total_price) VALUES (?, ?, ?)", [busId, JSON.stringify(seats), totalPrice]);

    res.json({ message: "Seats booked successfully", bookedSeats: newBookedSeats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
