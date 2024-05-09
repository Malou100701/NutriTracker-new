const express = require("express");
const router = express.Router();
const mealTrackerController = require("../controllers/mealTrackerController");

router.post('/trackMeal', mealTrackerController.trackMeal);
// router.get('/getMeals', mealTrackerController.getMeals);
router.get('/', mealTrackerController.handleMeals);

router.post('/update', mealTrackerController.updateMeal);
router.post('/water', mealTrackerController.trackWater);
router.post('/ingredient', mealTrackerController.trackIngredient);
router.post('/delete', mealTrackerController.deleteMeal);

module.exports = router;
