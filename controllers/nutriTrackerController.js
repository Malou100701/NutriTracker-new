const NutriTracker = require('../models/NutriTracker');
const asyncHandler = require('../middlewares/asyncHandler');



// Virker ikke, men skal hente for de sidste 30 dage
// const nutriTrackerView = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const dailyIntakes = await NutriTracker.nutriTrackerView(UserID);
//     console.log('Daily Intakes:', dailyIntakes);
//     res.status(200).json({ success: true, message: "NutriTracker fetched for last 30 days", dailyIntakes });
//     // res.render('pages/nutriTracker',
// });


// Virker med fixed date
const nutriTrackerView = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const date = "2024-05-07" // Fixed date for now
    const nutriTracker = await NutriTracker.nutriTrackerView(UserID, date);
    console.log('NutriTracker in controller:', { nutriTracker });
    res.status(200).json({ success: true, message: "NutriTracker fetched", nutriTracker: nutriTracker });
    // res.render('pages/nutriTracker', { user: req.session.user, nutriTracker: nutriTracker });
});

module.exports = {
    nutriTrackerView
};