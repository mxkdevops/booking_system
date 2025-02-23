require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("📦 Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Booking Schema
const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true },
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    guests: Number,
    status: { type: String, default: "Pending" }
});

const Booking = mongoose.model("Booking", bookingSchema);

// ✅ Get Bookings by Date
app.get('/get-bookings', async (req, res) => {
    try {
        let date = req.query.date;
        let bookings = await Booking.find({ date }).sort({ time: 1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get All Bookings
app.get("/get-all-bookings", async (req, res) => {
    try {
        let bookings = await Booking.find().sort({ date: 1, time: 1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Get Upcoming Bookings (Next 7 Days)
app.get("/get-upcoming-bookings", async (req, res) => {
    try {
        let today = new Date().toISOString().split("T")[0];
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        let nextWeekStr = nextWeek.toISOString().split("T")[0];

        let upcomingBookings = await Booking.find({
            date: { $gte: today, $lte: nextWeekStr }
        }).sort({ date: 1, time: 1 });

        res.json({ success: true, data: upcomingBookings });
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ Create a Booking
app.post('/create-booking', async (req, res) => {
    try {
        const { name, email, phone, date, time, guests } = req.body;
        const newBooking = new Booking({
            bookingId: Math.random().toString(36).substr(2, 6).toUpperCase(),
            name, email, phone, date, time, guests, status: "Pending"
        });

        await newBooking.save();
        res.json({ success: true, message: "Booking created", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Update Booking Status
app.post("/update-booking-status", async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        let updatedBooking = await Booking.findOneAndUpdate(
            { bookingId },
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Booking updated successfully", data: updatedBooking });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ Edit Booking Details
app.put("/update-booking/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { name, date, time, guests } = req.body;

        if (!name || !date || !time || !guests) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        let updatedBooking = await Booking.findOneAndUpdate(
            { bookingId },
            { name, date, time, guests },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        res.json({ success: true, message: "Booking updated successfully!", data: updatedBooking });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ Cancel Booking (Set Status to "Cancelled")
app.delete("/cancel-booking/:bookingId", async (req, res) => {
    try {
        let updatedBooking = await Booking.findOneAndUpdate(
            { bookingId: req.params.bookingId },
            { status: "Cancelled" },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        res.json({ success: true, message: "Booking Cancelled!", data: updatedBooking });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ success: false, message: "Error canceling booking." });
    }
});

// ✅ Delete Booking
app.delete('/delete-booking/:bookingId', async (req, res) => {
    try {
        let result = await Booking.findOneAndDelete({ bookingId: req.params.bookingId });

        if (!result) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Booking deleted" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Export Bookings to Excel
app.get('/export-bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find();
        const data = allBookings.map(({ _id, ...rest }) => rest);

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Bookings");

        const filePath = "/tmp/bookings.xlsx";
        xlsx.writeFile(wb, filePath);

        res.download(filePath, "bookings.xlsx");
    } catch (error) {
        console.error("Error exporting bookings:", error);
        res.status(500).json({ success: false, message: "Error exporting bookings" });
    }
});

// ✅ Server Test Route
app.get("/", (req, res) => res.send("✅ Booking API is running!"));

// ✅ Start Server
c
