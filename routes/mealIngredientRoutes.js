const express = require("express");
const router = express.Router();
const { updateMealIngredient} = require("../controllers/mealIngredientController");

 //restful design for deleting meal ingredient
<<<<<<< HEAD

// router.post('/:ID', updateMealIngredient); //restful design for updating meal ingredient
=======
//Bruges ikke
//router.post('/:ID', updateMealIngredient); //restful design for updating meal ingredient
>>>>>>> 46124f8 (Kommentarer til models: ingredient, inspector og meal)

router.get('/mealIngredient', (req, res) => {res.render('pages/mealEditor');
});

module.exports = router;

