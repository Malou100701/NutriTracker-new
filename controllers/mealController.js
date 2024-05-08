const Meal = require("../models/Meal");
const MealIngredient = require("../models/MealIngredient");
const Ingredient = require("../models/Ingredient");
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


<<<<<<< HEAD
const addAllMeals = asyncHandler(async (req, res, next) => {
    const userID = req.session.user.userID; // Assuming you have the user ID in the session
    const meals = await Meal.addAllMealsIntoTable(userID);
    let mealID = req.params.ID;
    //await Meal.getTotalEnergyForMeal(mealID);
    res.render('pages/allMeals', { meals: meals }); // Pass the meals data to the EJS template
});


=======
>>>>>>> da5dc4a (virker ikke den total energy for et meal samlet)
const editMeal = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  let meal = await Meal.getMealByID(mealID);
  let ingredients = await Meal.getMealIngredients(mealID);
  //console.log(ingredients); 
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients });
});


const addIngredient = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  let ingredient = req.query.ingredient;
  let meal = await Meal.getMealByID(mealID);
  let amount = req.query.amount;
  console.log(amount);
  await MealIngredient.addIngredientToMeal(mealID, ingredient, amount);
  //await MealIngredient.updateMealIngredientInDatabase(mealIngredientID, amount); - Bruges ikke endnu
  await Meal.getTotalEnergy(mealID, ingredient);
  await Meal.getTotalProtein(mealID, ingredient);
  await Meal.getTotalFat(mealID, ingredient);
  await Meal.getTotalFiber(mealID, ingredient);
  let ingredients = await Meal.getMealIngredients(mealID);
  //console.log(ingredients); - Brugt til fejlsøgning
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients, amount: amount });
});

const addAllMeals = asyncHandler(async (req, res, next) => {
  const userID = req.session.user.userID; // Assuming you have the user ID in the session
  // Retrieve all meals for the user
  const mealID = req.params.ID;
  const meals = await Meal.addAllMealsIntoTable(userID);
  await Meal.getTotalEnergyForMeal(mealID);
  //console.log(totalCalories);
  // Render the meals page with updated meals data including total calories
  res.render('pages/allMeals', { meals: meals });
});


//når vi sletter et måltid, så skal den kunne slette dens meal ingredients også.
const deleteMeal = asyncHandler(async (req, res, next) => {
  let mealID = req.params.ID;
  await Meal.deleteMealFromDatabase(mealID);
  res.redirect('/allMeals');
});

  const deleteMealIngredient = asyncHandler(async (req, res, next) => {
    let mealID = req.params.ID;
    console.log(mealID);
    await Meal.deleteMealIngredientFromDatabase(mealID);
    res.redirect('/meal/' + mealID + '/edit');
//vi skal undersøge nærmere om det kan blive et problem, hvis delete fejler, med et id der fx ikke findes.
});

  module.exports = {
    //getTotalNutrient, - Den er slettet?
    editMeal,
    addIngredient,
    createMeal,
    deleteMeal,
    addAllMeals,
    deleteMealIngredient
  };
  
