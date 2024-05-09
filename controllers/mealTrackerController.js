const MealTracker = require("../models/MealTracker");
const asyncHandler = require("../middlewares/asyncHandler");


const trackMeal = asyncHandler(async (req, res) => {
    const { MealID, DateTime, Amount, latitude, longitude } = req.body;
    const UserID = req.session.user.userID;
    await MealTracker.trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude);
    res.redirect('/mealtracker');
  });
  
//   const renderMealTracker = asyncHandler(async (req, res) => {
//     const UserID = req.session.user.userID;
//     const intakes = await MealTracker.renderMeals(UserID);
//     console.log("intakes", intakes);
//     res.render('pages/mealTracker', {
//         user: req.session.user,
//         intakes: intakes
//     });
// });

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


// const getMeals = asyncHandler(async (req, res) => {
//   console.log("getMeals");
//   const UserID = req.session.user.userID;
//   const meals = await MealTracker.getMeals(UserID);
//   console.log("meals", meals);
//   res.render('pages/mealtracker', { user: req.session.user, meals: meals });
// });

const trackWater = asyncHandler(async (req, res) => {
  const { DateTime, Amount, latitude, longitude } = req.body;
  const UserID = req.session.user.userID;
  await MealTracker.trackWater(UserID, DateTime, Amount, latitude, longitude);
  res.redirect('/mealtracker');
});

const trackIngredient = asyncHandler(async (req, res) => {
  const { DateTime, IngredientID, Amount, latitude, longitude } = req.body;
  const UserID = req.session.user.userID;
  await MealTracker.trackIngredient(UserID, IntakeID, IngredientID, DateTime, Amount, latitude, longitude);
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