# booking_system
Restaurant booking system using AWS , S3 cloudfront , Amazon lightsail VPS amazon linux 2023 , Node js , NGinx 

## Deploy Node.js Backend on AWS Lightsail
Your Lightsail VPS acts as a server to send emails using Nodemailer.

### Connect to Your AWS Lightsail VPS
Go to AWS Lightsail Console → Instances
Click on your VPS instance
Click Connect using SSH (or use PuTTY if connecting via Windows)

## Install Node.js and Required Packages
Run the following commands to install Node.js (if not installed) and set up the server:
# Update the system
sudo dnf update -y

# Enable Node.js 18 LTS (Amazon Linux provides this version)
sudo dnf install -y nodejs npm

# Verify Node.js and npm installation
node -v
npm -v

Now, create a project directory:
mkdir booking-server && cd booking-server
npm init -y
npm install express nodemailer cors body-parser dotenv

## Create the Booking Email Server
inside the booking-server directory, create a file server.js:
nano server.js
Paste the following Node.js server code: Node.js
https://github.com/mxkdevops/booking_system/blob/main/Node.js
Save the file (CTRL + X, then Y, then ENTER).

## Set Up Environment Variables (.env)
Create a .env file to store email credentials securely:
nano .env
Paste the following and replace with your email credentials:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password-or-app-password
Save and exit (CTRL + X, then Y, then ENTER).

### Run the Node.js Server
Run the server using:
node server.js
If everything works, you should see:
Server running on port 5000
### Make the Server Run in the Background
To keep it running even after closing SSH, use PM2 (process manager):
# Install PM2
npm install -g pm2

# Start the server
pm2 start server.js --name booking-server

# Make it restart automatically on reboot
pm2 save
pm2 startup

### Configure AWS Lightsail Firewall (Allow Port 5000)
By default, Lightsail blocks custom ports. You must allow port 5000:

Go to AWS Lightsail Console → Networking
Under Firewall rules, click Add rule
Select:
Application: Custom
Protocol: TCP
Port range: 5000
Source: Anywhere (0.0.0.0/0)
Click Save
Now your backend is accessible from the internet.

