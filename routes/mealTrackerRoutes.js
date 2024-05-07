const express = require("express");
const router = express.Router();
const mealTrackerController = require("../controllers/mealTrackerController");

router.post('/trackMeal', mealTrackerController.trackMeal);
router.get('/getMeals', mealTrackerController.getMeals);

module.exports = router;
