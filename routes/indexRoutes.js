const express = require("express");
const router = express.Router();

const mealRoutes = require("./mealRoutes");
router.use("/meal", mealRoutes);

module.exports = router;