const MealIngredient = require("../models/MealIngredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");
 
// Denne er ikke implementeret da vi ikke fandt den essentiel.
// Kan implementeres senere i forløbet hvis nødvendigt


/*
const updateMealIngredient = asyncHandler(async (req, res, next) => {
    let {ID, amount} = req.body; // Assuming the request body contains both id and amount
    await MealIngredient.updateMealIngredientInDatabase(ID, amount);

    res.status(200).json({
        success: true,
        data: { message: `Meal ingredient with ID ${ID} has new amount ${amount} and is updated successfully.` }
    });

});

module.exports = {
    updateMealIngredient,
  };
*/
