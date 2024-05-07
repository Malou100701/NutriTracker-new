const NutriTracker = require('../models/NutriTracker');
const User = require('../models/User'); // For BMR
const asyncHandler = require('../middlewares/asyncHandler');
const { get } = require('../routes/mealRoutes');



// Virker ikke, men skal hente for de sidste 30 dage
// const nutriTrackerViewkCal = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const dailyIntakes = await NutriTracker.nutriTrackerView(UserID);
//     console.log('Daily Intakes:', dailyIntakes);
//     res.status(200).json({ success: true, message: "NutriTracker fetched for last 30 days", dailyIntakes });
//     // res.render('pages/nutriTracker',
// });
const calculateBMR = async (UserID) => {
    return await User.BMR(UserID);
  };


const combinedTrackerView = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const calorieIntake = await NutriTracker.getCalorieIntakeLast30Days(UserID);
    const caloriesBurned = await NutriTracker.getCaloriesBurnedLast30Days(UserID);
    const BMR = await calculateBMR(UserID);

    // Combine both datasets
    let dailyData = [];
    for (let i = 0; i < 30; i++) {
        dailyData.push({
            date: calorieIntake[i].Date || caloriesBurned[i].Date, // Assuming both have the same length and dates aligned
            intake: calorieIntake[i].DailyCalorieIntake || 0,
            burned: caloriesBurned[i].DailyCaloriesBurned + BMR || 0,
            balance: (calorieIntake[i].DailyCalorieIntake || 0) - (caloriesBurned[i].DailyCaloriesBurned + BMR || 0)
        });
    }

    console.log('Calorie Intake and Burned:', dailyData);
    res.render('pages/nutritracker', { dailyData: dailyData }); // the name of your EJS file
});

// Fungere, men kun med loggede timer
// const displayHourlyCalories = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const caloriesIntake = await NutriTracker.getCaloriesIntakePerHourToday(UserID);
//     const caloriesBurned = await NutriTracker.getCaloriesBurnedPerHourToday(UserID);

//     res.render('pages/nutritrackertimer', {
//         caloriesIntake: caloriesIntake,
//         caloriesBurned: caloriesBurned
//     });
// });


const displayHourlyCalories = asyncHandler(async (req, res) => {
    const userID = req.session.user.userID;
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const BMR = await calculateBMR(userID); // Assuming a function to calculate BMR is available

    const caloriesIntake = await NutriTracker.getCaloriesIntakePerHourToday(userID, today);
    const caloriesBurned = await NutriTracker.getCaloriesBurnedPerHourToday(userID, BMR);

    // Ensure we have data for all 24 hours, even if no activities were logged
    const hourlyBalance = caloriesIntake.map((intake, index) => {
        const hourData = {
            hour: intake.Hour, // or simply index if you want to use the array index for hours
            intake: intake.Calories,
            burned: (caloriesBurned[index] && caloriesBurned[index].Calories) ? caloriesBurned[index].Calories : BMR / 24, // Add BMR/24 if no activity was recorded
            balance: ((caloriesBurned[index] && caloriesBurned[index].Calories) ? caloriesBurned[index].Calories : BMR / 24) - intake.Calories
        };
        return hourData;
    });

    console.log('Hourly balance:', hourlyBalance);

    res.render('pages/nutritrackertimer', { hourlyData: hourlyBalance });
});


// Virker uden front-end
// const combinedTrackerView = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const calorieIntake = await NutriTracker.getCalorieIntakeLast30Days(UserID);
//     const caloriesBurned = await NutriTracker.getCaloriesBurnedLast30Days(UserID);
//     console.log('Calorie Intake and Burned:', { calorieIntake, caloriesBurned });
//     res.status(200).json({ success: true, message: "Tracker fetched for last 30 days", calorieIntake, caloriesBurned });
// });


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
    // nutriTrackerViewkCal,
    displayHourlyCalories,
    combinedTrackerView
};