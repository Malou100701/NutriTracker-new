const Meal = require("../models/Meal");
const asyncHandler = require("../middlewares/asyncHandler");

//Oprettelse af et nyt måltid
const createMeal = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const userID = req.session.user.userID;

  // Opretter et nyt måltid i databasen og omdirigerer til oversigt over måltider
  await Meal.insertMealIntoDatabase(name, userID);
  res.redirect('/allMeals'); 
});


// Tilføjer alle måltider til tabellen
const addAllMeals = asyncHandler(async (req, res) => {
  const userID = req.session.user.userID; 

  // Henter og viser alle måltider tilhørende brugeren
  const meals = await Meal.addAllMealsIntoTable(userID);
  res.render('pages/allMeals', { meals: meals });
});


//Redigering af et måltid
const editMeal = asyncHandler(async (req, res) => {
  const mealID = req.params.ID;

  //Henter specifikke detaljer for måltidet og dets ingredienser
  const meal = await Meal.getMealByID(mealID);
  const ingredients = await Meal.getMealIngredients(mealID);
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients });
});


// Tilføjer en ingrediens til et måltid, samt dens mængde og næringsindhold
const addIngredient = asyncHandler(async (req, res) => {
  const mealID = req.params.ID;
  const ingredient = req.query.ingredient;
  const amount = req.query.amount;

  const meal = await Meal.getMealByID(mealID);

  // Tilføjer ingrediensen til måltidet i databasen
  await Meal.addIngredientToMeal(mealID, ingredient, amount);

  // Tilføjer næringsindtag per ingrediens ud fra mængde angivet i frontend. 
  await Meal.getTotalEnergy(mealID, ingredient);
  await Meal.getTotalProtein(mealID, ingredient);
  await Meal.getTotalFat(mealID, ingredient);
  await Meal.getTotalFiber(mealID, ingredient);

  // Henter en opdateret liste over alle ingredienser og deres næringsindhold for det valgte måltid.
  const ingredients = await Meal.getMealIngredients(mealID);

  // Opdaterer måltidets samlede næringsværdier
  await Meal.getTotalEnergyPerMeal(mealID);
  await Meal.getTotalProteinPerMeal(mealID);
  await Meal.getTotalFatPerMeal(mealID);
  await Meal.getTotalFiberPerMeal(mealID);
  //console.log(ingredients); - Brugt til testing

  // Sender måltidet og ingredienserne til redigeringssiden
  res.render('pages/mealEditor', { meal: meal, ingredients: ingredients, amount: amount });
});


// Slette et måltid
const deleteMeal = asyncHandler(async (req, res) => {
  const mealID = req.params.ID;

  // Sletter måltidet fra databasen
  await Meal.deleteMealFromDatabase(mealID);

  // Omdirigerer til siden med alle måltider efter sletning
  res.redirect('/allMeals');
});


// Slette en ingrediens fra et måltid
const deleteMealIngredient = asyncHandler(async (req, res) => {
  const mealID = req.params.ID;

  // Sletter ingredienserne fra måltidet i databasen
  await Meal.deleteMealIngredientFromDatabase(mealID);

  // Omdirigerer til redigeringssiden for måltidet
  res.redirect('/meal/' + mealID + '/edit');
});


module.exports = {
  createMeal,
  addAllMeals,
  editMeal,
  addIngredient,
  deleteMeal,
  deleteMealIngredient
 };
  
//Overordnet kommentarer: 
//Der bruges async for at kunne bruge await, som venter på at databasen svarer. Dette bruges for at undgå at databasen svarer for sent, og at programmet derfor ikke kan fortsætte.
//Module.exports = gør at andre filer i applikationen kan bruge funktionerne.
//req.params = bruges til at hente parametre fra URL'en
//req.query = bruges til at hente parametre fra forespørgslen
//req.body = bruges til at hente parametre fra forespørgslen
//req.session = bruges til at hente sessionen fra forespørgslen
//session = En måde at opbevare information om en brugers interaktion med en webapplikation på tværs af flere HTTP-anmodninger