### Update Frontend (index.html)
Update script.js
let response = await fetch("http://your-lightsail-public-ip:5000/send-booking-email", {

###Test the Booking System
Test the Booking System
Open your website (hosted on S3 & CloudFront).
Submit a booking request.
The restaurant owner (info@bluebengal-carshalton.co.uk) should receive an email.
If there’s an issue, check server logs using: pm2 logs booking-server

✅ Solution: Use Nginx as a Reverse Proxy with SSL
You need to:

Install Nginx on AWS Lightsail.

Set up SSL (Let's Encrypt) for HTTPS.

Configure Nginx to proxy requests to your Node.js server.

### Install Nginx
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

### Configure Nginx Reverse Proxy
sudo nano /etc/nginx/nginx.conf


## ✅ Solution for PM2 Issues

| **Issue** | **Solution** |
|-----------|-------------|
| **`booking-server` Not Found in PM2** | Run `pm2 list` to check if it's running |
| **If Not Running** | Run `pm2 start server.js --name booking-server` |
| **Restart `booking-server`** | Use `pm2 restart booking-server` |
| **Ensure It Auto-Starts on Reboot** | Use `pm2 save` and `pm2 startup` |
| **Check Logs for Errors** | Run `pm2 logs booking-server` |


#### Enconter this error
```bash

pm2 restart booking-server
Use --update-env to update environment variables
[PM2][ERROR] Process or Namespace booking-server not found
```
#### Check if booking-server i running on PM2 
```bash
pm2 list

```
####  If booking-server is Not Running, Start It Again
Start server.js under PM2.
Assign the process name booking-server.

```bash
pm2 start server.js --name booking-server
```
### Restart booking-server Using PM2 
if th eprocess is now listed , restart it with 
```bash
pm2 restart booking-server
```
#### Ensure PM2 running on system start up 

```bash
pm2 save
pm2 startup
```
#### Check PM2 logs for error 
```bash
pm2 logs booking-server
```





#### Find Out What’s Using Port 80
```bash
sudo lsof -i :80
sudo netstat -tulnp | grep :80
sudo ss -tulnp | grep :80
```

#### Kill the process using port 80
If Nginx is already running, it might be stuck. Try stopping it:
```bash
sudo systemctl stop nginx
```
If the process does not stop, manually kill it:
```bash
sudo kill -9 PROCESS_ID
```



### Use Nginx as a Reverse Proxy with SSL
#### Install Nginx on AWS Lightsail.
#### Set up SSL (Let's Encrypt) for HTTPS.
#### Configure Nginx to proxy requests to your Node.js server.

#### Install Nginx
```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx


```
#### Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/nginx.conf
```
#### Replace existing server block with:
```bash
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

#### Save and restart Nginx:
```bash
sudo systemctl restart nginx

```
#### Add HTTPS (Let's Encrypt SSL)
#### To get a free SSL certificate, install Certbot:
```bash
sudo dnf install -y certbot python3-certbot-nginx
```
#### Then request an SSL certificate:
```bash
sudo certbot --nginx -d api.bluebengal-carshalton.co.uk
```
#### Restart Services
```bash
sudo systemctl restart nginx
pm2 restart booking-server
```

 #### Update Frontend to Use HTTPS
#### Modify your JavaScript fetch request (index.html):
 ```bash
let response = await fetch("https://bluebengal-carshalton.co.uk/send-booking-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData)
});

```

#### Fix the Nginx Configuration
```bash
sudo nano /etc/nginx/nginx.conf
```
#### Look for the proxy_pass directive inside your server block.
#### Fix: Add a / at the end of proxy_pass http://127.0.0.1:5000/;
```bash
server {
    listen 80;
    server_name YOUR_LIGHTSAIL_PUBLIC_IP;

    location / {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```
#### Test the Nginx Configuration
```bash
sudo nginx -t
```
#### If the test is successful,
```bash
nginx: configuration file /etc/nginx/nginx.conf test is successful

```
### restat and check logs 
```bash
sudo systemctl restart nginx
sudo journalctl -xeu nginx

```

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

#### Check if Node.js is installed on Lightsail
```bash
node -v
npm -v
```
#### in not installed 
```bash
sudo dnf install -y nodejs npm
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
### Set PM2 to restart on reboot 
```bash
pm2 save
pm2 startup
```
## Check for server log errors
```bash
pm2 logs booking-server
```

### Allow Traffic on Port 5000 (AWS Lightsail Firewall)
```bash
Steps to Allow Port 5000
Go to AWS Lightsail Console → Networking
Under Firewall rules, click "Add Rule"
Select:
Application: Custom
Protocol: TCP
Port range: 5000
Source: Anywhere (0.0.0.0/0)
Click Save

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
#### Test Your Node.js API Through Nginx
```bash
curl http://YOUR_LIGHTSAIL_PUBLIC_IP/
```

#  Step 2: Debug Using Browser Developer Tools
### Open Developer Tools (F12 or Ctrl + Shift + I)
### Go to the "Console" tab
### Go to the "Network" tab → Click "Fetch/XHR" → Look for the failed request
### Check the "Response" tab (If it says 500 Server Error, the backend has issues)


#### server.js
```bash
  GNU nano 5.8                                                   server.js                                                              
app.get("/get-all-bookings", async (req, res) => {

try {

let bookings = await Booking.find().sort({ date: 1, time: 1 });


if (!bookings.length) {

return res.json({ success: false, message: "No bookings found" });

}


res.json({ success: true, data: bookings });

} catch (error) {

console.error("Error fetching all bookings:", error);

res.status(500).json({ success: false, message: "Server error" });

}

});





```
