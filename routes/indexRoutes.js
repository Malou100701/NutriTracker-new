const express = require("express");
const router = express.Router();

const mealRoutes = require("./mealRoutes");
router.use("/meal", mealRoutes);

const inspectorRoutes = require("./inspectorRoutes");
router.use("/inspector", inspectorRoutes);

const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

module.exports = router;

// Path: routes/mealRoutes.js