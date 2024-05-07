const express = require("express");
const router = express.Router();
const {editMeal, addIngredient, getTotalNutrient, createMeal, addAllMeals, deleteMeal} = require("../controllers/mealController");

// Route for creating a new meal
router.post('/', createMeal); //restful design for creating a meal

// Route for viewing a meal
router.get('/:ID/edit', editMeal);

router.get('/:ID/addIngredient', addIngredient);

// Route for deleting a meal
router.delete('/:ID', deleteMeal); 

router.get('/', addAllMeals);

router.get('/:mealID/totalNutrient', getTotalNutrient);

router.get ('/mealCreator', (req, res) => res.render('pages/mealCreator'));

module.exports = router;

