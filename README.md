# booking_system
Restaurant booking system using AWS , S3 cloudfront , Amazon lightsail VPS amazon linux 2023 , Node js 

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





