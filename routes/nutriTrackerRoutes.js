const express = require("express");
const router = express.Router();
const nutriTrackerController = require("../controllers/nutriTrackerController");

router.get('/view', nutriTrackerController.combinedTrackerView);


module.exports = router;