const MealIngredient = require("../models/MealIngredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


const addMealIngredient = asyncHandler(async (req, res, next) => {

    const { mealID, ingredientID, amount } = req.body;

    const mealIngredient = new MealIngredient(mealID, ingredientID, amount);
    await mealIngredient.insertMealIngredientIntoDatabase();

    res.status(201).json({
        success: true,
        data: { message: `Meal ingredient inserted successfully.` }
    });
});



module.exports = {
    addMealIngredient,
  };

