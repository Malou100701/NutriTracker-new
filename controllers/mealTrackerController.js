const MealTracker = require("../models/MealTracker");
const asyncHandler = require("../middlewares/asyncHandler");

const trackMeal = asyncHandler(async (req, res) => {
    const { MealID, DateTime, Amount } = req.body;
    const UserID = req.session.user.userID;
    console.log('Session user:', req.session.user + 'body ' + { MealID, DateTime, Amount }); // Log session user
    await MealTracker.trackMeal(UserID, MealID, DateTime, Amount);
    res.status(200).json({ success: true, message: "Meal tracked" });

    });

const getMeals = asyncHandler(async (req, res) => {
  console.log("1");
  const UserID = req.session.user.userID;
  console.log("2");
  const meals = await MealTracker.getMeals(UserID);
  console.log("3");
  console.log('Meals in controller:', { meals });
  res.render('pages/mealTracker', { user: req.session.user, meals: meals });
});

module.exports = {
    trackMeal,
    getMeals
    }