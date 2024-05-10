const express = require("express");
const router = express.Router();
const { updateMealIngredient} = require("../controllers/mealIngredientController");

 //restful design for deleting meal ingredient

//Bruges ikke
//router.post('/:ID', updateMealIngredient); //restful design for updating meal ingredient

// Definerer en GET-rute '/mealIngredient', der sender et renderet HTML-svar med siden 'mealEditor'.
router.get('/mealIngredient', (req, res) => {res.render('pages/mealEditor');
});

module.exports = router;

