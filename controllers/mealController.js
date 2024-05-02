const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");



// Controller for creating a new meal
const createMeal = asyncHandler(async(req, res, next) => {
  const {name} = req.body; //Ved ikke hvorfor dette, men google sagde det var nødvendigt

  let meal1 = new Meal(null,name);
  await meal1.insertMealIntoDatabase();

  res.status(201).json({
    success: true,
    data: {message: `Meal "${name}" created succesfully.`,}
})

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
  };
  
