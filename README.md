# booking_system
Restaurant booking system using AWS , S3 cloudfront , Amazon lightsail VPS amazon linux 2023 , Node js 

# Backend Node.js-server.js
### Install Required Dependencies
```bash
cd booking-server
npm init -y
npm install express nodemailer cors body-parser dotenv
npm install -g pm2
```
#### verify the installation
```bash
pm2 -v
```

# Step 3: Check if Your Backend is Running
### Check if the server is running 
```bash
pm2 list
```
### If booking-server is not running, start it:
```bash
pm2 restart booking-server
```
### If it’s not listed, start the server manually:
```bash
cd ~/booking-server
node server.js
```
### OR use PM2 for persistent running:
```bash
pm2 start server.js --name booking-server
pm2 save
pm2 restart booking-server
```
## Check for server log errors
```bash
pm2 logs booking-server
```
# Step 4: Test API Endpoint Manually
```bash
curl -X POST "https://api.bluebengal-carshalton.co.uk/create-booking" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890","date":"2025-02-25","time":"19:30","guests":"2","status":"Pending"}'
```
# Install Local MongoDB (On VPS)
### To install MongoDB on AWS Lightsail (Amazon Linux 2023):


  
#### Create server.js
```bash
nano server.js

```
#### Paste the following Node.js code 
```bash
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Microsoft 365 SMTP Configuration
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: "SSLv3"
    }
});

// API Endpoint to Send Booking Email
app.post('/send-booking-email', (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "info@bluebengal-carshalton.co.uk",
        subject: "New Table Booking - Blue Bengal Carshalton",
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### Update .env
```bash
nano env
```
#### Paste 
```bash
EMAIL_USER=info@bluebengal-carshalton.co.uk
EMAIL_PASS=your-microsoft-365-app-password
```
#### Restart server

```bash
pm2 restart booking-server
```



#  Step 1: Check the API URL in script.js
### Make sure the correct API endpoint is used in your script.js:
```bash
let response = await fetch("https://api.bluebengal-carshalton.co.uk/create-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, date, time, guests, status: "Pending" })
});
```
### If unsure, replace with your Lightsail public IP:
```bash
let response = await fetch("http://13.43.107.188:5000/create-booking", { ... });

```

#  Step 2: Debug Using Browser Developer Tools
### Open Developer Tools (F12 or Ctrl + Shift + I)
### Go to the "Console" tab
### Go to the "Network" tab → Click "Fetch/XHR" → Look for the failed request
### Check the "Response" tab (If it says 500 Server Error, the backend has issues)

