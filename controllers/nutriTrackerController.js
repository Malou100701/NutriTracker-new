const NutriTracker = require('../models/NutriTracker');
const asyncHandler = require('../middlewares/asyncHandler');



// Virker ikke, men skal hente for de sidste 30 dage
const nutriTrackerViewkCal = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const dailyIntakes = await NutriTracker.nutriTrackerView(UserID);
    console.log('Daily Intakes:', dailyIntakes);
    res.status(200).json({ success: true, message: "NutriTracker fetched for last 30 days", dailyIntakes });
    // res.render('pages/nutriTracker',
});

const combinedTrackerView = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const calorieIntake = await NutriTracker.getCalorieIntakeLast30Days(UserID);
    const caloriesBurned = await NutriTracker.getCaloriesBurnedLast30Days(UserID);
    console.log('Calorie Intake and Burned:', { calorieIntake, caloriesBurned });
    res.status(200).json({ success: true, message: "Tracker fetched for last 30 days", calorieIntake, caloriesBurned });
});


// Virker med fixed date
// const nutriTrackerView = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const date = "2024-05-06" // Fixed date for now
//     const nutriTracker = await NutriTracker.nutriTrackerView(UserID, date);
//     console.log('NutriTracker in controller:', { nutriTracker });
//     res.status(200).json({ success: true, message: "NutriTracker fetched", nutriTracker: nutriTracker });
//     // res.render('pages/nutriTracker', { user: req.session.user, nutriTracker: nutriTracker });
// });

module.exports = {
    nutriTrackerViewkCal,
    combinedTrackerView
};