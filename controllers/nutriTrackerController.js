const NutriTracker = require('../models/NutriTracker'); // Importerer modellen
const User = require('../models/User'); // Importerer user-modellen, for at kunne bruge BMR-funktionen
const asyncHandler = require('../middlewares/asyncHandler'); // Importerer middleware
const { get } = require('../routes/mealRoutes'); // Importerer middleware

// Udregner BMR for en bruger
const calculateBMR = async (UserID) => {
    return await User.BMR(UserID);
};

// Controller til at vise vand og kalorier brændt og indtaget over de sidste 30 dage, samt balance. Den tager også højde for BMR
const combinedTrackerView = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID; // Henter brugerens ID fra session
    const calorieIntake = await NutriTracker.getCalorieIntakeLast30Days(UserID); // Henter kalorieindtag for de sidste 30 dage
    const caloriesBurned = await NutriTracker.getCaloriesBurnedLast30Days(UserID); // Henter kalorier brændt for de sidste 30 dage
    const totalWater = await NutriTracker.getWaterLast30Days(UserID) // Henter vandindtag for de sidste 30 dage
    const BMR = await calculateBMR(UserID); // Udregner BMR for brugeren

    // Kombinerer data fra de fire kilder til et samlet array
    // Vi henter dato fra både intake og burned, da vi gerne ville kontrollere at de passede sammen, men vi bruger kun den ene i viewet
    let dailyData = [];
    for (let i = 0; i < 30; i++) { // Går igennem data for hver dag
        dailyData.push({ // Tilføjer data for dagen til det samlede array
            date: calorieIntake[i].Date || caloriesBurned[i].Date,
            intake: calorieIntake[i].DailyCalorieIntake || 0,
            burned: caloriesBurned[i].DailyCaloriesBurned + BMR || 0,
            balance: (calorieIntake[i].DailyCalorieIntake || 0) - (caloriesBurned[i].DailyCaloriesBurned + BMR || 0),
            totalWater: totalWater[i].TotalWater
        });
    }
    res.render('pages/nutritracker', { dailyData: dailyData }); // Sender data til viewet
});

// Controller til at vise kalorier brændt og indtaget per time i dag, samt vandindtag. Den tager også højde for BMR
const displayHourlyCalories = asyncHandler(async (req, res) => {
    const userID = req.session.user.userID; // Henter brugerens ID fra session
    const today = new Date().toISOString().slice(0, 10); // Henter dagens dato
    const BMR = await calculateBMR(userID); // Udregner BMR for brugeren

    // De henter alle 'Hour', så vi kunne være sikre på at de passede sammen, selvom vi kun bruger timerne fra den ene
    const caloriesIntake = await NutriTracker.getCaloriesIntakePerHourToday(userID, today); // Returnerer et array af objekter med `Hour` og `Calories`
    const caloriesBurned = await NutriTracker.getCaloriesBurnedPerHourToday(userID, BMR); // Returnerer et array af objekter med `Hour` og `Calories`
    const waterIntake = await NutriTracker.getWaterPerHourToday(userID, today); // Returnerer et array af objekter med `Hour` og `TotalWater`

    // Samler data for hver time i dag
    const hourlyBalance = caloriesIntake.map((intake, index) => { // Går igennem data for hver time
        const water = (waterIntake[index] && waterIntake[index].TotalWater) ? waterIntake[index].TotalWater : 0; // Hvis der er vandindtag for timen, bruges det, ellers 0
        const burned = (caloriesBurned[index] && caloriesBurned[index].Calories) ? caloriesBurned[index].Calories : BMR / 24; // Hvis der er kalorier brændt for timen, bruges det sammen med BMR/24, ellers bruges kun BMR/24

        // Samler data for timen
        const hourData = {
            hour: intake.Hour,
            intake: intake.Calories,
            burned: burned,
            balance: intake.Calories - burned,
            totalWater: water
        };
        return hourData;
    });
    res.render('pages/nutritrackertimer', { hourlyData: hourlyBalance }); // Sender data til viewet
});



module.exports = {
    displayHourlyCalories,
    combinedTrackerView
};