const MealIngredient = require("../models/MealIngredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


/* const searchIngredientForMeal = asyncHandler(async (req, res, next) => {  
    let name = req.params.name;
    const result = await MealIngredient.searchIngredient(name);
    res.status(200).json({ success: true, data: result });
}); */


const addMealIngredient = asyncHandler(async (req, res, next) => {
    const { mealID, ingredientName } = req.body;
   // console.log('Received request to add meal ingredient:', { mealID, ingredientName }); - Brugt til at teste
    await MealIngredient.addIngredientToMeal(mealID, ingredientName);

    res.status(201).json({
        success: true,
        data: { message: `Meal ingredient inserted successfully.` }
    });
}); 

const deleteMealIngredient = asyncHandler(async (req, res, next) => {
    let ID = req.params.ID;
    await MealIngredient.deleteMealIngredientFromDatabase(ID);

    res.status(200).json({
        success: true,
        data: { message: `Meal ingredient with ID "${ID}" deleted successfully.` }
    });
    
//vi skal undersøge nærmere om det kan blive et problem, hvis delete fejler, med et id der fx ikke findes.
});

const updateMealIngredient = asyncHandler(async (req, res, next) => {
    let {ID, amount} = req.body; // Assuming the request body contains both id and amount
    await MealIngredient.updateMealIngredientInDatabase(ID, amount);

    res.status(200).json({
        success: true,
        data: { message: `Meal ingredient with ID ${ID} has new amount ${amount} and is updated successfully.` }
    });

});

module.exports = {
    addMealIngredient,
    //searchIngredientForMeal,
    deleteMealIngredient,
    updateMealIngredient,
  };

