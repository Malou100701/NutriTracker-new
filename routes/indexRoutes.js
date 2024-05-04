const express = require("express");
const router = express.Router();

const mealRoutes = require("./mealRoutes");
router.use("/meal", mealRoutes);

const mealIngredientRoutes = require("./mealIngredientRoutes");
router.use("/mealIngredient", mealIngredientRoutes);

const inspectorRoutes = require("./inspectorRoutes");
router.use("/inspector", inspectorRoutes);

const userRoutes = require("./userRoutes");
router.use("/user", userRoutes);

const activityRoutes = require("./activityRoutes");
router.use("/activity", activityRoutes);

module.exports = router;

// Path: routes/mealRoutes.js