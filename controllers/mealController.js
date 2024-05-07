const Meal = require("../models/Meal");
const MealIngredient = require("../models/MealIngredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


// Controller for creating a new meal
const createMeal = asyncHandler(async (req, res, next) => {
  let name = req.body.name;
  let userID = req.session.user.userID;
  console.log(req.session.user);
  await Meal.insertMealIntoDatabase(name, userID);

  res.redirect('/allMeals'); // Redirect to allMeals page after creating a meal
});
  /*res.status(201).json({
    success: true,
    data: { message: `Meal "${name}" created successfully by user "${userID}"` }
  })*/
  //res.redirect('/allMeals'); // Redirect to allMeals page after creating a meal


const addAllMeals = asyncHandler(async (req, res, next) => {
    const userID = req.session.user.userID; // Assuming you have the user ID in the session
    const meals = await Meal.addAllMealsIntoTable(userID);
    res.render('pages/allMeals', { meals: meals }); // Pass the meals data to the EJS template
});


const editMeal = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  let meal = await Meal.getMealByID(mealID);
  let ingredients = await Meal.getMealIngredients(mealID);
  console.log(ingredients); 
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients });
});


const addIngredient = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  let ingredient = req.query.ingredient;
  let meal = await Meal.getMealByID(mealID);
  let amount = req.query.amount;
  await MealIngredient.updateMealIngredientInDatabase(mealID, ingredient, amount);
  await MealIngredient.addIngredientToMeal(mealID, ingredient);
  let ingredients = await Meal.getMealIngredients(mealID);
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients, amount: amount });
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
    editMeal,
    addIngredient,
    createMeal,
    deleteMeal,
    addAllMeals
  };
  
