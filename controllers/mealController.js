const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const getTotalEnergy = asyncHandler(async (req, res, next) => {
    
    let meal = new Meal(req.params.mealID);
    let totalEnergy = meal.getTotalEnergy();
    //res.send(totalEnergy.toString());


    res.status(201).json({
      success: true,
      data: {
        message: totalEnergy.toString()
      }
    });
  });

module.exports = getTotalEnergy;

