const express = require("express");
const router = express.Router();
const mealTrackerController = require("../controllers/mealTrackerController");

router.post('/trackMeal', mealTrackerController.trackMeal);
router.get('/getMeals', mealTrackerController.getMeals);
router.get('/', mealTrackerController.renderMealTracker);
router.post('/update/:intakeId', mealTrackerController.updateMeal);

module.exports = router;
