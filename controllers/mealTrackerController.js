const MealTracker = require("../models/MealTracker");
const asyncHandler = require("../middlewares/asyncHandler");


const trackMeal = asyncHandler(async (req, res) => {
    const { MealID, DateTime, Amount, latitude, longitude } = req.body;
    console.log('DateTime in Controller' + DateTime); // Logs the DateTime received from the form
    const UserID = req.session.user.userID;
    await MealTracker.trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude);
    res.redirect('/mealtracker');
  });
  
  const renderMealTracker = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const meals = await MealTracker.renderMeals(UserID);
    console.log(meals);
    res.render('pages/mealTracker', {
        user: req.session.user,
        meals: meals
    });
});

const formatDateTimeForSQL = (isoString) => {
  const dateTime = new Date(isoString);
  return dateTime.toISOString().replace('T', ' ').slice(0, 19); // Converts to 'YYYY-MM-DD HH:MM:SS'
};

const updateMeal = asyncHandler(async (req, res) => {
  const { IntakeID, DateTime, Amount } = req.body;
  console.log(IntakeID, DateTime, Amount);
  const UserID = req.session.user.userID;
  const formattedDateTime = formatDateTimeForSQL(DateTime);

      const affectedRows = await MealTracker.updateMeal(IntakeID, UserID, formattedDateTime, Amount);
      if (affectedRows > 0) {
          res.redirect('/mealtracker'); // Redirect back to the meal tracker page
      } else {
          res.send('No changes made or meal not found.'); // Handle no update scenario
      }
  });

const getMeals = asyncHandler(async (req, res) => {
  const UserID = req.session.user.userID;
  const meals = await MealTracker.getMeals(UserID);
  res.render('pages/mealTracker', { user: req.session.user, meals: meals });
});

module.exports = {
    trackMeal,
    getMeals,
    renderMealTracker,
    updateMeal
    }