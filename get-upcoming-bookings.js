app.get("/get-upcoming-bookings", async (req, res) => {
    try {
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        nextWeek.setHours(23, 59, 59, 999);

        // Convert to string format used in MongoDB
        let todayStr = today.toISOString().split("T")[0];
        let nextWeekStr = nextWeek.toISOString().split("T")[0];

        console.log(`Fetching bookings from ${todayStr} to ${nextWeekStr}`);

        let upcomingBookings = await BookingModel.find({
            date: { $gte: todayStr, $lte: nextWeekStr }
        }).sort({ date: 1, time: 1 });

        res.json({ success: true, data: upcomingBookings });
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
