const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.post('/logActivity', activityController.logActivity);
router.get('/getActivities', activityController.getActivities);




module.exports = router;