const express = require("express");
const router = express.Router();
const {addMealIngredient, deleteMealIngredient} = require("../controllers/mealIngredientController");

router.post('/', addMealIngredient); //restful design for adding meal ingredient

router.delete('/:ID', deleteMealIngredient); //restful design for deleting meal ingredient

module.exports = router;

