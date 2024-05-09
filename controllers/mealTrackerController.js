const MealTracker = require("../models/MealTracker");
const asyncHandler = require("../middlewares/asyncHandler");


const trackMeal = asyncHandler(async (req, res) => {
    const { MealID, DateTime, Amount, latitude, longitude } = req.body;
    const UserID = req.session.user.userID;
    await MealTracker.trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude);
    res.redirect('/mealtracker');
  });


const formatDateTimeForSQL = (isoString) => {
  const dateTime = new Date(isoString);
  return dateTime.toISOString().replace('T', ' ').slice(0, 19); // Converts to 'YYYY-MM-DD HH:MM:SS'
};

const updateMeal = asyncHandler(async (req, res) => {
  const { IntakeID, DateTime, Amount } = req.body;
  const UserID = req.session.user.userID;
  const formattedDateTime = formatDateTimeForSQL(DateTime);

      const affectedRows = await MealTracker.updateMeal(UserID, IntakeID, formattedDateTime, Amount);
      if (affectedRows > 0) {
          res.redirect('/mealtracker'); // Redirect back to the meal tracker page
      } else {
          res.send('No changes made or meal not found.'); // Handle no update scenario
      }
  });


  const handleMeals = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID;
    const meals = await MealTracker.getMeals(UserID);
    const intakes = await MealTracker.renderMeals(UserID);

    res.render('pages/mealtracker', { user: req.session.user, meals: meals, intakes: intakes});
  });



const trackWater = asyncHandler(async (req, res) => {
  const { DateTime, Amount, latitude, longitude } = req.body;
  const UserID = req.session.user.userID;
  await MealTracker.trackWater(UserID, DateTime, Amount, latitude, longitude);
  res.redirect('/mealtracker');
});

const trackIngredient = asyncHandler(async (req, res) => {
  console.log(req.body);  // Log the request body to see what is being received
  const { DateTime, IngredientID, Amount, latitude, longitude } = req.body;
  const UserID = req.session.user.userID;
  await MealTracker.trackIngredient(UserID, IngredientID, DateTime, Amount, latitude, longitude);
  res.redirect('/mealtracker');
});

const deleteMeal = asyncHandler(async (req, res) => {
  const { IntakeID } = req.body;
  const affectedRows = await MealTracker.deleteMeal(IntakeID);
  if (affectedRows > 0) {
      res.redirect('/mealtracker'); // Redirect back to the meal tracker page
  }
});

module.exports = {
    trackMeal,
    updateMeal, 
    trackWater,
    trackIngredient,
    deleteMeal,
    handleMeals
    }