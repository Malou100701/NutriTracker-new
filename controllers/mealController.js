const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


// Controller for creating a new meal
const createMeal = asyncHandler(async (req, res, next) => {
  let { Name } = req.body;

  let meal = new Meal(null, Name);
  await meal.insertMealIntoDatabase();

  res.status(201).json({
    success: true,
    data: { message: `Meal "${Name}" created successfully.` }
  });
});


const deleteMeal = asyncHandler(async (req, res, next) => {
  let meal = new Meal(req.params.ID);
  await meal.deleteMealFromDatabase();

  res.status(200).json({
    success: true,
    data: { message: `Meal with ID "${req.params.ID}" deleted successfully.` }
  });
});


// Controller for totalNutrient registration
const getTotalNutrient = asyncHandler(async (req, res, next) => {
    
    let meal = new Meal(req.params.mealID);
    let totalNutrient = meal.getTotalNutrient();



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
  
