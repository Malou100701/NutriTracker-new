const express = require("express");
const router = express.Router();
const {editMeal, addIngredient, createMeal, addAllMeals, deleteMealIngredient, deleteMeal} = require("../controllers/mealController");

// Opretter en POST-rute til oprettelse af et nyt måltid
router.post('/', createMeal); 

// Rute til visning af et måltid
router.get('/:ID/edit', editMeal);

// Rute til at tilføje en ingrediens til et måltid
router.get('/:ID/addIngredient', addIngredient);

// Rute til sletning af et måltid
router.post('/:ID/deleteMeal', deleteMeal); 

// Rute til at tilføje alle måltider
router.get('/', addAllMeals);

// Rute til sletning af en ingrediens fra et måltid
router.post('/:ID/delete', deleteMealIngredient);

// Rute til visning af 'mealCreator'-siden
router.get('/mealCreator', (req, res) => res.render('pages/mealCreator'));

module.exports = router;

