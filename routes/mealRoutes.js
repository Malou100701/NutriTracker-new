const express = require("express");
const router = express.Router();
const {editMeal, addIngredient, createMeal, addAllMeals, deleteMealIngredient, deleteMeal} = require("../controllers/mealController");

// Route for creating a new meal
router.post('/', createMeal); //restful design for creating a meal

// Route for viewing a meal
router.get('/:ID/edit', editMeal);

router.get('/:ID/addIngredient', addIngredient);

// Route for deleting a meal
router.post('/:ID/deleteMeal', deleteMeal); 

router.get('/', addAllMeals);

//router.get('/:mealID/totalNutrient', getTotalNutrient);
router.post('/:ID/delete', deleteMealIngredient);

router.get('/mealCreator', (req, res) => res.render('pages/mealCreator'));

module.exports = router;

