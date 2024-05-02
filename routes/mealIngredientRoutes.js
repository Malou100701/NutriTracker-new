const express = require("express");
const router = express.Router();
const {addMealIngredient} = require("../controllers/mealIngredientController");


router.post('/add', addMealIngredient);

module.exports = router;

