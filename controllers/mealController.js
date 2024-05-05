const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


// Controller for creating a new meal
const createMeal = asyncHandler(async (req, res, next) => {

  let name = req.body.name;
  await Meal.insertMealIntoDatabase(name, userID);
  res.redirect('/allMeals'); // Redirect to allMeals page after creating a meal

  res.status(201).json({
    success: true,
    data: { message: `Meal "${name}" created successfully by user "${userID}"` }
  });
});

//når vi sletter et måltid, så skal den kunne slette dens meal ingredients også.

const deleteMeal = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  await Meal.deleteMealFromDatabase(mealID);

  res.status(200).json({
    success: true,
    data: { message: `Meal with ID "${mealID}" deleted successfully.` }
  });
});


// Controller for totalNutrient registration
const getTotalNutrient = asyncHandler(async (req, res, next) => {
    
    let mealID = req.params.mealID;
    let totalNutrient = Meal.getTotalNutrient();

    res.status(201).json({
      success: true,
      data: {
        message: totalNutrient.toString()
      }
    });
  });

  module.exports = {
    getTotalNutrient,
    createMeal,
    deleteMeal,
  };
  
