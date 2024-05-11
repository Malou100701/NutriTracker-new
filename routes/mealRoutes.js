const express = require("express");
const router = express.Router();
const {editMeal, addIngredient, createMeal, addAllMeals, deleteMealIngredient, deleteMeal} = require("../controllers/mealController");

// Visning af 'mealCreator'-siden
router.get('/mealCreator', (req, res) => res.render('pages/mealCreator'));

// Oprettelse af et nyt måltid
router.post('/', createMeal); 

// Visning af et måltid
router.get('/:ID/edit', editMeal);

// Tilføje en ingrediens til et måltid
router.get('/:ID/addIngredient', addIngredient);

// Visning af 'mealIngredient'-siden
router.get('/mealIngredient', (req, res) => {res.render('pages/mealEditor');
});

// Tilføje alle måltider på siden
router.get('/', addAllMeals);

// Sletning af et måltid
router.post('/:ID/deleteMeal', deleteMeal); 

// Sletning af en ingrediens fra et måltid
router.post('/:ID/delete', deleteMealIngredient);

module.exports = router;

