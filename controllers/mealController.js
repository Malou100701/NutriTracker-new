const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
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

module.exports = getTotalNutrient;

