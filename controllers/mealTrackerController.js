const MealTracker = require("../models/MealTracker");
const asyncHandler = require("../middlewares/asyncHandler");

// const trackMeal = asyncHandler(async (req, res) => {
//     const { MealID, DateTime, Amount } = req.body;
//     const UserID = req.session.user.userID;
//     console.log('Session user:', req.session.user + 'body ' + { MealID, DateTime, Amount }); // Log session user
//     await MealTracker.trackMeal(UserID, MealID, DateTime, Amount);
//     res.status(200).json({ success: true, message: "Meal tracked" });

//     });

const trackMeal = asyncHandler(async (req, res) => {
    const { MealID, DateTime, Amount, latitude, longitude } = req.body;
    console.log('DateTime in Controller' + DateTime); // Logs the DateTime received from the form
    const UserID = req.session.user.userID;
    console.log('Session user:', req.session.user + 'body ' + { MealID, DateTime, Amount, latitude, longitude }); // Log session user and geolocation
    await MealTracker.trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude);
    res.redirect('/mealtracker');
  });
  



const getMeals = asyncHandler(async (req, res) => {
  const UserID = req.session.user.userID;
  const meals = await MealTracker.getMeals(UserID);
  res.render('pages/mealTracker', { user: req.session.user, meals: meals });
});

module.exports = {
    trackMeal,
    getMeals
    }