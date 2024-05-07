const express = require("express");
const router = express.Router();
const nutriTrackerController = require("../controllers/nutriTrackerController");

router.get('/', nutriTrackerController.combinedTrackerView);
router.get('/view', nutriTrackerController.displayHourlyCalories);


module.exports = router;