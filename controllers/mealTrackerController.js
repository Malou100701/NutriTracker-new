const MealTracker = require("../models/MealTracker"); // Importerer modellen
const asyncHandler = require("../middlewares/asyncHandler"); // Importerer middleware

// Controller til at logge et måltid
const trackMeal = asyncHandler(async (req, res) => {
  const { MealID, DateTime, Amount, latitude, longitude } = req.body; // Henter data fra request body
  const UserID = req.session.user.userID; // Henter brugerens ID fra session
  await MealTracker.trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude); // Kalder funktionen trackMeal fra modellen
  res.redirect('/mealtracker');
});

// Funktion til at formatere dato og tid til SQL-format
const formatDateTimeForSQL = (isoString) => {
  const dateTime = new Date(isoString); // Konvertere fra ISO string til Date objekt
  return dateTime.toISOString().replace('T', ' ').slice(0, 19); // Konvertere 'YYYY-MM-DD HH:MM:SS'
};

// Controller til at opdatere et måltid
const updateMeal = asyncHandler(async (req, res) => {
  const { IntakeID, DateTime, Amount } = req.body; // Henter data fra request body
  const UserID = req.session.user.userID; // Henter brugerens ID fra session
  const formattedDateTime = formatDateTimeForSQL(DateTime); // Formatterer dato og tid til SQL-format

  const affectedRows = await MealTracker.updateMeal(UserID, IntakeID, formattedDateTime, Amount); // Kalder funktionen updateMeal fra modellen
  if (affectedRows > 0) { // Hvis der er blevet opdateret noget
    res.redirect('/mealtracker'); // Redirect tilbage til mealtracker siden
  } else {
    res.send('No changes made or meal not found.'); // Hvad der skal ske, hvis der ikke er blevet opdateret noget
  }
});

// Controller til at håndtere måltider
const handleMeals = asyncHandler(async (req, res) => {
  const UserID = req.session.user.userID; // Henter brugerens ID fra session
  const meals = await MealTracker.getMeals(UserID); // Henter alle måltider lavet for brugeren
  const intakes = await MealTracker.renderMeals(UserID); // Henter alle måltider der er indtaget for brugeren
  res.render('pages/mealtracker', { user: req.session.user, meals: meals, intakes: intakes }); // Sender data til viewet, da vand også ligger i intakes, så vi kan vise det samlet
});

// Controller til at logge vandindtag
const trackWater = asyncHandler(async (req, res) => {
  const { DateTime, Amount, latitude, longitude } = req.body; // Henter data fra request body
  const UserID = req.session.user.userID; // Henter brugerens ID fra session
  await MealTracker.trackWater(UserID, DateTime, Amount, latitude, longitude); // Kalder funktionen trackWater fra modellen
  res.redirect('/mealtracker'); // Vand er registreret i intakes, så den bliver vist i viewet i handleMeals controlleren ovenfor
});

// Controller til at logge et enkelt ingrediensindtag
const trackIngredient = asyncHandler(async (req, res) => {
  const { DateTime, IngredientID, Amount, latitude, longitude } = req.body; // Henter data fra request body
  const UserID = req.session.user.userID; // Henter brugerens ID fra session
  await MealTracker.trackIngredient(UserID, IngredientID, DateTime, Amount, latitude, longitude); // Kalder funktionen trackIngredient fra modellen
  res.redirect('/mealtracker'); // Ingrediens er registreret i intakes, så den bliver vist i viewet i handleMeals controlleren ovenfor
});

// Controller til at slette et måltid fra intakes
const deleteMeal = asyncHandler(async (req, res) => {
  const { IntakeID } = req.body; // Henter data fra request body
  const affectedRows = await MealTracker.deleteMeal(IntakeID); // Kalder funktionen deleteMeal fra modellen
  if (affectedRows > 0) { // Hvis der er blevet slettet noget
    res.redirect('/mealtracker'); // Redirect back to the meal tracker page
  }
});

module.exports = {
  trackMeal,
  updateMeal,
  trackWater,
  trackIngredient,
  deleteMeal,
  handleMeals
}