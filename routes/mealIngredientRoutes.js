const express = require("express");
const router = express.Router();
const { updateMealIngredient} = require("../controllers/mealIngredientController");

 //restful design for deleting meal ingredient

router.post('/:ID', updateMealIngredient); //restful design for updating meal ingredient

router.get('/mealIngredient', (req, res) => {res.render('pages/mealEditor');
});

module.exports = router;

