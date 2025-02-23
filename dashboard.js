
//Fetch todays booking 

document.addEventListener("DOMContentLoaded", function () {
    filterToday(); // Load today's bookings by default
});

// Fetch All Bookings
async function fetchAllBookings() {
    try {
        let response = await fetch("https://api.bluebengal-carshalton.co.uk/get-all-bookings");
        let data = await response.json();
        updateTable(data.data);
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        alert("Failed to fetch all bookings.");
    }
}


// Fetch Bookings for a Specific Date
async function fetchBookings() {
    let selectedDate = document.getElementById("filterDate").value;
    try {
        let response = await fetch(`https://api.bluebengal-carshalton.co.uk/get-bookings?date=${selectedDate}`);
        let data = await response.json();
        updateTable(data.data);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Failed to fetch bookings for the selected date.");
    }
}

// Fetch Today's Bookings
async function filterToday() {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("filterDate").value = today;
    fetchBookings();
}

// Fetch Tomorrow's Bookings
async function filterTomorrow() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById("filterDate").value = tomorrow.toISOString().split("T")[0];
    fetchBookings();
}

// Fetch Upcoming Bookings
async function filterUpcoming() {
    try {
        let response = await fetch("https://api.bluebengal-carshalton.co.uk/get-upcoming-bookings");
        let data = await response.json();
        updateTable(data.data);
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        alert("Failed to fetch upcoming bookings.");
    }
}



// Update the Booking Table
function updateTable(bookings) {
    let tableBody = document.getElementById("bookingTable");
    tableBody.innerHTML = ""; // Clear existing table

    if (!bookings || bookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" class="text-center text-warning">No bookings found</td></tr>`;
        return;
    }

    bookings.forEach(booking => {
        let row = `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.guests}</td>
                <td class="status ${booking.status.toLowerCase()}">${booking.status}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="updateStatus('${booking.bookingId}', 'Confirmed')">✔ Confirm</button>
                    <button class="btn btn-danger btn-sm" onclick="updateStatus('${booking.bookingId}', 'Cancelled')">❌ Cancel</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Update Booking Status
async function updateStatus(bookingId, status) {
    try {
        let response = await fetch("https://api.bluebengal-carshalton.co.uk/update-booking-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, status })
        });

        let result = await response.json();
        if (result.success) {
            alert(`Booking ${status}`);
            fetchBookings();
        } else {
            alert("Error updating status: " + result.message);
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update booking status.");
    }
}

// Open Edit Booking Modal
async function openEditModal(bookingId) {
    try {
        let response = await fetch(`https://api.bluebengal-carshalton.co.uk/get-booking?bookingId=${bookingId}`);
        let data = await response.json();

        if (data.success) {
            let booking = data.booking;
            document.getElementById("editBookingId").value = booking.bookingId;
            document.getElementById("editName").value = booking.name;
            document.getElementById("editDate").value = booking.date;
            document.getElementById("editTime").value = booking.time;
            document.getElementById("editGuests").value = booking.guests;

            let modal = new bootstrap.Modal(document.getElementById("editBookingModal"));
            modal.show();
        } else {
            alert("Error fetching booking details: " + data.message);
        }
    } catch (error) {
        console.error("Error loading booking details:", error);
    }
}

// Save Booking Changes
async function saveBookingChanges() {
    let bookingId = document.getElementById("editBookingId").value;
    let updatedBooking = {
        name: document.getElementById("editName").value,
        date: document.getElementById("editDate").value,
        time: document.getElementById("editTime").value,
        guests: document.getElementById("editGuests").value
    };

    try {
        let response = await fetch("https://api.bluebengal-carshalton.co.uk/update-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, ...updatedBooking })
        });

        let result = await response.json();
        if (result.success) {
            alert("Booking updated successfully!");
            fetchAllBookings(); // Refresh the booking table
        } else {
            alert("Update failed: " + result.message);
        }
    } catch (error) {
        console.error("Error updating booking:", error);
    }
}

// Show Create Booking Modal
function showCreateBookingModal() {
    let modal = new bootstrap.Modal(document.getElementById("createBookingModal"));
    modal.show();
}

// Create New Booking
async function createBooking() {
    let newBooking = {
        name: document.getElementById("newName").value,
        date: document.getElementById("newDate").value,
        time: document.getElementById("newTime").value,
        guests: document.getElementById("newGuests").value
    };

    try {
        let response = await fetch("https://api.bluebengal-carshalton.co.uk/create-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBooking)
        });

        let result = await response.json();
        if (result.success) {
            alert("Booking created successfully!");
            fetchAllBookings();
        } else {
            alert("Error creating booking: " + result.message);
        }
    } catch (error) {
        console.error("Error creating booking:", error);
    }
}

// Search Booking
function searchBooking() {
    let input = document.getElementById("searchBooking").value.toUpperCase();
    let rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {
        let bookingId = row.getElementsByTagName("td")[0]?.textContent.toUpperCase();
        if (bookingId.includes(input) || input === "") {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
