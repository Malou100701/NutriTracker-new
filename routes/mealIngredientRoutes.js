const express = require("express");
const router = express.Router();
const {addMealIngredient, deleteMealIngredient, updateMealIngredient} = require("../controllers/mealIngredientController");

//router.get('/:name', searchIngredientForMeal);

router.post('/', addMealIngredient); //restful design for adding meal ingredient

router.delete('/:ID', deleteMealIngredient); //restful design for deleting meal ingredient

router.post('/:ID', updateMealIngredient); //restful design for updating meal ingredient

module.exports = router;

