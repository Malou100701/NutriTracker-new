const express = require("express");
const router = express.Router();

//MEAL ROUTES
const mealRoutes = require("./mealRoutes");
router.use("/meal", mealRoutes);
router.use("/allMeals", mealRoutes);
router.get("/mealCreator", function (req, res) {
    res.redirect("/meal/mealCreator");
});


const mealIngredientRoutes = require("./mealIngredientRoutes");
router.use("/mealIngredient", mealIngredientRoutes);
router.use("/allMeals", mealIngredientRoutes);

//INSPECTOR ROUTES
const inspectorRoutes = require("./inspectorRoutes");
router.use('/inspector', inspectorRoutes);
router.get('/inspector', function (req, res) {
    res.redirect('/inspector/inspector');
});

//USER ROUTES
const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);
router.get('/login', function (req, res) {
	res.redirect('/user/login');
});
router.get('/register', function (req, res) {
    res.redirect('/user/register');
});

//ACTIVITY ROUTES
const activityRoutes = require("./activityRoutes");
router.use("/activitytracker", activityRoutes);

module.exports = router;

// Path: routes/mealRoutes.js