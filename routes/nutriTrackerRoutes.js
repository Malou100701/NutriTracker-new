const express = require("express"); // Importere express
const router = express.Router(); // Opretter en router
const nutriTrackerController = require("../controllers/nutriTrackerController"); // Importere controlleren

router.get('/', nutriTrackerController.combinedTrackerView); // Opretter en get route til at hente kalorier brændt og intaget, samt vand og balance for de sidste 30 dage når siden loades
router.get('/view', nutriTrackerController.displayHourlyCalories); // Opretter en get route til at hente kalorier brændt og intaget, samt vand og balance for i dag når siden loades

module.exports = router;