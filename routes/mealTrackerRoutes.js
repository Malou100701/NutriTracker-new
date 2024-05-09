const express = require("express");
const router = express.Router();
const mealTrackerController = require("../controllers/mealTrackerController");

router.post('/trackMeal', mealTrackerController.trackMeal);
router.get('/getMeals', mealTrackerController.getMeals);
router.get('/', mealTrackerController.renderMealTracker);
router.post('/update', mealTrackerController.updateMeal);
router.post('/water', mealTrackerController.trackWater);
router.get('/ingredient', mealTrackerController.trackIngredient);

module.exports = router;
