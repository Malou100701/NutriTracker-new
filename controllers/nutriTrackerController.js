const NutriTracker = require('../models/NutriTracker');
const User = require('../models/User'); // For BMR
const asyncHandler = require('../middlewares/asyncHandler');
const { get } = require('../routes/mealRoutes');

const calculateBMR = async (UserID) => {
    return await User.BMR(UserID);
  };


const combinedTrackerView = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const calorieIntake = await NutriTracker.getCalorieIntakeLast30Days(UserID);
    const caloriesBurned = await NutriTracker.getCaloriesBurnedLast30Days(UserID);
    const totalWater = await NutriTracker.getWaterLast30Days(UserID)
    const BMR = await calculateBMR(UserID);

    // Combine both datasets
    let dailyData = [];
    for (let i = 0; i < 30; i++) {
        dailyData.push({
            date: calorieIntake[i].Date || caloriesBurned[i].Date, // Assuming both have the same length and dates aligned
            intake: calorieIntake[i].DailyCalorieIntake || 0,
            burned: caloriesBurned[i].DailyCaloriesBurned + BMR || 0,
            balance: (calorieIntake[i].DailyCalorieIntake || 0) - (caloriesBurned[i].DailyCaloriesBurned + BMR || 0),
            totalWater: totalWater[i].TotalWater
        });
    }

    res.render('pages/nutritracker', { dailyData: dailyData }); // the name of your EJS file
});



const displayHourlyCalories = asyncHandler(async (req, res) => {
    const userID = req.session.user.userID;
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const BMR = await calculateBMR(userID); // Assuming a function to calculate BMR is available

    const caloriesIntake = await NutriTracker.getCaloriesIntakePerHourToday(userID, today);
    const caloriesBurned = await NutriTracker.getCaloriesBurnedPerHourToday(userID, BMR);
    const waterIntake = await NutriTracker.getWaterPerHourToday(userID, today); // This should return an array of objects with `Hour` and `TotalWater`

    // Map through calories intake data, which is assumed to be synchronous with calories burned and water intake data
    const hourlyBalance = caloriesIntake.map((intake, index) => {
        const water = (waterIntake[index] && waterIntake[index].TotalWater) ? waterIntake[index].TotalWater : 0; // Safely handle missing water data
        const burned = (caloriesBurned[index] && caloriesBurned[index].Calories) ? caloriesBurned[index].Calories : BMR / 24;

        const hourData = {
            hour: intake.Hour, // Assuming each array is properly indexed by hour
            intake: intake.Calories,
            burned: burned,
            balance: intake.Calories - burned,
            totalWater: water
        };
        return hourData;
    });

    res.render('pages/nutritrackertimer', { hourlyData: hourlyBalance });
});



module.exports = {
    // nutriTrackerViewkCal,
    displayHourlyCalories,
    combinedTrackerView
};