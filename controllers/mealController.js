// Impot af modeller og middleware
const Meal = require("../models/Meal");
const Ingredient = require("../models/Ingredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");


// Controller for oprettelse af et nyt måltid
const createMeal = asyncHandler(async (req, res, next) => {
  //Henter navn og brugerens ID fra request body og session
  let name = req.body.name;
  let userID = req.session.user.userID;
  
  //console.log(req.session.user); - Brugt til test
  
  //Insætter et nyt måltid i databasen
  await Meal.insertMealIntoDatabase(name, userID);

  // Omdirigerer til siden med alle måltider efter oprettelse
  res.redirect('/allMeals'); 
});



// Controller til at tilføje alle måltider til tabel
const addAllMeals = asyncHandler(async (req, res, next) => {
  //Henter brugerens ID fra session
  const userID = req.session.user.userID; 
  
  //Henter alle måltider for brugeren
  const meals = await Meal.addAllMealsIntoTable(userID);

  // Sender måltiderne til visningssiden
  res.render('pages/allMeals', { meals: meals });
});


//Controller til redigering af et måltid
const editMeal = asyncHandler(async (req, res, next) => {
  // Henter måltids ID fra URL'en
  let mealID = req.params.ID;

  // Henter måltidet og ingredienserne fra databasen
  let meal = await Meal.getMealByID(mealID);
  let ingredients = await Meal.getMealIngredients(mealID);
  //console.log(ingredients); - Brugt til testing

  // Sender måltidet og ingredienserne til redigeringssiden
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients });
});


// Controller til at tilføje en ingredient til et måltid
const addIngredient = asyncHandler(async (req, res, next) => {
  // Henter måltids ID og ingrediens navn fra forespørgslen. 
  let mealID = req.params.ID;
  let ingredient = req.query.ingredient;

  // Henter måltidet fra databasen
  let meal = await Meal.getMealByID(mealID);

  // Henter mængde fra forespørgslen
  let amount = req.query.amount;
  //console.log(amount); - Brugt til testing

  // Tilføjet ingrediensen til måltidet, samt mængden i databasen
  await Meal.addIngredientToMeal(mealID, ingredient, amount);

  // Tilføjer næringsindtag per ingrediens ud fra mængde angivet i frontend. 
  await Meal.getTotalEnergy(mealID, ingredient);
  await Meal.getTotalProtein(mealID, ingredient);
  await Meal.getTotalFat(mealID, ingredient);
  await Meal.getTotalFiber(mealID, ingredient);

  // Henter alle ingredienser til det pågældende måltid fra databasen
  let ingredients = await Meal.getMealIngredients(mealID);

  // Summere næringsindtaget per måltid, ud fra tidligere kalkuleret næring per ingrediens
  await Meal.getTotalEnergyPerMeal(mealID);
  await Meal.getTotalProteinPerMeal(mealID);
  await Meal.getTotalFatPerMeal(mealID);
  await Meal.getTotalFiberPerMeal(mealID);

  //console.log(ingredients); - Brugt til testing

  // Sender måltidet og ingredienserne til redigeringssiden
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients, amount: amount });
});


// Controller til at slette et måltid
const deleteMeal = asyncHandler(async (req, res, next) => {
  // Henter måltids ID fra URL'en
  let mealID = req.params.ID;

  // Sletter måltidet fra database
  await Meal.deleteMealFromDatabase(mealID);

  // Omdirigerer til siden med alle måltider efter sletning
  res.redirect('/allMeals');
});


// Controller til at slette en ingrediens fra et måltid
const deleteMealIngredient = asyncHandler(async (req, res, next) => {
  // Henter måltids ID fra URL'en
  let mealID = req.params.ID;
  //console.log(mealID); - brugt til testing

  // Sletter ingredienserne fra måltidet i databasen
  await Meal.deleteMealIngredientFromDatabase(mealID);

  // Omdirigerer til redigeringssiden for det pågældende måltid.
  res.redirect('/meal/' + mealID + '/edit');
});

// Eksporterer controllerne til brug i andre dele af applikationen
module.exports = {
  editMeal,
  addIngredient,
  createMeal,
  deleteMeal,
  addAllMeals,
  deleteMealIngredient
 };
  
