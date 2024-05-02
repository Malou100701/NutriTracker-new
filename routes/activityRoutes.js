const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.post('/logActivity', activityController.logActivity);



module.exports = router;