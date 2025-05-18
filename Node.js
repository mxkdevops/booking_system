require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Email Transporter (Use Gmail, AWS SES, or SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Endpoint to Handle Bookings
app.post('/send-booking-email', (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "info@bluebengal-carshalton.co.uk",
        subject: "New Booking Request - Blue Bengal Carshalton",
        html: `
            <h3>New Booking Request</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${guests}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ message: "Failed to send email" });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Booking email sent successfully" });
        }
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
