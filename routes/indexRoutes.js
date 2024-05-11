const express = require("express"); // Importere express
const router = express.Router(); // Opretter en router

//MEAL ROUTES
const mealRoutes = require("./mealRoutes"); // Importere mealRoutes
router.use("/meal", mealRoutes); // Bruger mealRoutes til at håndtere alle routes der starter med /meal
router.use("/allMeals", mealRoutes); // Bruger mealRoutes til at håndtere alle routes der starter med /allMeals
router.get("/mealCreator", function (req, res) { // Opretter en get route til /meal/mealCreator
    res.redirect("/meal/mealCreator"); // Redirecter til /meal/mealCreator
});
router.use("/mealIngredient", mealRoutes); // Bruger mealRoutes til at håndtere alle routes der starter med /mealIngredient


//INSPECTOR ROUTES
const inspectorRoutes = require("./inspectorRoutes"); // Importere inspectorRoutes
router.use('/inspector', inspectorRoutes); // Bruger inspectorRoutes til at håndtere alle routes der starter med /inspector


//USER ROUTES
const userRoutes = require("./userRoutes"); // Importere userRoutes
router.use("/user", userRoutes); // Bruger userRoutes til at håndtere alle routes der starter med /user
router.get('/login', function (req, res) { // Opretter en get route til /login
    res.redirect('/user/login'); // Redirecter til /user/login
});
router.get('/register', function (req, res) { // Opretter en get route til /register
    res.redirect('/user/register'); // Redirecter til /user/register
});

// NUTRI TRACKER ROUTES
const nutriTrackerRoutes = require("./nutriTrackerRoutes"); // Importere nutriTrackerRoutes
router.use("/nutritracker", nutriTrackerRoutes); // Bruger nutriTrackerRoutes til at håndtere alle routes der starter med /nutritracker



//ACTIVITY ROUTES
const activityRoutes = require("./activityRoutes"); // Importere activityRoutes
router.use("/activitytracker", activityRoutes); // Bruger activityRoutes til at håndtere alle routes der starter med /activitytracker


const mealTrackerRoutes = require("./mealTrackerRoutes"); // Importere mealTrackerRoutes
router.use("/mealtracker", mealTrackerRoutes); // Bruger mealTrackerRoutes til at håndtere alle routes der starter med /mealtracker

//INGREDIENT ROUTES
const ingredientRoutes = require("./ingredientRoutes"); // Importere ingredientRoutes
router.use("/ingredient", ingredientRoutes); // Bruger ingredientRoutes til at håndtere alle routes der starter med /ingredient

module.exports = router; // Eksporterer routeren