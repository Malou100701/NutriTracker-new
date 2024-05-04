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

const deleteMealIngredient = asyncHandler(async (req, res, next) => {
    let mealIngredient = new MealIngredient(req.params.ID);
    await mealIngredient.deleteMealIngredientFromDatabase();

    res.status(200).json({
        success: true,
        data: { message: `Meal ingredient with ID "${req.params.ID}" deleted successfully.` }
    });

//vi skal undersøge nærmere om det kan blive et problem, hvis delete fejler, med et id der fx ikke findes.
});

module.exports = {
    addMealIngredient,
    deleteMealIngredient,
  };

